import { useState, useEffect } from 'react'
import { Search, Pencil, Trash2, PlusSquare, X, Upload, ImagePlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const API           = import.meta.env.VITE_API_URL
const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const categories    = ['Wallets', 'Bags', 'Belts', 'Card Holders', 'Key Holders', 'Slippers', 'Jewellery']
const collections   = ['Men', 'Women', 'Accessories']

async function uploadToCloudinary(file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', 'lerd-products')
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}

export default function ProductList() {
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState(null)
  const [editData,   setEditData]   = useState(null)
  const [saving,        setSaving]        = useState(false)
  const [saveError,     setSaveError]     = useState('')
  const [saveSuccess,   setSaveSuccess]   = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null) // product to delete
  const [newMain,       setNewMain]       = useState(null)
  const [newSubs,       setNewSubs]       = useState([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) fetchProducts()
      else setLoading(false)
    })
    return unsub
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/products`)
      const data = await res.json()
      if (res.ok) setProducts(data)
    } catch (err) {
      console.error('Failed to load products', err)
    } finally {
      setLoading(false)
    }
  }

  function openEdit(e, p) {
    e.stopPropagation()
    setEditData({ ...p })
    setNewMain(null)
    setNewSubs([])
    setSaveError('')
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      const token = await auth.currentUser.getIdToken()

      let mainImageUrl = editData.mainImage
      let subImageUrls = [...(editData.subImages || [])]

      // Upload new main image if selected
      if (newMain) {
        mainImageUrl = await uploadToCloudinary(newMain.file)
      }

      // Upload new sub images
      for (const img of newSubs) {
        const url = await uploadToCloudinary(img.file)
        subImageUrls.push(url)
      }

      const body = {
        name:        editData.name,
        code:        editData.code,
        category:    editData.category,
        collection:  editData.collection || null,
        price:       Number(editData.price),
        stock:       editData.stock !== '' ? Number(editData.stock) : null,
        description: editData.description,
        badge:       editData.badge || null,
        mainImage:   mainImageUrl,
        subImages:   subImageUrls,
      }

      const res  = await fetch(`${API}/api/products/${editData.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      setProducts(prev => prev.map(p => p.id === editData.id ? { ...editData, ...body } : p))
      setEditData(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleDelete(e, p) {
    e.stopPropagation()
    setConfirmDelete(p)
  }

  async function confirmDeleteProduct() {
    const p = confirmDelete
    setConfirmDelete(null)
    try {
      const token = await auth.currentUser.getIdToken()
      await fetch(`${API}/api/products/${p.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(prev => prev.filter(x => x.id !== p.id))
      if (selected?.id === p.id) setSelected(null)
      setDeleteSuccess(true)
      setTimeout(() => setDeleteSuccess(false), 3000)
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Product List</h1>
          <p className="admin-page-sub">Manage all LERD products.</p>
        </div>
        <Link to="/admin/add-product" className="admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PlusSquare size={16} /> Add Product
        </Link>
      </div>

      <div className="admin-search-wrap">
        <Search size={15} className="admin-search-icon" />
        <input type="text" placeholder="Search by name, code or category..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="admin-search-input" />
      </div>

      <div className="admin-card">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#A07850', fontSize: '13px' }}>Loading products…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Code</th><th>Product Name</th><th>Category</th><th>Collection</th>
                  <th>Price (LKR)</th><th>Stock</th><th>Badge</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,134,11,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td className="admin-id">{i + 1}</td>
                    <td><span className="admin-product-code">{p.code}</span></td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category || <span style={{ color: '#F5ECD7' }}>—</span>}</td>
                    <td>
                      {p.collection ? (
                        <span className="admin-badge-status" style={{
                          color: p.collection === 'Men' ? '#1E88E5' : p.collection === 'Women' ? '#D81B60' : '#7B1FA2',
                          background: p.collection === 'Men' ? '#1E88E522' : p.collection === 'Women' ? '#D81B6022' : '#7B1FA222',
                        }}>{p.collection}</span>
                      ) : '—'}
                    </td>
                    <td>Rs. {Number(p.price).toLocaleString()}</td>
                    <td>
                      {p.stock != null
                        ? <span style={{ color: p.stock <= 5 ? '#E53935' : '#4CAF50', fontWeight: 600 }}>{p.stock}</span>
                        : <span style={{ color: '#7A5C3A' }}>—</span>}
                    </td>
                    <td>
                      {p.badge
                        ? <span className="admin-badge-status" style={{ color: '#B8860B', background: '#B8860B22' }}>{p.badge}</span>
                        : '—'}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn admin-edit-btn" onClick={e => openEdit(e, p)}><Pencil size={14} /></button>
                        <button className="admin-action-btn admin-delete-btn" onClick={e => handleDelete(e, p)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="admin-empty">No products found.</td></tr>
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
            style={{ background: '#1A0F08', border: '1px solid rgba(196,154,108,0.2)', borderRadius: '16px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(196,154,108,0.15)' }}>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#F5ECD7', marginBottom: '4px' }}>{selected.name}</h2>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#B8860B', background: '#B8860B22', padding: '2px 8px', borderRadius: '4px' }}>{selected.code}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07850' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', background: '#0D0703', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selected.mainImage
                    ? <img src={selected.mainImage} alt="main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#7A5C3A', fontSize: '12px' }}>No image</span>}
                </div>
                {selected.subImages?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selected.subImages.map((url, i) => (
                      <img key={i} src={url} alt={`sub-${i}`}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '2px solid rgba(196,154,108,0.2)' }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Category',   value: selected.category },
                  { label: 'Collection', value: selected.collection || '—' },
                  { label: 'Price',      value: `Rs. ${Number(selected.price).toLocaleString()}` },
                  { label: 'Stock',      value: selected.stock != null ? selected.stock : '—' },
                  { label: 'Badge',      value: selected.badge || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '11px', color: '#C49A6C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</p>
                    <p style={{ fontSize: '17px', color: '#FFFFFF', fontWeight: '500' }}>{value}</p>
                  </div>
                ))}
                {selected.description && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#C49A6C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Description</p>
                    <p style={{ fontSize: '15px', color: '#F5ECD7', lineHeight: 1.7 }}>{selected.description}</p>
                  </div>
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

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(196,154,108,0.15)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#F5ECD7' }}>Edit Product</h2>
              <button onClick={() => setEditData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07850' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '24px' }} className="admin-form">

              {saveError && (
                <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '16px', background: 'rgba(220,38,38,0.1)', padding: '8px 12px', borderRadius: '8px' }}>{saveError}</p>
              )}

              {/* Name + Code */}
              <div className="admin-row">
                <div className="admin-field">
                  <label className="admin-label">Product Name</label>
                  <input className="admin-input" value={editData.name}
                    onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Product Code</label>
                  <input className="admin-input" value={editData.code}
                    onChange={e => setEditData(p => ({ ...p, code: e.target.value }))} />
                </div>
              </div>

              {/* Collection — first */}
              <div className="admin-field">
                <label className="admin-label">Collection</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {collections.map(c => (
                    <button key={c} type="button"
                      onClick={() => setEditData(p => ({ ...p, collection: c, category: c === 'Accessories' ? '' : p.category }))}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                        border: '1px solid',
                        borderColor: editData.collection === c ? '#B8860B' : 'rgba(196,154,108,0.25)',
                        background:  editData.collection === c ? 'rgba(184,134,11,0.15)' : 'transparent',
                        color:       editData.collection === c ? '#F5ECD7' : '#A07850',
                        fontSize: '13px', fontWeight: editData.collection === c ? '600' : '400',
                        transition: 'all 0.15s',
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category + Badge */}
              <div className="admin-row">
                {editData.collection !== 'Accessories' && (
                  <div className="admin-field">
                    <label className="admin-label">Category</label>
                    <select className="admin-input admin-select" value={editData.category}
                      onChange={e => setEditData(p => ({ ...p, category: e.target.value }))}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                <div className="admin-field">
                  <label className="admin-label">Badge</label>
                  <select className="admin-input admin-select" value={editData.badge || ''}
                    onChange={e => setEditData(p => ({ ...p, badge: e.target.value }))}>
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="New">New</option>
                    <option value="Limited">Limited</option>
                  </select>
                </div>
              </div>

              {/* Price + Stock */}
              <div className="admin-row">
                <div className="admin-field">
                  <label className="admin-label">Price (LKR)</label>
                  <input className="admin-input" type="number" value={editData.price}
                    onChange={e => setEditData(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Stock</label>
                  <input className="admin-input" type="number" value={editData.stock ?? ''}
                    onChange={e => setEditData(p => ({ ...p, stock: e.target.value }))} />
                </div>
              </div>

              {/* Description */}
              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-input admin-textarea" rows={3} value={editData.description || ''}
                  onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} />
              </div>

              {/* Main Image */}
              <div className="admin-field">
                <label className="admin-label">Main Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {(newMain?.url || editData.mainImage) && (
                    <img src={newMain?.url || editData.mainImage} alt="main"
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(196,154,108,0.3)' }} />
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#C49A6C', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(196,154,108,0.3)', background: 'rgba(184,134,11,0.05)' }}>
                    <Upload size={14} /> Change Image
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files[0]; if (f) setNewMain({ file: f, url: URL.createObjectURL(f) }) }} />
                  </label>
                </div>
              </div>

              {/* Sub Images */}
              <div className="admin-field">
                <label className="admin-label">Sub Images</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {(editData.subImages || []).map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={url} alt={`sub-${i}`}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(196,154,108,0.3)' }} />
                      <button type="button"
                        onClick={() => setEditData(p => ({ ...p, subImages: p.subImages.filter((_, j) => j !== i) }))}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#E53935', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} color="#fff" />
                      </button>
                    </div>
                  ))}
                  {newSubs.map((img, i) => (
                    <div key={`new-${i}`} style={{ position: 'relative' }}>
                      <img src={img.url} alt={`new-${i}`}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #B8860B' }} />
                      <button type="button"
                        onClick={() => setNewSubs(p => p.filter((_, j) => j !== i))}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#E53935', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} color="#fff" />
                      </button>
                    </div>
                  ))}
                  {((editData.subImages?.length || 0) + newSubs.length) < 6 && (
                    <label style={{ width: '56px', height: '56px', borderRadius: '6px', border: '1px dashed rgba(196,154,108,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '2px' }}>
                      <ImagePlus size={16} style={{ color: '#B8860B' }} />
                      <span style={{ fontSize: '8px', color: '#7A5C3A' }}>Add</span>
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                        onChange={e => {
                          const files = Array.from(e.target.files).map(f => ({ file: f, url: URL.createObjectURL(f) }))
                          setNewSubs(p => [...p, ...files].slice(0, 6 - (editData.subImages?.length || 0)))
                        }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Actions */}
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
              Product Updated Successfully!
            </span>
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
            <h3 style={{ color: '#F5ECD7', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Delete Product?</h3>
            <p style={{ color: '#A07850', fontSize: '13px', marginBottom: '28px', lineHeight: 1.5 }}>
              Are you sure you want to delete<br />
              <strong style={{ color: '#F5ECD7' }}>"{confirmDelete.name}"</strong>?<br />
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmDelete(null)}
                className="admin-btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={confirmDeleteProduct}
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
            <span style={{ color: '#f87171', fontSize: '20px', fontWeight: '700', letterSpacing: '0.02em' }}>
              Product Deleted Successfully!
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
    </div>
  )
}
