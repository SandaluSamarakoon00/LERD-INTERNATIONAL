import express from 'express'
import { db } from '../config/firebase.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// GET all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get()
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Product not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add product (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const ref = await db.collection('products').add({ ...req.body, createdAt: new Date() })
    res.status(201).json({ id: ref.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update product (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).update(req.body)
    res.json({ message: 'Product updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE product (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete()
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
