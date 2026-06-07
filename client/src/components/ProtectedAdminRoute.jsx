import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const API = import.meta.env.VITE_API_URL

export default function ProtectedAdminRoute({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'admin' | 'blocked' | 'guest'

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setStatus('guest'); return }
      try {
        const token = await user.getIdToken()
        const res   = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data  = await res.json()
        setStatus(data.type === 'admin' ? 'admin' : 'blocked')
      } catch {
        setStatus('blocked')
      }
    })
    return unsub
  }, [])

  if (status === 'loading') return (
    <div style={{
      minHeight: '100vh', background: '#0D0703',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px', height: '32px', margin: '0 auto 16px',
          border: '2px solid rgba(184,134,11,0.25)',
          borderTop: '2px solid #B8860B',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#A07850', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Verifying access…
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (status === 'guest')   return <Navigate to="/login" replace />
  if (status === 'blocked') return <Navigate to="/" replace />
  return children
}
