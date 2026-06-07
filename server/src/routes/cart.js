import express from 'express'
import { db } from '../config/firebase.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// GET cart for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('carts').doc(req.user.uid).get()
    res.json(doc.exists ? doc.data() : { items: [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add item to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, name, price, image, quantity = 1 } = req.body
    const ref      = db.collection('carts').doc(req.user.uid)
    const cartDoc  = await ref.get()
    const items    = cartDoc.exists ? cartDoc.data().items : []
    const existing = items.findIndex(i => i.productId === productId)

    if (existing >= 0) {
      items[existing].quantity += quantity
    } else {
      items.push({ productId, name, price, image, quantity })
    }

    await ref.set({ items, updatedAt: new Date() })
    res.json({ message: 'Item added to cart', items })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update item quantity
router.put('/update', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const ref     = db.collection('carts').doc(req.user.uid)
    const cartDoc = await ref.get()
    if (!cartDoc.exists) return res.json({ items: [] })

    let items = cartDoc.data().items
    if (quantity <= 0) {
      items = items.filter(i => i.productId !== productId)
    } else {
      const idx = items.findIndex(i => i.productId === productId)
      if (idx >= 0) items[idx].quantity = quantity
    }

    await ref.set({ items, updatedAt: new Date() })
    res.json({ items })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE remove item from cart
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const ref     = db.collection('carts').doc(req.user.uid)
    const cartDoc = await ref.get()
    if (!cartDoc.exists) return res.json({ items: [] })

    const items = cartDoc.data().items.filter(i => i.productId !== req.params.productId)
    await ref.set({ items, updatedAt: new Date() })
    res.json({ message: 'Item removed', items })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE clear entire cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await db.collection('carts').doc(req.user.uid).set({ items: [], updatedAt: new Date() })
    res.json({ message: 'Cart cleared' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
