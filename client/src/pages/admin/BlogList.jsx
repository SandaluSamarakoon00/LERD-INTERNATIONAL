import { useState, useEffect } from 'react'
import { Search, Pencil, Trash2, PlusSquare, X, Upload, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import BlogContentEditor from '../../components/admin/BlogContentEditor'
import { uploadToCloudinary, resolveBlocksForSubmit, blocksFromServer, newBlock } from '../../utils/blogBlocks'

const API = import.meta.env.VITE_API_URL

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return isNaN(d) ? '—' : d.toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function BlogList() {
  const [blogs,         setBlogs]         = useState([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [selected,      setSelected]      = useState(null)
  const [editData,      setEditData]      = useState(null)
  const [saving,        setSaving]        = useState(false)
  const [saveError,     setSaveError]     = useState('')
  const [saveSuccess,   setSaveSuccess]   = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [newCover,      setNewCover]      = useState(null)
  const [editBlocks,    setEditBlocks]    = useState([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) fetchBlogs()
      else setLoading(false)
    })
    return unsub
  }, [])

  async function fetchBlogs() {
    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const res   = await fetch(`${API}/api/blogs/all`, { headers: { Authorization: `Bearer ${token}` } })
      const data  = await res.json()
      if (res.ok) setBlogs(data)
    } catch (err) {
      console.error('Failed to load blog posts', err)
    } finally {
      setLoading(false)
    }
  }

  function openEdit(e, b) {
    e.stopPropagation()
    setEditData({ ...b })
    setEditBlocks(
      Array.isArray(b.blocks) && b.blocks.length
        ? blocksFromServer(b.blocks)
        : b.content
          ? [{ ...newBlock('text'), text: b.content }]  // migrate legacy plain-text posts into a single text block
          : []
    )
    setNewCover(null)
    setSaveError('')
  }

  async function handleSave() {
    if (editBlocks.length === 0) return setSaveError('Add at least one content block (text, image, or video)')
    setSaving(true)
    setSaveError('')
    try {
      const token = await auth.currentUser.getIdToken()

      let coverUrl = editData.coverImage
      if (newCover) coverUrl = await uploadToCloudinary(newCover.file, 'image')

      const resolvedBlocks = await resolveBlocksForSubmit(editBlocks)

      const body = {
        title:      editData.title,
        excerpt:    editData.excerpt,
        blocks:     resolvedBlocks,
        author:     editData.author || 'LERD Team',
        status:     editData.status,
        coverImage: coverUrl,
      }

      const res  = await fetch(`${API}/api/blogs/${editData.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      setBlogs(prev => prev.map(b => b.id === editData.id ? { ...editData, ...body, content: undefined } : b))
      setEditData(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleDelete(e, b) {
    e.stopPropagation()
    setConfirmDelete(b)
  }

  async function confirmDeleteBlog() {
    const b = confirmDelete
    setConfirmDelete(null)
    try {
      const token = await auth.currentUser.getIdToken()
      await fetch(`${API}/api/blogs/${b.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      setBlogs(prev => prev.filter(x => x.id !== b.id))
      if (selected?.id === b.id) setSelected(null)
      setDeleteSuccess(true)
      setTimeout(() => setDeleteSuccess(false), 3000)
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const filtered = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog Posts</h1>
          <p className="admin-page-sub">Manage the LERD Journal.</p>
        </div>
        <Link to="/admin/add-blog" className="admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PlusSquare size={16} /> Add Blog Post
        </Link>
      </div>

      <div className="admin-search-wrap">
        <Search size={15} className="admin-search-icon" />
        <input type="text" placeholder="Search by title or author..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="admin-search-input" />
      </div>

      <div className="admin-card">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#A07850', fontSize: '13px' }}>Loading posts…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Author</th><th>Status</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} onClick={() => setSelected(b)} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,134,11,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td className="admin-id">{i + 1}</td>
                    <td><strong>{b.title}</strong></td>
                    <td>{b.author || 'LERD Team'}</td>
                    <td>
                      <span className="admin-badge-status" style={{
                        color:      b.status === 'published' ? '#22C55E' : '#A07850',
                        background: b.status === 'published' ? '#22C55E22' : '#A0785022',
                      }}>
                        {b.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: '#A07850', fontSize: '12px' }}>{formatDate(b.createdAt)}</td>
                    <td>
                      <div className="admin-actions">
                        {b.status === 'published' ? (
                          <Link to={`/blog/${b.id}`} target="_blank" rel="noopener noreferrer"
                            className="admin-action-btn" onClick={e => e.stopPropagation()}
                            title="View on site">
                            <Eye size={14} />
                          </Link>
                        ) : (
                          <span className="admin-action-btn" style={{ opacity: 0.3, cursor: 'not-allowed' }}
                            title="Draft — publish to view on site">
                            <Eye size={14} />
                          </span>
                        )}
                        <button className="admin-action-btn admin-edit-btn" onClick={e => openEdit(e, b)}><Pencil size={14} /></button>
                        <button className="admin-action-btn admin-delete-btn" onClick={e => handleDelete(e, b)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="admin-empty">No blog posts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── VIEW MODAL ── */}
      {selected && !editData && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#1A0F08', border: '1px solid rgba(196,154,108,0.2)', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(196,154,108,0.15)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#F5ECD7' }}>{selected.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {selected.status === 'published' && (
                  <Link to={`/blog/${selected.id}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8860B', textDecoration: 'none' }}>
                    <Eye size={14} /> View on Site
                  </Link>
                )}
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07850' }}><X size={20} /></button>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              {selected.coverImage && (
                <img src={selected.coverImage} alt="cover"
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '10px', marginBottom: '20px' }} />
              )}
              <p style={{ fontSize: '11px', color: '#7A5C3A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                By {selected.author || 'LERD Team'} · {formatDate(selected.createdAt)}
              </p>
              <div style={{ fontSize: '14px', color: '#C9B79C', lineHeight: 1.8, marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Array.isArray(selected.blocks) && selected.blocks.length > 0 ? (
                  selected.blocks.map((b, i) => {
                    if (b.type === 'text') return <p key={i} style={{ whiteSpace: 'pre-wrap' }}>{b.text}</p>
                    if (b.type === 'image') return <img key={i} src={b.url} alt={b.caption || ''} style={{ width: '100%', borderRadius: '8px' }} />
                    if (b.type === 'video') return (
                      <span key={i} style={{ fontSize: '12px', color: '#B8860B' }}>🎬 Video: {b.url}</span>
                    )
                    return null
                  })
                ) : (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selected.content}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editData && (
        <div onClick={() => setEditData(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#1A0F08', border: '1px solid rgba(196,154,108,0.2)', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(196,154,108,0.15)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#F5ECD7' }}>Edit Blog Post</h2>
              <button onClick={() => setEditData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07850' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '24px' }} className="admin-form">

              {saveError && (
                <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '16px', background: 'rgba(220,38,38,0.1)', padding: '8px 12px', borderRadius: '8px' }}>{saveError}</p>
              )}

              <div className="admin-field">
                <label className="admin-label">Post Title</label>
                <input className="admin-input" value={editData.title}
                  onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} />
              </div>

              <div className="admin-row">
                <div className="admin-field">
                  <label className="admin-label">Author</label>
                  <input className="admin-input" value={editData.author || ''}
                    onChange={e => setEditData(p => ({ ...p, author: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Status</label>
                  <select className="admin-input admin-select" value={editData.status}
                    onChange={e => setEditData(p => ({ ...p, status: e.target.value }))}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">Excerpt</label>
                <textarea className="admin-input admin-textarea" rows={2} value={editData.excerpt || ''}
                  onChange={e => setEditData(p => ({ ...p, excerpt: e.target.value }))} />
              </div>

              <div className="admin-field">
                <label className="admin-label">Content</label>
                <BlogContentEditor blocks={editBlocks} onChange={setEditBlocks} />
              </div>

              <div className="admin-field">
                <label className="admin-label">Cover Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {(newCover?.url || editData.coverImage) && (
                    <img src={newCover?.url || editData.coverImage} alt="cover"
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(196,154,108,0.3)' }} />
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#C49A6C', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(196,154,108,0.3)', background: 'rgba(184,134,11,0.05)' }}>
                    <Upload size={14} /> Change Image
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files[0]; if (f) setNewCover({ file: f, url: URL.createObjectURL(f) }) }} />
                  </label>
                </div>
              </div>

              <div className="admin-form-actions" style={{ marginTop: '8px' }}>
                <button className="admin-btn-secondary" onClick={() => setEditData(null)} disabled={saving}>Cancel</button>
                <button className="admin-btn-primary" onClick={handleSave} disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {saveSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ background: '#1A0F08', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '16px', padding: '32px 48px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', animation: 'popIn 0.3s ease' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#4ade80', fontSize: '26px' }}>✓</span>
            </div>
            <span style={{ color: '#4ade80', fontSize: '20px', fontWeight: '700', letterSpacing: '0.02em' }}>Blog Post Updated Successfully!</span>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM POPUP ── */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#1A0F08', border: '1px solid rgba(196,154,108,0.25)', borderRadius: '16px', padding: '36px 40px', maxWidth: '380px', width: '100%', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', textAlign: 'center', animation: 'popIn 0.25s ease' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Trash2 size={22} style={{ color: '#f87171' }} />
            </div>
            <h3 style={{ color: '#F5ECD7', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Delete Post?</h3>
            <p style={{ color: '#A07850', fontSize: '13px', marginBottom: '28px', lineHeight: 1.5 }}>
              Are you sure you want to delete<br />
              <strong style={{ color: '#F5ECD7' }}>"{confirmDelete.title}"</strong>?<br />
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmDelete(null)} className="admin-btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={confirmDeleteBlog}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#E53935', color: '#fff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em' }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE SUCCESS POPUP ── */}
      {deleteSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ background: '#1A0F08', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '16px', padding: '32px 48px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', animation: 'popIn 0.3s ease' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#f87171', fontSize: '26px' }}>✓</span>
            </div>
            <span style={{ color: '#f87171', fontSize: '20px', fontWeight: '700', letterSpacing: '0.02em' }}>Blog Post Deleted Successfully!</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
