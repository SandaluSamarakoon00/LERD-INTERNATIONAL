import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { auth } from '../../firebase'
import BlogContentEditor from '../../components/admin/BlogContentEditor'
import { uploadToCloudinary, resolveBlocksForSubmit } from '../../utils/blogBlocks'

const API = import.meta.env.VITE_API_URL

export default function AddBlog() {
  const [form, setForm] = useState({
    title: '', excerpt: '', author: '', status: 'published'
  })
  const [blocks,      setBlocks]     = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [loading,     setLoading]   = useState(false)
  const [progress,    setProgress]  = useState('')
  const [success,     setSuccess]   = useState(false)
  const [error,       setError]     = useState('')

  function handleCoverImage(e) {
    const file = e.target.files[0]
    if (file) setCoverImage({ file, url: URL.createObjectURL(file) })
  }

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function clearForm() {
    setForm({ title: '', excerpt: '', author: '', status: 'published' })
    setBlocks([])
    setCoverImage(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (blocks.length === 0) return setError('Add at least one content block (text, image, or video)')

    setLoading(true)
    setError('')

    try {
      const token = await auth.currentUser.getIdToken()

      let coverUrl = null
      if (coverImage) {
        setProgress('Uploading cover image…')
        coverUrl = await uploadToCloudinary(coverImage.file, 'image')
      }

      const resolvedBlocks = await resolveBlocksForSubmit(blocks, setProgress)

      setProgress('Publishing post…')

      const res  = await fetch(`${API}/api/blogs`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          title:      form.title,
          excerpt:    form.excerpt,
          blocks:     resolvedBlocks,
          author:     form.author || 'LERD Team',
          status:     form.status,
          coverImage: coverUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post')

      setSuccess(true)
      clearForm()
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setProgress('')
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Add Blog Post</h1>
      <p className="admin-page-sub">Write a new post for the LERD Journal.</p>

      {success && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: '#1A0F08', border: '1px solid rgba(34,197,94,0.4)',
            borderRadius: '16px', padding: '32px 48px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            animation: 'popIn 0.3s ease',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#4ade80', fontSize: '26px' }}>✓</span>
            </div>
            <span style={{ color: '#4ade80', fontSize: '20px', fontWeight: '700', letterSpacing: '0.02em' }}>
              Blog Post Saved Successfully!
            </span>
          </div>
        </div>
      )}
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {error && (
        <div style={{
          background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
          borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
          color: '#f87171', fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      <div className="admin-card" style={{ maxWidth: '720px' }}>
        <form onSubmit={handleSubmit} className="admin-form">

          <div className="admin-field">
            <label className="admin-label">Post Title</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. The Art of Hand-Stitched Leather"
              className="admin-input" required />
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label className="admin-label">Author <span style={{ color: '#7A5C3A' }}>(optional)</span></label>
              <input name="author" value={form.author} onChange={handleChange}
                placeholder="e.g. LERD Team" className="admin-input" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="admin-input admin-select">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Excerpt <span style={{ color: '#7A5C3A' }}>(short summary shown on the Journal page)</span></label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange}
              placeholder="A short one or two sentence summary…"
              className="admin-input admin-textarea" rows={2} />
          </div>

          <div className="admin-field">
            <label className="admin-label">Content</label>
            <p className="admin-upload-hint" style={{ marginTop: '-2px', marginBottom: '4px' }}>
              Build the post from text, image, and video blocks — reorder them to place media at the start, middle, or end.
            </p>
            <BlogContentEditor blocks={blocks} onChange={setBlocks} />
          </div>

          <div className="admin-field">
            <label className="admin-label">Cover Image <span style={{ color: '#7A5C3A' }}>(optional — shown on the Journal card and post header)</span></label>
            <div className="admin-upload-box admin-main-upload">
              {coverImage ? (
                <>
                  <img src={coverImage.url} alt="cover" className="admin-img-preview-main" />
                  <button type="button" className="admin-img-remove-main"
                    onClick={() => setCoverImage(null)}>
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={24} style={{ color: '#B8860B' }} />
                  <p className="admin-upload-text">Cover photo</p>
                  <p className="admin-upload-hint">PNG, JPG up to 5MB</p>
                </>
              )}
              <input type="file" accept="image/*" className="admin-upload-input"
                onChange={handleCoverImage} />
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-btn-secondary" onClick={clearForm} disabled={loading}>
              Clear
            </button>
            <button type="submit" className="admin-btn-primary" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                  }} />
                  {progress || 'Saving…'}
                </>
              ) : 'Publish Post'}
            </button>
          </div>

        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
