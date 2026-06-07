import { useState, useEffect } from 'react'
import { Search, X, Check, Truck } from 'lucide-react'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const FLOW_STEPS = ['pending', 'processing', 'shipped', 'delivered']

const API = import.meta.env.VITE_API_URL

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed']

const STATUS_STYLE = {
  pending:    { color: '#F59E0B', bg: '#F59E0B22' },
  paid:       { color: '#22C55E', bg: '#22C55E22' },
  processing: { color: '#3B82F6', bg: '#3B82F622' },
  shipped:    { color: '#A855F7', bg: '#A855F722' },
  delivered:  { color: '#10B981', bg: '#10B98122' },
  cancelled:  { color: '#EF4444', bg: '#EF444422' },
  failed:     { color: '#EF4444', bg: '#EF444422' },
  chargedback:{ color: '#F97316', bg: '#F9731622' },
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
  // Firestore Timestamp serialized as { _seconds, _nanoseconds }
  if (val._seconds) return new Date(val._seconds * 1000).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })
  // Firestore Timestamp object (client SDK)
  if (val.toDate) return val.toDate().toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })
  // ISO string or anything else Date can parse
  const d = new Date(val)
  return isNaN(d) ? '—' : d.toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatAddress(c) {
  if (!c) return '—'
  return [c.address1, c.address2, c.city, c.state, c.postalCode, c.country].filter(Boolean).join(', ')
}

export default function Orders() {
  const [orders,       setOrders]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected,      setSelected]      = useState(null)
  const [newStatus,     setNewStatus]     = useState('')
  const [updating,      setUpdating]      = useState(false)
  const [token,         setToken]         = useState(null)
  const [shipModal,     setShipModal]     = useState(false)
  const [shipForm,      setShipForm]      = useState({ courierName: '', trackingNumber: '', trackingUrl: '' })
  const [shipLoading,   setShipLoading]   = useState(false)
  const [shipError,     setShipError]     = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const t = await user.getIdToken()
        setToken(t)
        fetchOrders(t)
      } else {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  async function fetchOrders(t) {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/orders/all`, { headers: { Authorization: `Bearer ${t}` } })
      const data = await res.json()
      if (res.ok) setOrders(data)
    } catch (err) {
      console.error('Failed to load orders', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate() {
    if (!newStatus || newStatus === selected.status) return
    setUpdating(true)
    try {
      const res = await fetch(`${API}/api/orders/${selected.orderId || selected.id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders(prev => prev.map(o =>
          (o.orderId || o.id) === (selected.orderId || selected.id)
            ? { ...o, status: newStatus }
            : o
        ))
        setSelected(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      console.error('Status update failed', err)
    } finally {
      setUpdating(false)
    }
  }

  async function handleShipConfirm() {
    if (!shipForm.courierName.trim() || !shipForm.trackingNumber.trim()) {
      setShipError('Courier name and tracking number are required')
      return
    }
    setShipLoading(true)
    setShipError('')
    try {
      const res = await fetch(`${API}/api/orders/${selected.orderId || selected.id}/ship`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(shipForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update shipment')

      // Update in state
      setOrders(prev => prev.map(o =>
        (o.orderId || o.id) === (selected.orderId || selected.id)
          ? { ...o, status: 'shipped', shipping: shipForm }
          : o
      ))
      setSelected(prev => ({ ...prev, status: 'shipped', shipping: shipForm }))
      setNewStatus('shipped')
      setShipModal(false)
      setShipForm({ courierName: '', trackingNumber: '', trackingUrl: '' })
    } catch (err) {
      setShipError(err.message)
    } finally {
      setShipLoading(false)
    }
  }

  // Status filter tabs
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (o.orderId || o.id || '').toLowerCase().includes(q) ||
      `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0)

  const TABS = [
    { key: 'all',       label: 'All',        count: orders.length },
    { key: 'pending',   label: 'Pending',    count: statusCounts.pending   || 0 },
    { key: 'processing',label: 'Processing', count: statusCounts.processing|| 0 },
    { key: 'shipped',   label: 'Shipped',    count: statusCounts.shipped   || 0 },
    { key: 'delivered', label: 'Delivered',  count: statusCounts.delivered || 0 },
    { key: 'cancelled', label: 'Cancelled',  count: statusCounts.cancelled || 0 },
  ]

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-sub">View and manage all customer orders.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '11px', color: '#7A5C3A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Total Revenue</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#B8860B', fontFamily: 'Playfair Display, serif' }}>
            Rs. {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '20px',
        overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none',
      }}>
        {TABS.map(({ key, label, count }) => {
          const isActive = filterStatus === key
          const s = key === 'all' ? null : STATUS_STYLE[key]
          const dotColor   = s ? s.color : '#B8860B'
          const activeBg   = s ? s.bg    : 'rgba(184,134,11,0.14)'
          const activeBorder = s ? s.color : '#B8860B'

          return (
            <button key={key} onClick={() => setFilterStatus(key)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 14px', borderRadius: '8px', border: '1px solid',
              borderColor: isActive ? activeBorder : 'rgba(196,154,108,0.15)',
              background:  isActive ? activeBg : 'rgba(255,255,255,0.02)',
              color:       isActive ? '#F5ECD7' : '#7A5C3A',
              fontSize: '11px', fontWeight: isActive ? 700 : 400,
              letterSpacing: '0.08em', cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 0.15s',
            }}>
              {/* Status colour dot (all = no dot) */}
              {s && (
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                  background: isActive ? dotColor : 'rgba(196,154,108,0.25)',
                  transition: 'background 0.15s',
                }} />
              )}

              {label}

              {/* Count badge */}
              <span style={{
                fontSize: '10px', fontWeight: 700,
                padding: '2px 7px', borderRadius: '10px',
                background: isActive
                  ? s ? `${dotColor}33` : 'rgba(184,134,11,0.3)'
                  : 'rgba(196,154,108,0.1)',
                color: isActive
                  ? s ? dotColor : '#F5ECD7'
                  : '#5C3D2E',
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="admin-search-wrap">
        <Search size={15} className="admin-search-icon" />
        <input type="text" placeholder="Search by order ID, customer name or email…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="admin-search-input" />
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <p style={{ padding: '24px', textAlign: 'center', color: '#A07850', fontSize: '13px' }}>Loading orders…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr key={o.id} onClick={() => { setSelected(o); setNewStatus(o.status) }}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,134,11,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td className="admin-id">{i + 1}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#B8860B', background: '#B8860B22', padding: '2px 8px', borderRadius: '4px' }}>
                        {o.orderId || o.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#F5ECD7', fontSize: '13px' }}>
                          {o.customer?.firstName} {o.customer?.lastName}
                        </p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#7A5C3A' }}>
                          {o.customer?.email}
                        </p>
                      </div>
                    </td>
                    <td style={{ color: '#C49A6C', fontSize: '13px' }}>
                      {o.items?.length === 1
                        ? o.items[0].name
                        : `${o.items?.[0]?.name || '—'} +${(o.items?.length || 1) - 1}`
                      }
                    </td>
                    <td style={{ fontWeight: 600, color: '#F5ECD7' }}>
                      Rs. {Number(o.amount || 0).toLocaleString()}
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td style={{ color: '#A07850', fontSize: '12px' }}>{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="admin-empty">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ORDER DETAIL MODAL ── */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#1A0F08', border: '1px solid rgba(196,154,108,0.2)', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(196,154,108,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#F5ECD7', margin: 0 }}>Order Detail</h2>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07850' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Order ID + Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Order ID',   value: selected.orderId || selected.id },
                  { label: 'Date',       value: formatDate(selected.createdAt) },
                  { label: 'Amount',     value: `Rs. ${Number(selected.amount || 0).toLocaleString()}` },
                  { label: 'Payment ID', value: selected.paymentId || '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,154,108,0.12)', borderRadius: '8px', padding: '12px 16px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A5C3A' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#F5ECD7', fontWeight: 500, fontFamily: label === 'Order ID' ? 'monospace' : 'inherit' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Customer info */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,154,108,0.12)', borderRadius: '10px', padding: '16px 20px' }}>
                <p style={{ margin: '0 0 12px', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B8860B' }}>Customer</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Name',    value: `${selected.customer?.firstName || ''} ${selected.customer?.lastName || ''}` },
                    { label: 'Email',   value: selected.customer?.email || '—' },
                    { label: 'Phone',   value: selected.customer?.phone || '—' },
                    { label: 'Alt Phone', value: selected.customer?.phone2 || '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ margin: '0 0 2px', fontSize: '9px', color: '#7A5C3A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#F5ECD7' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '9px', color: '#7A5C3A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shipping Address</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#F5ECD7', lineHeight: 1.6 }}>{formatAddress(selected.customer)}</p>
                </div>
              </div>

              {/* Items */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,154,108,0.12)', borderRadius: '10px', padding: '16px 20px' }}>
                <p style={{ margin: '0 0 14px', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B8860B' }}>Items Ordered</p>
                {(selected.items || []).map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < selected.items.length - 1 ? '1px solid rgba(196,154,108,0.1)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.image && (
                        <img src={item.image} alt={item.name}
                          style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(196,154,108,0.2)' }} />
                      )}
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#F5ECD7', fontWeight: 500 }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#7A5C3A' }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#C49A6C', fontWeight: 600 }}>
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(196,154,108,0.2)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#F5ECD7', fontWeight: 600 }}>Total</span>
                  <span style={{ fontSize: '16px', color: '#B8860B', fontWeight: 700 }}>Rs. {Number(selected.amount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Update status — visual stepper */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,154,108,0.12)', borderRadius: '10px', padding: '20px 24px' }}>
                <p style={{ margin: '0 0 20px', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B8860B' }}>
                  Update Order Status
                </p>

                {/* 4-step progress track */}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                  {FLOW_STEPS.map((step, i) => {
                    const selectedIdx = FLOW_STEPS.indexOf(newStatus)
                    const isCompleted = i < selectedIdx
                    const isActive    = i === selectedIdx
                    const isFuture    = i > selectedIdx

                    return (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < FLOW_STEPS.length - 1 ? 1 : 'none' }}>

                        {/* Step bubble + label */}
                        <button
                          onClick={() => {
                            if (step === 'shipped') {
                              setShipForm({ courierName: '', trackingNumber: '', trackingUrl: '' })
                              setShipError('')
                              setShipModal(true)
                            } else {
                              setNewStatus(step)
                            }
                          }}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                            background: 'none', border: 'none', cursor: 'pointer', padding: '0',
                            flexShrink: 0,
                          }}
                        >
                          {/* Circle */}
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                            background: isActive
                              ? 'linear-gradient(135deg, #B8860B, #8B6914)'
                              : isCompleted
                                ? 'rgba(184,134,11,0.25)'
                                : 'rgba(255,255,255,0.04)',
                            border: isActive
                              ? '2px solid #B8860B'
                              : isCompleted
                                ? '2px solid rgba(184,134,11,0.5)'
                                : '2px solid rgba(196,154,108,0.2)',
                            boxShadow: isActive ? '0 0 14px rgba(184,134,11,0.4)' : 'none',
                          }}>
                            {isCompleted
                              ? <Check size={14} style={{ color: '#B8860B' }} />
                              : <span style={{
                                  fontSize: '12px', fontWeight: 700,
                                  color: isActive ? '#fff' : isFuture ? '#5C3D2E' : '#B8860B',
                                }}>
                                  {i + 1}
                                </span>
                            }
                          </div>

                          {/* Label */}
                          <span style={{
                            fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? '#F5ECD7' : isCompleted ? '#C49A6C' : '#5C3D2E',
                            whiteSpace: 'nowrap',
                            fontFamily: 'Josefin Sans, sans-serif',
                          }}>
                            {step}
                          </span>
                        </button>

                        {/* Connector line */}
                        {i < FLOW_STEPS.length - 1 && (
                          <div style={{
                            flex: 1, height: '2px', marginBottom: '22px',
                            background: i < selectedIdx
                              ? 'linear-gradient(90deg, rgba(184,134,11,0.5), rgba(184,134,11,0.3))'
                              : 'rgba(196,154,108,0.12)',
                            transition: 'background 0.3s',
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Cancel order — separate danger option */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(196,154,108,0.1)' }}>
                  <button
                    onClick={() => setNewStatus('cancelled')}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                      background: newStatus === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'transparent',
                      border: `1px solid ${newStatus === 'cancelled' ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.25)'}`,
                      color: '#f87171', fontSize: '11px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', fontFamily: 'Josefin Sans, sans-serif',
                      transition: 'all 0.2s',
                    }}
                  >
                    Cancel Order
                  </button>

                  <div style={{ flex: 1 }} />

                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating || newStatus === selected.status}
                    className="admin-btn-primary"
                    style={{ opacity: (updating || newStatus === selected.status) ? 0.45 : 1 }}
                  >
                    {updating ? 'Saving…' : 'Confirm Update'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── SHIPPING DETAILS MODAL ── */}
      {shipModal && (
        <div onClick={() => setShipModal(false)} style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1A0F08', border: '1px solid rgba(196,154,108,0.25)',
            borderRadius: '16px', width: '100%', maxWidth: '480px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(196,154,108,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={16} style={{ color: '#A855F7' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#F5ECD7', fontFamily: 'Playfair Display, serif' }}>Mark as Shipped</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#7A5C3A' }}>A shipping notification will be sent to the customer</p>
                </div>
              </div>
              <button onClick={() => setShipModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07850' }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '24px' }} className="admin-form">

              {shipError && (
                <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#f87171', fontSize: '12px' }}>
                  {shipError}
                </div>
              )}

              <div className="admin-field">
                <label className="admin-label">Courier Partner <span style={{ color: '#f87171' }}>*</span></label>
                <input className="admin-input"
                  placeholder="e.g. Pronto Express, DHL, FedEx"
                  value={shipForm.courierName}
                  onChange={e => setShipForm(p => ({ ...p, courierName: e.target.value }))} />
              </div>

              <div className="admin-field">
                <label className="admin-label">Tracking Number <span style={{ color: '#f87171' }}>*</span></label>
                <input className="admin-input"
                  placeholder="e.g. PE123456789LK"
                  value={shipForm.trackingNumber}
                  onChange={e => setShipForm(p => ({ ...p, trackingNumber: e.target.value }))} />
              </div>

              <div className="admin-field">
                <label className="admin-label">
                  Tracking URL <span style={{ color: '#7A5C3A', fontSize: '9px' }}>(optional)</span>
                </label>
                <input className="admin-input"
                  placeholder="https://track.courier.com/PE123456789LK"
                  value={shipForm.trackingUrl}
                  onChange={e => setShipForm(p => ({ ...p, trackingUrl: e.target.value }))} />
              </div>

              <div className="admin-form-actions" style={{ marginTop: '8px' }}>
                <button className="admin-btn-secondary" onClick={() => setShipModal(false)} disabled={shipLoading}>
                  Cancel
                </button>
                <button className="admin-btn-primary" onClick={handleShipConfirm} disabled={shipLoading}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Truck size={14} />
                  {shipLoading ? 'Sending…' : 'Confirm Shipment'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
