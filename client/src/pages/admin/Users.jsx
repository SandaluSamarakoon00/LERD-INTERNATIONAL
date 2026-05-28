import { useState, useEffect } from 'react'
import { Search, Pencil, Trash2, UserPlus } from 'lucide-react'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const API = import.meta.env.VITE_API_URL

export default function Users() {
  const [users,       setUsers]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [showForm,    setShowForm]    = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [formError,   setFormError]   = useState('')
  const [form,        setForm]        = useState({ name: '', username: '', email: '', phone: '', password: '', type: 'user' })

  // Wait for auth to restore before fetching
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) fetchUsers(user)
      else setLoading(false)
    })
    return unsub
  }, [])

  async function fetchUsers(user) {
    setLoading(true)
    try {
      const currentUser = user || auth.currentUser
      const token = await currentUser.getIdToken()
      const res   = await fetch(`${API}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data  = await res.json()
      if (res.ok) setUsers(data)
    } catch (err) {
      console.error('Failed to load users', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  )

  function openAdd() {
    setEditingUser(null)
    setForm({ name: '', username: '', email: '', phone: '', password: '', type: 'user' })
    setFormError('')
    setShowForm(true)
  }

  function openEdit(user) {
    setEditingUser(user.id)
    setForm({ name: user.name, username: user.username || '', email: user.email, phone: user.phone || '', password: '', type: user.type })
    setFormError('')
    setShowForm(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setFormError('')

    if (editingUser) {
      setSaving(true)
      try {
        const token = await auth.currentUser.getIdToken()
        const res   = await fetch(`${API}/api/auth/users/${editingUser}`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ name: form.name, phone: form.phone, type: form.type }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update user')
        await fetchUsers(auth.currentUser)
        setShowForm(false)
      } catch (err) {
        setFormError(err.message)
      } finally {
        setSaving(false)
      }
      return
    }

    // Add new user via backend
    if (!form.password || form.password.length < 6) {
      return setFormError('Password must be at least 6 characters')
    }
    setSaving(true)
    try {
      const res  = await fetch(`${API}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: form.name, username: form.username, email: form.email, phone: form.phone, password: form.password, type: form.type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create user')
      await fetchUsers(auth.currentUser)
      setShowForm(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(user) {
    if (!confirm(`Delete ${user.name}?`)) return
    try {
      const token = await auth.currentUser.getIdToken()
      await fetch(`${API}/api/auth/users/${user.id}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (err) {
      alert('Failed to delete user: ' + err.message)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">Manage all registered users.</p>
        </div>
        <button className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={openAdd}>
          <UserPlus size={16} /> Add User
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="admin-card" style={{ maxWidth: '560px', marginBottom: '20px' }}>
          <h2 className="admin-card-title">{editingUser ? 'Edit User' : 'Add New User'}</h2>

          {formError && (
            <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{formError}</p>
          )}

          <form onSubmit={handleSave} className="admin-form">
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Full Name</label>
                <input className="admin-input" placeholder="Full name" value={form.name} required
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Username</label>
                <input className="admin-input" placeholder="username" value={form.username} required={!editingUser}
                  disabled={!!editingUser}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, '') }))} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Phone</label>
                <input className="admin-input" placeholder="07X XXX XXXX" type="tel" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Email</label>
                <input className="admin-input" placeholder="email@example.com" type="email" value={form.email} required
                  disabled={!!editingUser}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Type</label>
                <select className="admin-input admin-select" value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            {!editingUser && (
              <div className="admin-field">
                <label className="admin-label">Password</label>
                <input className="admin-input" placeholder="Min. 6 characters" type="password" value={form.password} required
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
            )}
            <div className="admin-form-actions">
              <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="admin-btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editingUser ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="admin-search-wrap">
        <Search size={15} className="admin-search-icon" />
        <input type="text" placeholder="Search by name, email or phone..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="admin-search-input" />
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#A07850', fontSize: '13px' }}>Loading users…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td className="admin-id">{i + 1}</td>
                    <td><strong>{u.name}</strong></td>
                    <td style={{ color: '#B8860B', fontFamily: 'monospace', fontSize: '12px' }}>
                      {u.username ? `@${u.username}` : '—'}
                    </td>
                    <td style={{ color: '#A07850' }}>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className="admin-badge-status" style={
                        u.type === 'admin'
                          ? { color: '#B8860B', background: '#B8860B22' }
                          : { color: '#1E88E5', background: '#1E88E522' }
                      }>
                        {u.type}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn admin-edit-btn"   onClick={() => openEdit(u)}><Pencil size={14} /></button>
                        <button className="admin-action-btn admin-delete-btn" onClick={() => handleDelete(u)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="admin-empty">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
