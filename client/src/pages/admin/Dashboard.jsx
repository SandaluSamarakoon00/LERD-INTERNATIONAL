import { Package, ShoppingCart, Warehouse, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Total Products', value: '24',      icon: Package,      color: '#B8860B' },
  { label: 'Total Orders',   value: '138',     icon: ShoppingCart, color: '#4CAF50' },
  { label: 'Low Stock',      value: '5',       icon: Warehouse,    color: '#E53935' },
  { label: 'Revenue (LKR)',  value: '485,000', icon: TrendingUp,   color: '#1E88E5' },
]

const recentOrders = [
  { id: '#ORD001', customer: 'Amal Perera',    product: 'Classic Bifold Wallet',    amount: 'Rs. 4,500',  status: 'Delivered' },
  { id: '#ORD002', customer: 'Nimali Silva',   product: 'Executive Tote Bag',       amount: 'Rs. 12,500', status: 'Pending'   },
  { id: '#ORD003', customer: 'Kasun Fernando', product: 'Handstitched Belt',        amount: 'Rs. 3,200',  status: 'Processing'},
  { id: '#ORD004', customer: 'Dilini Jayawardena', product: 'Vintage Messenger Bag', amount: 'Rs. 8,900', status: 'Delivered' },
]

const statusColor = { Delivered: '#4CAF50', Pending: '#FFA726', Processing: '#1E88E5' }

export default function Dashboard() {
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
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td className="admin-id">{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.product}</td>
                  <td>{o.amount}</td>
                  <td>
                    <span className="admin-badge-status" style={{ color: statusColor[o.status], background: `${statusColor[o.status]}22` }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
