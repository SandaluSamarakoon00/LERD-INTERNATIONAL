import express from 'express'
import { db } from '../config/firebase.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// GET all orders for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get()
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single order
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Order not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST place new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const order = {
      ...req.body,
      userId:    req.user.uid,
      status:    'pending',
      createdAt: new Date(),
    }
    const ref = await db.collection('orders').add(order)
    res.status(201).json({ id: ref.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
