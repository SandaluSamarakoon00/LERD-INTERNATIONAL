import express from 'express'
import { auth, db } from '../config/firebase.js'
import { verifyToken, verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/find-email — look up email by username (no auth needed, used for login)
router.post('/find-email', async (req, res) => {
  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Username required' })
  try {
    const snapshot = await db.collection('users').where('username', '==', username.toLowerCase()).limit(1).get()
    if (snapshot.empty) return res.status(404).json({ error: 'Username not found' })
    res.json({ email: snapshot.docs[0].data().email })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/register — save profile after Firebase Auth user is already created client-side
// Password is never sent here; email and uid come from the verified Firebase token
router.post('/register', verifyToken, async (req, res) => {
  const { name, username, phone } = req.body
  const { uid, email } = req.user

  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required' })
  }

  try {
    // Check username is unique
    const existing = await db.collection('users').where('username', '==', username.toLowerCase()).limit(1).get()
    if (!existing.empty) return res.status(409).json({ error: 'Username already taken' })

    // Save profile to Firestore (email from verified token — trusted source)
    await db.collection('users').doc(uid).set({
      name,
      username: username.toLowerCase(),
      email,
      phone: phone || '',
      type:  'user',
      createdAt: new Date(),
    })

    res.status(201).json({ message: 'Profile created' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/me — get current user's profile (own data only)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.user.uid).get()
    if (!doc.exists) return res.json({ type: 'user' })
    const { name, username, email, phone, type } = doc.data()
    res.json({ id: doc.id, name, username, email, phone, type })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/users — admin creates a new user (uses Firebase Admin SDK, password never exposed)
router.post('/users', verifyAdmin, async (req, res) => {
  const { name, username, email, phone, password, type = 'user' } = req.body

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'Name, username, email and password are required' })
  }

  try {
    const existing = await db.collection('users').where('username', '==', username.toLowerCase()).limit(1).get()
    if (!existing.empty) return res.status(409).json({ error: 'Username already taken' })

    const userRecord = await auth.createUser({ email, password, displayName: name })

    await db.collection('users').doc(userRecord.uid).set({
      name,
      username: username.toLowerCase(),
      email,
      phone:     phone || '',
      type,
      createdAt: new Date(),
    })

    res.status(201).json({ message: 'User created', uid: userRecord.uid })
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Email already in use' })
    }
    res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/users — get all users (admin only)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get()
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/auth/users/:uid — update user profile (admin only)
router.patch('/users/:uid', verifyAdmin, async (req, res) => {
  const { name, phone, type } = req.body
  try {
    const updates = {}
    if (name)  updates.name  = name
    if (phone !== undefined) updates.phone = phone
    if (type)  updates.type  = type

    await db.collection('users').doc(req.params.uid).update(updates)

    if (name) await auth.updateUser(req.params.uid, { displayName: name })

    res.json({ message: 'User updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/auth/users/:uid — delete user (admin only)
router.delete('/users/:uid', verifyAdmin, async (req, res) => {
  try {
    await auth.deleteUser(req.params.uid)
    await db.collection('users').doc(req.params.uid).delete()
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
