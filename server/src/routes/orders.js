import express from 'express'
import crypto  from 'crypto'
import { db }  from '../config/firebase.js'
import { verifyToken, verifyAdmin } from '../middleware/auth.js'
import { sendOrderConfirmation, sendShippingEmail, sendDeliveryEmail } from '../utils/email.js'

const router = express.Router()

const MERCHANT_ID     = process.env.PAYHERE_MERCHANT_ID
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET
const PAYHERE_URL     = process.env.PAYHERE_SANDBOX === 'true'
  ? 'https://sandbox.payhere.lk/pay/checkout'
  : 'https://www.payhere.lk/pay/checkout'
const NOTIFY_URL      = process.env.PAYHERE_NOTIFY_URL || ''

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
}

function buildHash(orderId, amount) {
  const amountStr  = parseFloat(amount).toFixed(2)
  const secretHash = md5(MERCHANT_SECRET)
  return md5(MERCHANT_ID + orderId + amountStr + 'LKR' + secretHash)
}

// Convert Firestore Timestamps to ISO strings so JSON serialization works correctly
function serializeOrder(doc) {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
  }
}

// ── GET all orders (admin only) ───────────────────────────────────────────
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get()
    res.json(snapshot.docs.map(serializeOrder))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/orders/:id/ship — mark shipped + save courier info + send email ─
router.post('/:id/ship', verifyAdmin, async (req, res) => {
  const { courierName, trackingNumber, trackingUrl } = req.body
  if (!courierName || !trackingNumber) {
    return res.status(400).json({ error: 'Courier name and tracking number are required' })
  }
  try {
    await db.collection('orders').doc(req.params.id).update({
      status:     'shipped',
      shipping:   { courierName, trackingNumber, trackingUrl: trackingUrl || null },
      updatedAt:  new Date(),
    })

    const orderDoc = await db.collection('orders').doc(req.params.id).get()
    const order    = { id: orderDoc.id, ...orderDoc.data() }

    sendShippingEmail(order, { courierName, trackingNumber, trackingUrl }).catch(err =>
      console.error('Shipping email failed:', err.message)
    )

    res.json({ message: 'Order shipped' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PATCH update order status (admin only) ────────────────────────────────
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'status is required' })
  try {
    await db.collection('orders').doc(req.params.id).update({ status, updatedAt: new Date() })

    // Send delivery feedback email when marked as delivered
    if (status === 'delivered') {
      const orderDoc = await db.collection('orders').doc(req.params.id).get()
      const order    = { id: orderDoc.id, ...orderDoc.data() }
      sendDeliveryEmail(order).catch(err =>
        console.error('Delivery email failed:', err.message)
      )
    }

    res.json({ message: 'Status updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET all orders for the logged-in user ─────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get()
    res.json(snapshot.docs.map(serializeOrder))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET single order ──────────────────────────────────────────────────────
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Order not found' })
    res.json(serializeOrder(doc))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /initiate — create pending order + return PayHere payment params ─
router.post('/initiate', async (req, res) => {
  try {
    const { items, customer, userId, amount } = req.body

    if (!items?.length || !customer || !amount) {
      return res.status(400).json({ error: 'items, customer and amount are required' })
    }

    const orderId = `LERD-${Date.now()}`

    const orderData = {
      orderId,
      userId:    userId || null,
      items,
      customer,
      amount:    parseFloat(amount),
      currency:  'LKR',
      status:    'pending',
      createdAt: new Date(),
      orderDate: new Date().toISOString(),
    }

    await db.collection('orders').doc(orderId).set(orderData)

    // Removed: email was firing before payment was confirmed (on pending status).
    // Confirmation email is now sent only by the /notify webhook after PayHere confirms payment.
    // sendOrderConfirmation(orderData).catch(err =>
    //   console.error('Email send failed:', err.message)
    // )

    res.json({
      merchant_id:  MERCHANT_ID,
      order_id:     orderId,
      hash:         buildHash(orderId, amount),
      amount:       parseFloat(amount).toFixed(2),
      currency:     'LKR',
      notify_url:   NOTIFY_URL,
      payhere_url:  PAYHERE_URL,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /notify — PayHere server-to-server payment confirmation ──────────
// PayHere calls this with application/x-www-form-urlencoded
router.post('/notify', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const {
      merchant_id, order_id, payhere_amount,
      payhere_currency, status_code, md5sig,
    } = req.body

    // Verify the signature PayHere sends
    const expectedSig = md5(
      merchant_id + order_id + payhere_amount +
      payhere_currency + status_code + md5(MERCHANT_SECRET)
    )

    if (expectedSig !== md5sig) {
      return res.status(400).send('Invalid signature')
    }

    const statusMap = { '2': 'paid', '0': 'pending', '-1': 'cancelled', '-2': 'failed', '-3': 'chargedback' }
    const status    = statusMap[String(status_code)] || 'unknown'

    await db.collection('orders').doc(order_id).update({
      status,
      paymentId:  req.body.payment_id || null,
      updatedAt:  new Date(),
    })

    // On successful payment: clear cart + send confirmation email
    if (status === 'paid') {
      const orderDoc  = await db.collection('orders').doc(order_id).get()
      const orderData = orderDoc.data()

      // Clear Firestore cart
      if (orderData?.userId) {
        await db.collection('carts').doc(orderData.userId).set({ items: [], updatedAt: new Date() })
      }

      // Send confirmation email (non-blocking — don't fail notify if email fails)
      sendOrderConfirmation(orderData).catch(err =>
        console.error('Email send failed:', err.message)
      )
    }

    res.send('OK')
  } catch (err) {
    console.error('PayHere notify error:', err)
    res.status(500).send('Error')
  }
})

export default router
