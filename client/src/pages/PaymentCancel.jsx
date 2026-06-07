import { Link, useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export default function PaymentCancel() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: '#100800',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(196,154,108,0.2)',
        borderRadius: '16px',
        padding: '56px 48px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
      }}>

        {/* Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 28px',
          background: 'rgba(220,38,38,0.1)',
          border: '2px solid rgba(220,38,38,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <XCircle size={34} style={{ color: '#f87171' }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '28px', color: '#F5ECD7', marginBottom: '12px',
        }}>
          Payment Cancelled
        </h1>

        <p style={{ fontSize: '13px', color: '#A07850', lineHeight: 1.7, marginBottom: '32px' }}>
          Your payment was cancelled and you have not been charged. Your cart items are still saved — you can try again whenever you're ready.
        </p>

        <div style={{ height: '1px', background: 'rgba(196,154,108,0.15)', marginBottom: '32px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate('/checkout')}
            style={{
              display: 'block', padding: '13px', width: '100%',
              background: 'linear-gradient(135deg, #B8860B, #8B6914)',
              border: 'none', borderRadius: '8px', color: '#FAF6F0',
              fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'Josefin Sans, sans-serif',
            }}
          >
            Try Again
          </button>
          <Link
            to="/products"
            style={{
              display: 'block', padding: '13px',
              border: '1px solid rgba(196,154,108,0.3)',
              borderRadius: '8px', color: '#C49A6C',
              fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase',
              fontWeight: 600, textDecoration: 'none', fontFamily: 'Josefin Sans, sans-serif',
            }}
          >
            Back to Products
          </Link>
        </div>

      </div>
    </div>
  )
}
