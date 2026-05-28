import { auth } from '../config/firebase.js'

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
