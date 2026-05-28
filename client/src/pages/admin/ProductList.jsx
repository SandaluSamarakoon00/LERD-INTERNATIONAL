import { useState } from 'react'
import { Search, Pencil, Trash2, PlusSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

const initialProducts = [
  { id: '1', code: 'LERD-W001', name: 'Classic Bifold Wallet',  category: 'Wallets',      price: 4500,  stock: 15, badge: 'Bestseller' },
  { id: '2', code: 'LERD-B001', name: 'Executive Tote Bag',     category: 'Bags',         price: 12500, stock: 8,  badge: 'New'        },
  { id: '3', code: 'LERD-L001', name: 'Handstitched Belt',       category: 'Belts',        price: 3200,  stock: 3,  badge: ''           },
  { id: '4', code: 'LERD-B002', name: 'Vintage Messenger Bag',  category: 'Bags',         price: 8900,  stock: 20, badge: 'Limited'    },
  { id: '5', code: 'LERD-C001', name: 'Slim Card Holder',        category: 'Card Holders', price: 2200,  stock: 30, badge: 'New'        },
]

export default function ProductList() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch]     = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id) {
    if (confirm('Delete this product?')) {
      setProducts(p => p.filter(x => x.id !== id))
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Product List</h1>
          <p className="admin-page-sub">Manage all LERD products.</p>
        </div>
        <Link to="/admin/add-product" className="admin-btn-primary" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <PlusSquare size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="admin-search-wrap">
        <Search size={15} className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price (LKR)</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="admin-id">{i + 1}</td>
                  <td><span className="admin-product-code">{p.code}</span></td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td>Rs. {p.price.toLocaleString()}</td>
                  <td>
                    <span style={{ color: p.stock <= 5 ? '#E53935' : '#4CAF50', fontWeight: 600 }}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    {p.badge && (
                      <span className="admin-badge-status" style={{ color: '#B8860B', background: '#B8860B22' }}>
                        {p.badge}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn admin-edit-btn"><Pencil size={14} /></button>
                      <button className="admin-action-btn admin-delete-btn" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="admin-empty">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
