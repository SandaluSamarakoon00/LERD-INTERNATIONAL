import express from 'express'
import { db } from '../config/firebase.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// GET user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.user.uid).get()
    if (!doc.exists) return res.status(404).json({ error: 'User not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create or update user profile
router.post('/me', verifyToken, async (req, res) => {
  try {
    await db.collection('users').doc(req.user.uid).set(
      { ...req.body, updatedAt: new Date() },
      { merge: true }
    )
    res.json({ message: 'Profile saved' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
