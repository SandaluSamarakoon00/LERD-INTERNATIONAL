import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X, Home, LogOut, LayoutDashboard, UserCircle, Phone, Mail, AtSign, Truck } from 'lucide-react'
import { auth } from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useCart } from '../../context/CartContext'

const API = import.meta.env.VITE_API_URL

const navLinks = [
  { to: '/',           label: 'Home'      },
  { to: '/about',      label: 'About'     },
  { to: '/products',   label: 'Products'  },
  { to: '/novara',     label: 'Novara'    },
  { to: '/contact',    label: 'Contact'   },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [open,         setOpen]         = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [user,         setUser]         = useState(null)
  const [userType,     setUserType]     = useState('user')
  const [userProfile,  setUserProfile]  = useState(null)
  const [userMenu,     setUserMenu]     = useState(false)
  const [accountModal, setAccountModal] = useState(false)
  const { pathname }                    = useLocation()
  const navigate                        = useNavigate()
  const searchInputRef                  = useRef(null)
  const userMenuRef                     = useRef(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        try {
          const token = await u.getIdToken()
          const res   = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
          const data  = await res.json()
          setUserType(data.type || 'user')
          setUserProfile(data)
        } catch {
          setUserType('user')
        }
      } else {
        setUserType('user')
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close menus on route change
  useEffect(() => { setOpen(false); setSearchOpen(false); setUserMenu(false) }, [pathname])

  // close user dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50)
  }, [searchOpen])

  function toggleSearch() {
    setSearchOpen(prev => !prev)
    setOpen(false)
  }

  async function handleLogout() {
    await signOut(auth)
    setUserMenu(false)
    navigate('/login')
  }

  const { totalItems, setOpen: openCart } = useCart()

  const displayName  = user?.displayName || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || ''
  const initial      = displayName[0]?.toUpperCase()

  return (
    <>
      {/* ── TOP HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-1 md:py-3' : 'py-2 md:py-5'
        }`}
        style={{
          background: scrolled
            ? 'rgba(20, 10, 4, 0.90)'
            : 'rgba(20, 10, 4, 0.60)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="w-full px-6 flex items-center">

          {/* LEFT: Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/images/lerd-logo.png"
                alt="LERD"
                className="h-16 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
          </div>

          {/* CENTER: Nav links (desktop only) */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-[11px] tracking-[0.28em] uppercase transition-colors duration-200 pb-0.5 border-b ${
                    isActive
                      ? 'text-yellow-500 border-yellow-500'
                      : 'text-leather-200 border-transparent hover:text-yellow-400 hover:border-yellow-400'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT: Icons */}
          <div className="flex-1 flex justify-end items-center gap-6">

            {/* Mobile: Search + Menu buttons */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={() => { setSearchOpen(prev => !prev); setOpen(false) }}
                className="flex flex-col items-center justify-center gap-1 py-1 px-2 transition-colors duration-200"
                style={{ color: searchOpen ? '#EAB308' : '#C49A6C' }}
                aria-label="Search"
              >
                {searchOpen ? <X size={20} /> : <Search size={20} />}
                <span className="text-[8px] tracking-[0.2em] uppercase">Search</span>
              </button>

              <button
                onClick={() => { setOpen(prev => !prev); setSearchOpen(false) }}
                className="flex flex-col items-center justify-center gap-1 py-1 px-2 transition-colors duration-200"
                style={{ color: open ? '#EAB308' : '#C49A6C' }}
                aria-label="Menu"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
                <span className="text-[8px] tracking-[0.2em] uppercase">{open ? 'Close' : 'Menu'}</span>
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center justify-center gap-1 py-1 px-2 transition-colors duration-200"
                  style={{ color: '#C49A6C' }}
                  aria-label="Sign out"
                >
                  <LogOut size={20} />
                  <span className="text-[8px]" style={{ opacity: 0 }}>·</span>
                </button>
              )}
            </div>

            {/* Desktop icons */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={toggleSearch}
                style={{ color: searchOpen ? '#EAB308' : '#C49A6C' }}
                className="hover:text-yellow-400 transition-colors duration-200"
                aria-label="Search"
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              <button onClick={() => openCart(true)} style={{ color: '#C49A6C', background: 'none', border: 'none', cursor: 'pointer' }} className="relative hover:text-yellow-400 transition-colors duration-200" aria-label="Cart">
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-600 text-leather-900 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">{totalItems}</span>
                )}
              </button>

              {/* User area — logged in or not */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenu(p => !p)}
                    className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
                  >
                    {/* Avatar circle */}
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #B8860B, #8B6914)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '700', color: '#fff',
                      border: '1.5px solid rgba(196,154,108,0.5)',
                      flexShrink: 0,
                    }}>
                      {initial}
                    </div>
                    {/* Name + email */}
                    <div className="flex flex-col items-start leading-tight">
                      <span style={{ fontSize: '14px', color: '#F5ECD7', fontWeight: '600', letterSpacing: '0.03em' }}>
                        {displayName}
                      </span>
                      <span style={{ fontSize: '11px', color: '#A07850', letterSpacing: '0.02em' }}>
                        {displayEmail}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown */}
                  {userMenu && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                      background: '#1A0F08', border: '1px solid rgba(196,154,108,0.2)',
                      borderRadius: '10px', padding: '6px', minWidth: '170px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}>
                      {userType === 'admin' && (
                        <>
                          <button onClick={() => { navigate('/admin'); setUserMenu(false) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left"
                            style={{ color: '#C49A6C', fontSize: '12px', letterSpacing: '0.06em', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <LayoutDashboard size={14} /> Dashboard
                          </button>
                          <button onClick={() => { navigate('/'); setUserMenu(false) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left"
                            style={{ color: '#C49A6C', fontSize: '12px', letterSpacing: '0.06em', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Home size={14} /> Home Page
                          </button>
                          <div style={{ height: '1px', background: 'rgba(196,154,108,0.15)', margin: '4px 8px' }} />
                        </>
                      )}
                      <button onClick={() => { setAccountModal(true); setUserMenu(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left"
                        style={{ color: '#C49A6C', fontSize: '12px', letterSpacing: '0.06em', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <UserCircle size={14} /> Account
                      </button>
                      <div style={{ height: '1px', background: 'rgba(196,154,108,0.15)', margin: '4px 8px' }} />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left"
                        style={{ color: '#f87171', fontSize: '12px', letterSpacing: '0.06em', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ color: '#C49A6C' }} className="hover:text-yellow-400 transition-colors duration-200" aria-label="Login">
                  <User size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div
          style={{
            maxHeight: searchOpen ? '80px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            borderTop: searchOpen ? '1px solid rgba(196,154,108,0.15)' : 'none',
            backgroundColor: 'rgba(20, 10, 4, 0.98)',
          }}
          className="block"
        >
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            <Search size={16} style={{ color: '#B8860B' }} className="shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for wallets, bags, belts..."
              className="flex-1 bg-transparent text-sm text-leather-100 placeholder-leather-500 outline-none"
              style={{ letterSpacing: '0.05em' }}
              onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-leather-500 hover:text-leather-300 transition-colors shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #B8860B55, transparent)' }} />
        </div>

        {/* Mobile slide-down nav menu */}
        {open && (
          <div className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
            style={{ backgroundColor: '#1A0F08', borderColor: '#2C1A0E' }}>
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-[11px] tracking-[0.28em] uppercase py-2 border-b ${
                    isActive ? 'text-yellow-500 border-yellow-700' : 'text-leather-200 border-leather-800'
                  }`
                }>
                {label}
              </NavLink>
            ))}
            {/* Admin + logout options in mobile menu */}
            {user && userType === 'admin' && (
              <>
                <button onClick={() => navigate('/admin')}
                  className="text-left text-[11px] tracking-[0.28em] uppercase py-2 border-b border-leather-800 flex items-center gap-2"
                  style={{ color: '#C49A6C', background: 'none', border: 'none', borderBottom: '1px solid #2C1A0E', cursor: 'pointer' }}>
                  <LayoutDashboard size={13} /> Dashboard
                </button>
              </>
            )}
            {user && (
              <button onClick={handleLogout}
                className="text-left text-[11px] tracking-[0.28em] uppercase py-2 border-b border-leather-800 flex items-center gap-2"
                style={{ color: '#f87171', background: 'none', border: 'none', borderBottom: '1px solid #2C1A0E', cursor: 'pointer' }}>
                <LogOut size={13} /> Logout
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── MOBILE BOTTOM NAV BAR ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
        style={{ background: '#1A0F08', borderTop: '1px solid rgba(196,154,108,0.2)', height: '64px' }}
      >
        {/* Menu */}
        <button onClick={() => setOpen(!open)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-200"
          style={{ color: open ? '#EAB308' : '#C49A6C' }} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
          <span className="text-[9px] tracking-[0.15em] uppercase">Menu</span>
        </button>

        {/* Home */}
        <NavLink to="/" end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-200 ${isActive ? 'text-yellow-500' : 'text-[#C49A6C]'}`
          } aria-label="Home">
          <Home size={20} />
          <span className="text-[9px] tracking-[0.15em] uppercase">Home</span>
        </NavLink>

        {/* Cart */}
        <button onClick={() => openCart(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-200"
          style={{ color: '#C49A6C', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Cart">
          <div className="relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-600 text-leather-900 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">{totalItems}</span>
            )}
          </div>
          <span className="text-[9px] tracking-[0.15em] uppercase">Cart</span>
        </button>

        {/* My Account / User */}
        {user ? (
          <button
            onClick={() => setAccountModal(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
            style={{ color: '#C49A6C', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #B8860B, #8B6914)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: '700', color: '#fff',
            }}>
              {initial}
            </div>
            <span className="text-[9px] tracking-[0.15em] uppercase" style={{ maxWidth: '56px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName.split(' ')[0]}
            </span>
          </button>
        ) : (
          <Link to="/login"
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-200"
            style={{ color: pathname === '/login' ? '#EAB308' : '#C49A6C' }} aria-label="My Account">
            <User size={20} />
            <span className="text-[9px] tracking-[0.15em] uppercase">My Account</span>
          </Link>
        )}
      </nav>

      {/* ── ACCOUNT MODAL ── */}
      {accountModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setAccountModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1A0F08', border: '1px solid rgba(196,154,108,0.25)',
              borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#F5ECD7' }}>My Account</h2>
              <button onClick={() => setAccountModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07850' }}>
                <X size={18} />
              </button>
            </div>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #B8860B, #8B6914)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: '700', color: '#fff',
                border: '2px solid rgba(196,154,108,0.4)',
              }}>
                {initial}
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#F5ECD7' }}>{displayName}</p>
                <span style={{
                  fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: userType === 'admin' ? '#B8860B' : '#1E88E5',
                  background: userType === 'admin' ? '#B8860B22' : '#1E88E522',
                  padding: '2px 8px', borderRadius: '4px',
                }}>
                  {userType}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(196,154,108,0.15)', marginBottom: '20px' }} />

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: UserCircle, label: 'Full Name',  value: userProfile?.name  || displayName },
                { icon: AtSign,     label: 'Username',   value: userProfile?.username ? `@${userProfile.username}` : '—' },
                { icon: Mail,       label: 'Email',      value: displayEmail },
                { icon: Phone,      label: 'Phone',      value: userProfile?.phone || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                    background: 'rgba(184,134,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={15} style={{ color: '#B8860B' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: '#7A5C3A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1px' }}>{label}</p>
                    <p style={{ fontSize: '13px', color: '#F5ECD7' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
