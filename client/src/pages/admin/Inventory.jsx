import { useState } from 'react'
import { AlertTriangle, CheckCircle, Pencil, Save } from 'lucide-react'

const initialStock = [
  { id: '1', name: 'Classic Bifold Wallet',  category: 'Wallets',      stock: 15, minStock: 5  },
  { id: '2', name: 'Executive Tote Bag',     category: 'Bags',         stock: 8,  minStock: 5  },
  { id: '3', name: 'Handstitched Belt',       category: 'Belts',        stock: 3,  minStock: 5  },
  { id: '4', name: 'Vintage Messenger Bag',  category: 'Bags',         stock: 20, minStock: 5  },
  { id: '5', name: 'Slim Card Holder',        category: 'Card Holders', stock: 30, minStock: 10 },
]

export default function Inventory() {
  const [items,   setItems]   = useState(initialStock)
  const [editing, setEditing] = useState(null)
  const [newQty,  setNewQty]  = useState('')

  const lowStock = items.filter(i => i.stock <= i.minStock)

  function startEdit(item) {
    setEditing(item.id)
    setNewQty(item.stock)
  }

  function saveEdit(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: Number(newQty) } : i))
    setEditing(null)
  }

  return (
    <div>
      <h1 className="admin-page-title">Inventory</h1>
      <p className="admin-page-sub">Monitor and update stock levels.</p>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="admin-alert">
          <AlertTriangle size={18} />
          <span><strong>{lowStock.length} item{lowStock.length > 1 ? 's' : ''}</strong> below minimum stock level: {lowStock.map(i => i.name).join(', ')}</span>
        </div>
      )}

      {/* Inventory table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Min Stock</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const isLow = item.stock <= item.minStock
                return (
                  <tr key={item.id}>
                    <td className="admin-id">{i + 1}</td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.category}</td>
                    <td>{item.minStock}</td>
                    <td>
                      {editing === item.id ? (
                        <input
                          type="number" min="0" value={newQty}
                          onChange={e => setNewQty(e.target.value)}
                          className="admin-input admin-stock-input"
                        />
                      ) : (
                        <span style={{ fontWeight: 700, color: isLow ? '#E53935' : '#4CAF50' }}>
                          {item.stock}
                        </span>
                      )}
                    </td>
                    <td>
                      {isLow ? (
                        <span className="admin-badge-status" style={{ color: '#E53935', background: '#E5393522' }}>
                          <AlertTriangle size={11} style={{ marginRight: 4 }} />Low Stock
                        </span>
                      ) : (
                        <span className="admin-badge-status" style={{ color: '#4CAF50', background: '#4CAF5022' }}>
                          <CheckCircle size={11} style={{ marginRight: 4 }} />OK
                        </span>
                      )}
                    </td>
                    <td>
                      {editing === item.id ? (
                        <button className="admin-action-btn admin-edit-btn" onClick={() => saveEdit(item.id)}>
                          <Save size={14} />
                        </button>
                      ) : (
                        <button className="admin-action-btn admin-edit-btn" onClick={() => startEdit(item)}>
                          <Pencil size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
