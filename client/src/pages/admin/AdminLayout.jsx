import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusSquare, ShoppingCart,
  Warehouse, Users, Menu, X, LogOut, ChevronRight, Home, ClipboardList, Newspaper
} from 'lucide-react'
import { auth } from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import '../../styles/Admin.css'

const navItems = [
  { to: '/admin',             label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/add-product', label: 'Add Product',  icon: PlusSquare },
  { to: '/admin/products',    label: 'Product List', icon: Package },
  { to: '/admin/add-blog',    label: 'Add Blog Post',icon: Newspaper },
  { to: '/admin/blogs',       label: 'Blog Posts',   icon: Newspaper },
  { to: '/admin/orders',      label: 'Orders',       icon: ClipboardList },
  /*{ to: '/admin/sell',        label: 'Sell Product', icon: ShoppingCart },
  { to: '/admin/inventory',   label: 'Inventory',    icon: Warehouse },*/
  { to: '/admin/users',       label: 'Users',        icon: Users     },
]

export default function AdminLayout() {
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [isMobile,     setIsMobile]     = useState(window.innerWidth < 768)
  const [user,         setUser]         = useState(null)
  const [avatarMenu,   setAvatarMenu]   = useState(false)
  const navigate      = useNavigate()
  const { pathname }  = useLocation()
  const avatarMenuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setAvatarMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return unsub
  }, [])

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
      else setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [pathname])

  const showLabels = sidebarOpen && (!isMobile || sidebarOpen)

  return (
    <div className="admin-shell">

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div className="admin-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${
        isMobile
          ? sidebarOpen ? 'admin-sidebar--mobile-open' : 'admin-sidebar--mobile-hidden'
          : sidebarOpen ? 'admin-sidebar--open' : 'admin-sidebar--collapsed'
      }`}>

        {/* Logo */}
        <div className="admin-sidebar__logo">
          <img src="/images/lerd-logo.png" alt="LERD" className="admin-logo-img" />
          {showLabels && <span className="admin-badge">Admin</span>}
          {isMobile && (
            <button className="admin-toggle-btn admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
              }
            >
              <Icon size={18} className="admin-nav-icon" />
              {showLabels && <span className="admin-nav-label">{label}</span>}
              {showLabels && <ChevronRight size={14} className="admin-nav-arrow" />}
            </NavLink>
          ))}
        </nav>

        {/* Back to site */}
        <button className="admin-nav-item admin-logout" onClick={() => navigate('/')}>
          <LogOut size={18} className="admin-nav-icon" />
          {showLabels && <span className="admin-nav-label">Back to Site</span>}
        </button>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className={`admin-main ${isMobile ? 'admin-main--mobile' : sidebarOpen ? '' : 'admin-main--collapsed'}`}>

        {/* Topbar */}
        <header className="admin-topbar">
          <button className="admin-toggle-btn" onClick={() => setSidebarOpen(p => !p)}>
            <Menu size={20} />
          </button>
          <span className="admin-topbar__title">LERD Admin Panel</span>
          <div className="admin-topbar__user" ref={avatarMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setAvatarMenu(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div className="admin-avatar">
                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.4 }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#F5ECD7', whiteSpace: 'nowrap', textAlign: 'left' }}>
                  {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
                </span>
                <span style={{ fontSize: '11px', color: '#A07850', whiteSpace: 'nowrap', textAlign: 'left' }}>
                  {user?.email || ''}
                </span>
              </div>
            </button>

            {/* Avatar dropdown */}
            {avatarMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                background: '#1A0F08', border: '1px solid rgba(196,154,108,0.2)',
                borderRadius: '10px', padding: '6px', minWidth: '170px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100,
              }}>
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', action: () => { navigate('/admin'); setAvatarMenu(false) } },
                  { icon: Home,            label: 'Home Page',  action: () => { navigate('/');      setAvatarMenu(false) } },
                  { icon: LogOut,          label: 'Logout',     action: async () => { await signOut(auth); navigate('/login') }, danger: true },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button key={label} onClick={action}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 12px', borderRadius: '7px', background: 'none', border: 'none',
                      cursor: 'pointer', color: danger ? '#f87171' : '#C49A6C',
                      fontSize: '12px', letterSpacing: '0.08em', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
