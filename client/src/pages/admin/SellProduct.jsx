import { useState } from 'react'

const products = [
  { id: '1', name: 'Classic Bifold Wallet',  price: 4500,  stock: 15 },
  { id: '2', name: 'Executive Tote Bag',     price: 12500, stock: 8  },
  { id: '3', name: 'Handstitched Belt',       price: 3200,  stock: 3  },
  { id: '4', name: 'Vintage Messenger Bag',  price: 8900,  stock: 20 },
  { id: '5', name: 'Slim Card Holder',        price: 2200,  stock: 30 },
]

export default function SellProduct() {
  const [form, setForm] = useState({ productId: '', quantity: 1, customerName: '', customerPhone: '', note: '' })
  const [sold, setSold]  = useState(false)

  const selected = products.find(p => p.id === form.productId)
  const total    = selected ? selected.price * form.quantity : 0

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSold(true)
    setForm({ productId: '', quantity: 1, customerName: '', customerPhone: '', note: '' })
    setTimeout(() => setSold(false), 3000)
  }

  return (
    <div>
      <h1 className="admin-page-title">Sell Product</h1>
      <p className="admin-page-sub">Record a new sale manually.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        {/* Form */}
        <div className="admin-card">
          <form onSubmit={handleSubmit} className="admin-form">

            <div className="admin-field">
              <label className="admin-label">Select Product</label>
              <select name="productId" value={form.productId} onChange={handleChange}
                className="admin-input admin-select" required>
                <option value="">Choose a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Rs. {p.price.toLocaleString()} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label className="admin-label">Quantity</label>
              <input name="quantity" type="number" min="1"
                max={selected?.stock || 99}
                value={form.quantity} onChange={handleChange}
                className="admin-input" required />
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Customer Name</label>
                <input name="customerName" value={form.customerName} onChange={handleChange}
                  placeholder="Full name" className="admin-input" required />
              </div>
              <div className="admin-field">
                <label className="admin-label">Customer Phone</label>
                <input name="customerPhone" type="tel" value={form.customerPhone} onChange={handleChange}
                  placeholder="07X XXX XXXX" className="admin-input" />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">Note (optional)</label>
              <textarea name="note" value={form.note} onChange={handleChange}
                placeholder="Any special notes..."
                className="admin-input admin-textarea" rows={3} />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn-primary">Record Sale</button>
            </div>

            {sold && <p className="admin-success">Sale recorded successfully!</p>}
          </form>
        </div>

        {/* Order Summary */}
        <div className="admin-card">
          <h2 className="admin-card-title">Order Summary</h2>
          <div className="admin-summary">
            <div className="admin-summary-row">
              <span>Product</span>
              <span>{selected?.name || '—'}</span>
            </div>
            <div className="admin-summary-row">
              <span>Unit Price</span>
              <span>{selected ? `Rs. ${selected.price.toLocaleString()}` : '—'}</span>
            </div>
            <div className="admin-summary-row">
              <span>Quantity</span>
              <span>{form.quantity}</span>
            </div>
            <div className="admin-summary-divider" />
            <div className="admin-summary-row admin-summary-total">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
