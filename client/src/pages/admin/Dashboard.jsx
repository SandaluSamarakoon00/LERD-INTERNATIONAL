import { useState, useEffect } from 'react'
import { Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const API = import.meta.env.VITE_API_URL

const STATUS_STYLE = {
  pending:    { color: '#F59E0B', bg: '#F59E0B22' },
  paid:       { color: '#22C55E', bg: '#22C55E22' },
  processing: { color: '#3B82F6', bg: '#3B82F622' },
  shipped:    { color: '#A855F7', bg: '#A855F722' },
  delivered:  { color: '#10B981', bg: '#10B98122' },
  cancelled:  { color: '#EF4444', bg: '#EF444422' },
  failed:     { color: '#EF4444', bg: '#EF444422' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { color: '#A07850', bg: '#A0785022' }
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px',
      color: s.color, background: s.bg,
    }}>
      {status}
    </span>
  )
}

function formatDate(val) {
  if (!val) return '—'
  if (val._seconds) return new Date(val._seconds * 1000).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' })
  const d = new Date(val)
  return isNaN(d) ? '—' : d.toLocaleDateString('en-LK', { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const [products,     setProducts]     = useState([])
  const [orders,       setOrders]       = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setLoading(false); return }
      try {
        const token = await user.getIdToken()
        const [prodRes, ordRes] = await Promise.all([
          fetch(`${API}/api/products`),
          fetch(`${API}/api/orders/all`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
        const [prods, ords] = await Promise.all([prodRes.json(), ordRes.json()])
        if (prodRes.ok) setProducts(prods)
        if (ordRes.ok)  setOrders(ords)
      } catch (err) {
        console.error('Dashboard load error', err)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0)

  const recentOrders = orders.slice(0, 5)

  const stats = [
    {
      label: 'Total Products',
      value: loading ? '—' : products.length.toLocaleString(),
      icon:  Package,
      color: '#B8860B',
    },
    {
      label: 'Total Orders',
      value: loading ? '—' : orders.length.toLocaleString(),
      icon:  ShoppingCart,
      color: '#4CAF50',
    },
    {
      label: 'Revenue (LKR)',
      value: loading ? '—' : `Rs. ${totalRevenue.toLocaleString()}`,
      icon:  TrendingUp,
      color: '#1E88E5',
    },
  ]

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Welcome back! Here's what's happening with LERD.</p>

      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: `${color}22`, color }}>
              <Icon size={22} />
            </div>
            <div>
              <p className="admin-stat-value">{value}</p>
              <p className="admin-stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <h2 className="admin-card-title">Recent Orders</h2>
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#A07850', fontSize: '13px' }}>Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="admin-empty">No orders yet.</td></tr>
                ) : recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#B8860B', background: '#B8860B22', padding: '2px 7px', borderRadius: '4px' }}>
                        {o.orderId || o.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#F5ECD7' }}>
                      {o.customer?.firstName} {o.customer?.lastName}
                    </td>
                    <td style={{ color: '#C49A6C' }}>
                      {o.items?.[0]?.name || '—'}
                      {o.items?.length > 1 && (
                        <span style={{ color: '#7A5C3A', fontSize: '11px' }}> +{o.items.length - 1}</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>Rs. {Number(o.amount || 0).toLocaleString()}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td style={{ color: '#A07850', fontSize: '12px' }}>{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
