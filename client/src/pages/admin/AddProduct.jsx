import { useState } from 'react'
import { Upload, X, ImagePlus } from 'lucide-react'

const categories = ['Wallets', 'Bags', 'Belts', 'Card Holders', 'Key Holders', 'Accessories']

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '', code: '', category: '', price: '', stock: '', description: '', badge: ''
  })
  const [saved,     setSaved]     = useState(false)
  const [mainImage, setMainImage] = useState(null)
  const [subImages, setSubImages] = useState([])

  function handleMainImage(e) {
    const file = e.target.files[0]
    if (file) setMainImage({ file, url: URL.createObjectURL(file) })
  }

  function handleSubImages(e) {
    const files = Array.from(e.target.files)
    const newImgs = files.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setSubImages(prev => [...prev, ...newImgs].slice(0, 6))
  }

  function removeSubImage(index) {
    setSubImages(prev => prev.filter((_, i) => i !== index))
  }

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="admin-page-title">Add Product</h1>
      <p className="admin-page-sub">Add a new product to the LERD catalog.</p>

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

          {/* Category + Badge */}
          <div className="admin-row">
            <div className="admin-field">
              <label className="admin-label">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="admin-input admin-select" required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Badge (optional)</label>
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
              <input name="price" type="number" value={form.price} onChange={handleChange}
                placeholder="e.g. 4500"
                className="admin-input" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Stock Quantity <span style={{ color:'#7A5C3A' }}>(optional)</span></label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange}
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
                <p className="admin-img-sublabel">Main Image</p>
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
            <button type="button" className="admin-btn-secondary"
              onClick={() => setForm({ name:'', code:'', category:'', price:'', stock:'', description:'', badge:'' })}>
              Clear
            </button>
            <button type="submit" className="admin-btn-primary">
              Add Product
            </button>
          </div>

          {saved && (
            <p className="admin-success">Product added successfully!</p>
          )}
        </form>
      </div>
    </div>
  )
}
