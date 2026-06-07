import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useCart } from '../context/CartContext'
import '../styles/Checkout.css'

const API     = import.meta.env.VITE_API_URL
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina',
  'Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
  'Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana',
  'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon',
  'Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Congo (Brazzaville)','Congo (Kinshasa)','Costa Rica','Croatia','Cuba','Cyprus',
  'Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji',
  'Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada',
  'Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland',
  'India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho',
  'Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia',
  'Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
  'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia',
  'Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea',
  'North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea',
  'Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa',
  'San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles',
  'Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland',
  'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu',
  'Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

function submitToPayHere(params) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = params.payhere_url

  const fields = { ...params }
  delete fields.payhere_url

  Object.entries(fields).forEach(([key, value]) => {
    if (value == null) return
    const input = document.createElement('input')
    input.type  = 'hidden'
    input.name  = key
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

export default function Checkout() {
  const location                     = useLocation()
  const navigate                     = useNavigate()
  const { items: cartItems, totalPrice: cartTotal, clearCart } = useCart()

  // Support "Buy Now" direct purchase (passed via router state)
  const directItem  = location.state?.directItem   // { productId, name, price, image, quantity }
  const items       = directItem ? [directItem] : cartItems
  const total       = directItem
    ? Number(directItem.price) * directItem.quantity
    : cartTotal

  const [user,     setUser]     = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', phone2: '',
    country: 'Sri Lanka', address1: '', address2: '', city: '', state: '', postalCode: '',
  })

  // Pre-fill from Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (u) {
        const parts = (u.displayName || '').split(' ')
        setForm(f => ({
          ...f,
          firstName: parts[0] || '',
          lastName:  parts.slice(1).join(' ') || '',
          email:     u.email || '',
        }))
      }
    })
    return unsub
  }, [])

  // Redirect if cart is empty and no direct item
  useEffect(() => {
    if (!directItem && cartItems.length === 0) {
      navigate('/products', { replace: true })
    }
  }, [cartItems, directItem, navigate])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        items,
        amount: total,
        userId: user?.uid || null,
        customer: {
          firstName:  form.firstName,
          lastName:   form.lastName,
          email:      form.email,
          phone:      form.phone,
          phone2:     form.phone2 || null,
          country:    form.country,
          address1:   form.address1,
          address2:   form.address2 || null,
          city:       form.city,
          state:      form.state || null,
          postalCode: form.postalCode,
        },
      }

      const res  = await fetch(`${API}/api/orders/initiate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not initiate payment')

      // Save order data for the return page (PDF + summary)
      sessionStorage.setItem('lerd_order', JSON.stringify({
        orderId:   data.order_id,
        items,
        customer:  payload.customer,
        amount:    total,
        createdAt: new Date().toISOString(),
      }))

      // Clear guest cart immediately; Firestore cart is cleared by the notify webhook
      if (!user) clearCart()

      submitToPayHere({
        merchant_id:  data.merchant_id,
        return_url:   `${APP_URL}/payment/success`,
        cancel_url:   `${APP_URL}/payment/cancel`,
        notify_url:   data.notify_url,
        order_id:     data.order_id,
        items:        items.map(i => i.name).join(', '),
        currency:     data.currency,
        amount:       data.amount,
        first_name:   form.firstName,
        last_name:    form.lastName,
        email:        form.email,
        phone:        form.phone,
        address:      [form.address1, form.address2].filter(Boolean).join(', '),
        city:         form.city,
        country:      form.country,
        hash:         data.hash,
        payhere_url:  data.payhere_url,
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const subtotal  = total
  const shipping  = 0
  const grandTotal = subtotal + shipping

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* Header */}
        <div className="checkout-header">
          <p className="checkout-header__eyebrow">Secure Checkout</p>
          <h1 className="checkout-header__title">Complete Your Order</h1>
          <div className="checkout-header__divider">
            <div className="checkout-header__line" />
            <div className="checkout-header__diamond" />
            <div className="checkout-header__line" />
          </div>
        </div>

        <div className="checkout-body">

          {/* ── Order Summary ── */}
          <div className="checkout-summary">
            <p className="checkout-summary__title">Order Summary</p>

            {items.map((item, i) => (
              <div key={item.productId || i} className="checkout-item">
                <div className="checkout-item__img">
                  {item.image
                    ? <img src={item.image} alt={item.name} />
                    : null
                  }
                </div>
                <div className="checkout-item__info">
                  <p className="checkout-item__name">{item.name}</p>
                  <p className="checkout-item__qty">Qty: {item.quantity}</p>
                </div>
                <p className="checkout-item__price">
                  Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span className="checkout-total-label">Subtotal</span>
                <span className="checkout-total-value">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="checkout-total-row">
                <span className="checkout-total-label">Shipping</span>
                <span className="checkout-total-value" style={{ color: '#4ade80', fontSize: '12px' }}>Free</span>
              </div>
              <div className="checkout-total-row" style={{ marginTop: '12px' }}>
                <span className="checkout-grand-label">Total</span>
                <span className="checkout-grand-value">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ── Customer Form ── */}
          <div className="checkout-form-card">
            <p className="checkout-form-title">Your Details</p>

            {error && <div className="checkout-error">{error}</div>}

            <form onSubmit={handleSubmit}>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label className="checkout-label">First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange}
                    className="checkout-input" placeholder="Sandalu" required disabled={loading} />
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange}
                    className="checkout-input" placeholder="Samarakoon" required disabled={loading} />
                </div>
              </div>

              <div className="checkout-field">
                <label className="checkout-label">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="checkout-input" placeholder="you@email.com" required disabled={loading} />
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label className="checkout-label">Phone <span style={{ color: '#f87171' }}>*</span></label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                    className="checkout-input" placeholder="+94 77 123 4567" required disabled={loading} />
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">
                    Alt. Phone <span style={{ color: '#5C3D2E', fontSize: '9px' }}>(optional)</span>
                  </label>
                  <input name="phone2" type="tel" value={form.phone2} onChange={handleChange}
                    className="checkout-input" placeholder="+94 71 765 4321" disabled={loading} />
                </div>
              </div>

              <div className="checkout-field">
                <label className="checkout-label">Country</label>
                <select name="country" value={form.country} onChange={handleChange}
                  className="checkout-input checkout-select" required disabled={loading}>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="checkout-field">
                <label className="checkout-label">
                  Address Line 1 <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input name="address1" value={form.address1} onChange={handleChange}
                  className="checkout-input" placeholder="Street number and street name"
                  required disabled={loading} />
              </div>

              <div className="checkout-field">
                <label className="checkout-label">
                  Address Line 2 <span style={{ color: '#5C3D2E', fontSize: '9px' }}>(optional)</span>
                </label>
                <input name="address2" value={form.address2} onChange={handleChange}
                  className="checkout-input"
                  placeholder="Apartment, suite, unit, floor, building"
                  disabled={loading} />
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label className="checkout-label">City <span style={{ color: '#f87171' }}>*</span></label>
                  <input name="city" value={form.city} onChange={handleChange}
                    className="checkout-input" placeholder="Kandy" required disabled={loading} />
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">
                    State / Province <span style={{ color: '#5C3D2E', fontSize: '9px' }}>(optional)</span>
                  </label>
                  <input name="state" value={form.state} onChange={handleChange}
                    className="checkout-input" placeholder="Central Province" disabled={loading} />
                </div>
              </div>

              <div className="checkout-field">
                <label className="checkout-label">Postal Code / ZIP <span style={{ color: '#f87171' }}>*</span></label>
                <input name="postalCode" value={form.postalCode} onChange={handleChange}
                  className="checkout-input" placeholder="20000" required disabled={loading} />
              </div>

              <button type="submit" className="checkout-pay-btn" disabled={loading}>
                {loading ? (
                  <><div className="checkout-spinner" /> Processing…</>
                ) : (
                  <><ShieldCheck size={16} /> Pay Rs. {grandTotal.toLocaleString()} with PayHere</>
                )}
              </button>

              <p className="checkout-secure-note">
                Secured by PayHere · Your payment details are encrypted
              </p>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
