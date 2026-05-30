import { useState } from 'react'
import { Upload, X, ImagePlus } from 'lucide-react'
import { auth } from '../../firebase'

const API             = import.meta.env.VITE_API_URL
const CLOUD_NAME      = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET   = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const categories  = ['Wallets', 'Bags', 'Belts', 'Card Holders', 'Key Holders', 'Slippers', 'Jewellery']
const collections = ['Men', 'Women', 'Accessories']

async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file',         file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder',        'lerd-products')

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body:   formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Image upload failed')
  return data.secure_url
}

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '', code: '', category: '', collection: '', price: '', stock: '', description: '', badge: ''
  })
  const [mainImage,  setMainImage]  = useState(null)
  const [subImages,  setSubImages]  = useState([])
  const [loading,    setLoading]    = useState(false)
  const [progress,   setProgress]   = useState('')
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState('')

  function handleMainImage(e) {
    const file = e.target.files[0]
    if (file) setMainImage({ file, url: URL.createObjectURL(file) })
  }

  function handleSubImages(e) {
    const files  = Array.from(e.target.files)
    const newImgs = files.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setSubImages(prev => [...prev, ...newImgs].slice(0, 6))
  }

  function removeSubImage(index) {
    setSubImages(prev => prev.filter((_, i) => i !== index))
  }

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function clearForm() {
    setForm({ name: '', code: '', category: '', collection: '', price: '', stock: '', description: '', badge: '' })
    setMainImage(null)
    setSubImages([])
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!mainImage) return setError('Please select a main product image')

    setLoading(true)
    setError('')
    setProgress('Uploading main image…')

    try {
      const token = await auth.currentUser.getIdToken()

      // Upload main image to Cloudinary
      const mainUrl = await uploadImage(mainImage.file)

      // Upload sub images to Cloudinary
      const subUrls = []
      for (let i = 0; i < subImages.length; i++) {
        setProgress(`Uploading image ${i + 2} of ${subImages.length + 1}…`)
        const url = await uploadImage(subImages[i].file)
        subUrls.push(url)
      }

      setProgress('Saving product…')

      // Save product to Firestore via backend
      const res  = await fetch(`${API}/api/products`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          name:        form.name,
          code:        form.code.toUpperCase(),
          category:    form.category,
          collection:  form.collection || null,
          price:       Number(form.price),
          stock:       form.stock ? Number(form.stock) : null,
          description: form.description,
          badge:       form.badge || null,
          mainImage:   mainUrl,
          subImages:   subUrls,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save product')

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
      <h1 className="admin-page-title">Add Product</h1>
      <p className="admin-page-sub">Add a new product to the LERD catalog.</p>

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
              Product Added Successfully!
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

          {/* Name + Code */}
          <div className="admin-row">
            <div className="admin-field">
              <label className="admin-label">Product Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Classic Bifold Wallet"
                className="admin-input" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Product Code</label>
              <input name="code" value={form.code} onChange={handleChange}
                placeholder="e.g. LERD-W001"
                className="admin-input" required />
            </div>
          </div>

          {/* Collection — first */}
          <div className="admin-field">
            <label className="admin-label">Collection</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {collections.map(c => (
                <button key={c} type="button"
                  onClick={() => setForm(p => ({ ...p, collection: c, category: c === 'Accessories' ? '' : p.category }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
                    border: '1px solid',
                    borderColor:  form.collection === c ? '#B8860B' : 'rgba(196,154,108,0.25)',
                    background:   form.collection === c ? 'rgba(184,134,11,0.15)' : 'transparent',
                    color:        form.collection === c ? '#F5ECD7' : '#A07850',
                    fontSize: '13px', fontWeight: form.collection === c ? '600' : '400',
                    transition: 'all 0.15s',
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Category + Badge — hidden if Accessories */}
          <div className="admin-row">
            {form.collection !== 'Accessories' && (
              <div className="admin-field">
                <label className="admin-label">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="admin-input admin-select" required={form.collection !== 'Accessories'}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <div className="admin-field">
              <label className="admin-label">Badge <span style={{ color:'#7A5C3A' }}>(optional)</span></label>
              <select name="badge" value={form.badge} onChange={handleChange}
                className="admin-input admin-select">
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
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange}
                placeholder="e.g. 4500"
                className="admin-input" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Stock Quantity <span style={{ color:'#7A5C3A' }}>(optional)</span></label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                placeholder="e.g. 20"
                className="admin-input" />
            </div>
          </div>

          {/* Description */}
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the product..."
              className="admin-input admin-textarea" rows={4} />
          </div>

          {/* Images */}
          <div className="admin-field">
            <label className="admin-label">Product Images</label>

            <div className="admin-row" style={{ alignItems: 'start' }}>

              {/* Main image */}
              <div className="admin-field">
                <p className="admin-img-sublabel">Main Image <span style={{ color: '#f87171' }}>*</span></p>
                <div className="admin-upload-box admin-main-upload">
                  {mainImage ? (
                    <>
                      <img src={mainImage.url} alt="main" className="admin-img-preview-main" />
                      <button type="button" className="admin-img-remove-main"
                        onClick={() => setMainImage(null)}>
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={24} style={{ color: '#B8860B' }} />
                      <p className="admin-upload-text">Main photo</p>
                      <p className="admin-upload-hint">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input type="file" accept="image/*" className="admin-upload-input"
                    onChange={handleMainImage} />
                </div>
              </div>

              {/* Sub images */}
              <div className="admin-field">
                <p className="admin-img-sublabel">Sub Images <span style={{ color:'#7A5C3A' }}>(up to 6)</span></p>
                <div className="admin-sub-images-grid">
                  {subImages.map((img, i) => (
                    <div key={i} className="admin-sub-img-wrap">
                      <img src={img.url} alt={`sub-${i}`} className="admin-sub-img" />
                      <button type="button" className="admin-sub-img-remove"
                        onClick={() => removeSubImage(i)}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {subImages.length < 6 && (
                    <div className="admin-sub-add-box">
                      <ImagePlus size={20} style={{ color: '#B8860B' }} />
                      <span className="admin-upload-hint">Add</span>
                      <input type="file" accept="image/*" multiple
                        className="admin-upload-input" onChange={handleSubImages} />
                    </div>
                  )}
                </div>
              </div>

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
              ) : 'Add Product'}
            </button>
          </div>

        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
