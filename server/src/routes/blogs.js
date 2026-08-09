import express from 'express'
import { db } from '../config/firebase.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

// Convert Firestore Timestamps to ISO strings so JSON serialization works correctly
function serializeBlog(doc) {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? null,
  }
}

// GET all blogs, published only (public — for the site's Blog page)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('blogs')
      .where('status', '==', 'published')
      .orderBy('createdAt', 'desc')
      .get()
    res.json(snapshot.docs.map(serializeBlog))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET all blogs, including drafts (admin only — for the admin Blog List page)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').orderBy('createdAt', 'desc').get()
    res.json(snapshot.docs.map(serializeBlog))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single blog (public — only if published; admins can view any)
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('blogs').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Blog post not found' })

    const blog = serializeBlog(doc)
    if (blog.status !== 'published') {
      // Only allow non-admins to view published posts
      const token = req.headers.authorization?.split('Bearer ')[1]
      if (!token) return res.status(404).json({ error: 'Blog post not found' })
      try {
        const { auth } = await import('../config/firebase.js')
        const decoded = await auth.verifyIdToken(token)
        const userDoc  = await db.collection('users').doc(decoded.uid).get()
        if (!userDoc.exists || userDoc.data().type !== 'admin') {
          return res.status(404).json({ error: 'Blog post not found' })
        }
      } catch {
        return res.status(404).json({ error: 'Blog post not found' })
      }
    }

    res.json(blog)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create blog (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, blocks, coverImage, author, status } = req.body
    const hasBlocks = Array.isArray(blocks) && blocks.length > 0
    if (!title || (!hasBlocks && !content)) {
      return res.status(400).json({ error: 'Title and content are required' })
    }

    const ref = await db.collection('blogs').add({
      title,
      excerpt:    excerpt || '',
      // `blocks` is the ordered list of text/image/video content blocks that make up the post body.
      // `content` is kept for backward compatibility with posts written before block support.
      blocks:     hasBlocks ? blocks : [],
      content:    content || '',
      coverImage: coverImage || null,
      author:     author || 'LERD Team',
      status:     status === 'draft' ? 'draft' : 'published',
      createdAt:  new Date(),
      updatedAt:  new Date(),
    })

    res.status(201).json({ id: ref.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update blog (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, blocks, coverImage, author, status } = req.body
    const hasBlocks = Array.isArray(blocks) && blocks.length > 0
    await db.collection('blogs').doc(req.params.id).update({
      title,
      excerpt:    excerpt || '',
      blocks:     hasBlocks ? blocks : [],
      content:    content || '',
      coverImage: coverImage || null,
      author:     author || 'LERD Team',
      status:     status === 'draft' ? 'draft' : 'published',
      updatedAt:  new Date(),
    })
    res.json({ message: 'Blog post updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE blog (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('blogs').doc(req.params.id).delete()
    res.json({ message: 'Blog post deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
