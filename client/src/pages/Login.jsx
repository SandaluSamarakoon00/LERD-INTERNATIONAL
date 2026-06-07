import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Phone, AtSign } from 'lucide-react'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import '../styles/Login.css'

const API = import.meta.env.VITE_API_URL

function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Invalid credentials'
    case 'auth/email-already-in-use': return 'Email is already registered'
    case 'auth/weak-password':        return 'Password must be at least 6 characters'
    case 'auth/invalid-email':        return 'Invalid email address'
    case 'auth/too-many-requests':    return 'Too many attempts. Please try again later'
    default: return ''
  }
}

export default function Login() {
  const [tab,         setTab]         = useState('login')
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [googleLoad,  setGoogleLoad]  = useState(false)
  const [error,       setError]       = useState('')

  // Login
  const [loginIdentifier, setLoginIdentifier] = useState('')  // email or username
  const [loginPassword,   setLoginPassword]   = useState('')

  // Forgot password
  const [resetEmail,   setResetEmail]   = useState('')
  const [resetSent,    setResetSent]    = useState(false)

  // Register
  const [regName,     setRegName]     = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regEmail,    setRegEmail]    = useState('')
  const [regPhone,    setRegPhone]    = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm,  setRegConfirm]  = useState('')

  const navigate = useNavigate()

  function switchTab(t) {
    setTab(t)
    setError('')
    setResetSent(false)
    setResetEmail('')
    setShowPass(false)
    setShowConfirm(false)
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetSent(true)
    } catch (err) {
      setError(friendlyError(err.code) || 'Could not send reset email')
    } finally {
      setLoading(false)
    }
  }

  async function redirectByRole(user) {
    try {
      const token = await user.getIdToken()
      const res   = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const profile = await res.json()
      navigate(profile.type === 'admin' ? '/admin' : '/')
    } catch {
      navigate('/')
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoad(true)
    setError('')
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      await redirectByRole(cred.user)
    } catch (err) {
      setError(friendlyError(err.code) || err.message)
    } finally {
      setGoogleLoad(false)
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let email = loginIdentifier.trim()

      // If not an email, look up by username
      if (!email.includes('@')) {
        const res  = await fetch(`${API}/api/auth/find-email`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ username: email }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error('Username not found')
        email = data.email
      }

      const cred = await signInWithEmailAndPassword(auth, email, loginPassword)
      await redirectByRole(cred.user)
    } catch (err) {
      setError(friendlyError(err.code) || err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (regPassword !== regConfirm) return setError('Passwords do not match')
    if (regPassword.length < 6)     return setError('Password must be at least 6 characters')
    if (regUsername.length < 3)     return setError('Username must be at least 3 characters')
    if (/\s/.test(regUsername))     return setError('Username cannot contain spaces')

    setLoading(true)
    let newUser = null
    try {
      // Step 1: password goes directly to Firebase — never reaches our server
      const cred = await createUserWithEmailAndPassword(auth, regEmail, regPassword)
      newUser = cred.user
      await updateProfile(newUser, { displayName: regName })

      // Step 2: save profile (name/username/phone only — no password)
      const token = await newUser.getIdToken()
      const res   = await fetch(`${API}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ name: regName, username: regUsername, phone: regPhone }),
      })
      const data = await res.json()
      if (!res.ok) {
        await newUser.delete() // roll back Firebase user if profile save fails
        throw new Error(data.error || 'Registration failed')
      }

      await redirectByRole(newUser)
    } catch (err) {
      if (err.code) {
        setError(friendlyError(err.code) || err.message)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const isEmail = loginIdentifier.includes('@')

  return (
    <div className="login-page min-h-screen flex items-center justify-center px-4 py-32">

      <div className="login-card w-full max-w-md rounded-2xl overflow-hidden">

        <div className="login-accent-line" />

        <div className="px-8 py-10">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/images/lerd-logo.png" alt="LERD" className="login-logo h-12 w-auto object-contain" />
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg text-xs text-red-300 text-center"
              style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)' }}>
              {error}
            </div>
          )}

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <h2 className="font-playfair text-2xl text-leather-50 text-center mb-1">Welcome Back</h2>
              <p className="text-leather-400 text-xs text-center tracking-wider mb-2">Sign in to your LERD account</p>

              {/* Email or Username */}
              <div className="relative">
                {isEmail
                  ? <Mail   size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                  : <AtSign size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                }
                <input type="text" placeholder="Email or username" required autoComplete="username"
                  value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)}
                  className="login-input w-full pl-11 pr-4 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input type={showPass ? 'text' : 'password'} placeholder="Password" required autoComplete="current-password"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  className="login-input w-full pl-11 pr-11 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-leather-500 hover:text-leather-300 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => switchTab('forgot')}
                  className="text-xs text-yellow-600 hover:text-yellow-400 transition-colors tracking-wide">
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="login-submit-btn w-full py-3 rounded-lg text-[11px] tracking-[0.25em] uppercase font-semibold transition-all duration-200 active:scale-95 mt-1 disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px" style={{ background: 'rgba(196,154,108,0.2)' }} />
                <span className="text-[10px] tracking-widest uppercase text-leather-500">or</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(196,154,108,0.2)' }} />
              </div>

              <button type="button" onClick={handleGoogleSignIn} disabled={googleLoad}
                className="w-full py-3 rounded-lg text-[11px] tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(196,154,108,0.25)', color: '#F5ECD7' }}>
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.8C9.6 39.6 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.5 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                {googleLoad ? 'Signing in…' : 'Sign in with Google'}
              </button>

              <p className="text-center text-xs text-leather-500 mt-1">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchTab('register')}
                  className="text-yellow-600 hover:text-yellow-400 transition-colors">Create one</button>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <h2 className="font-playfair text-2xl text-leather-50 text-center mb-1">Create Account</h2>
              <p className="text-leather-400 text-xs text-center tracking-wider mb-2">Join the LERD community</p>

              {/* Full Name */}
              <div className="relative">
                <User size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Full name" required autoComplete="name"
                  value={regName} onChange={e => setRegName(e.target.value)}
                  className="login-input w-full pl-11 pr-4 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
              </div>

              {/* Username */}
              <div className="relative">
                <AtSign size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Username (no spaces)" required autoComplete="username"
                  value={regUsername} onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  className="login-input w-full pl-11 pr-4 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="email" placeholder="Email address" required autoComplete="email"
                  value={regEmail} onChange={e => setRegEmail(e.target.value)}
                  className="login-input w-full pl-11 pr-4 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="tel" placeholder="Phone number" autoComplete="tel"
                  value={regPhone} onChange={e => setRegPhone(e.target.value)}
                  className="login-input w-full pl-11 pr-4 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input type={showPass ? 'text' : 'password'} placeholder="Password" required autoComplete="new-password"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)}
                  className="login-input w-full pl-11 pr-11 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-leather-500 hover:text-leather-300 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm password" required autoComplete="new-password"
                  value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                  className="login-input w-full pl-11 pr-11 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-leather-500 hover:text-leather-300 transition-colors">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="login-submit-btn w-full py-3 rounded-lg text-[11px] tracking-[0.25em] uppercase font-semibold transition-all duration-200 active:scale-95 mt-1 disabled:opacity-50">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="text-center text-xs text-leather-500 mt-1">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('login')}
                  className="text-yellow-600 hover:text-yellow-400 transition-colors">Sign in</button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {tab === 'forgot' && (
            <form className="flex flex-col gap-5" onSubmit={handleForgotPassword}>
              <h2 className="font-playfair text-2xl text-leather-50 text-center mb-1">Reset Password</h2>
              <p className="text-leather-400 text-xs text-center tracking-wider mb-2">
                Enter your email and we'll send you a reset link
              </p>

              {resetSent ? (
                <div className="px-4 py-4 rounded-lg text-center"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <p className="text-green-400 text-sm font-semibold mb-1">Email sent!</p>
                  <p className="text-leather-400 text-xs">Check your inbox for the password reset link.</p>
                </div>
              ) : (
                <div className="relative">
                  <Mail size={15} className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" placeholder="Email address" required autoComplete="email"
                    value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                    className="login-input w-full pl-11 pr-4 py-3 rounded-lg text-sm text-leather-100 placeholder-leather-500 transition-all duration-200" />
                </div>
              )}

              {!resetSent && (
                <button type="submit" disabled={loading}
                  className="login-submit-btn w-full py-3 rounded-lg text-[11px] tracking-[0.25em] uppercase font-semibold transition-all duration-200 active:scale-95 mt-1 disabled:opacity-50">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              )}

              <p className="text-center text-xs text-leather-500 mt-1">
                Remember your password?{' '}
                <button type="button" onClick={() => switchTab('login')}
                  className="text-yellow-600 hover:text-yellow-400 transition-colors">Sign in</button>
              </p>
            </form>
          )}

        </div>

        <div className="login-accent-line" />
      </div>
    </div>
  )
}
