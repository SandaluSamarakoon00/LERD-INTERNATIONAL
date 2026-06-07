import { auth, db } from '../config/firebase.js'

export async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    req.user = await auth.verifyIdToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export async function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    req.user = await auth.verifyIdToken(token)
    const doc = await db.collection('users').doc(req.user.uid).get()
    if (!doc.exists || doc.data().type !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
