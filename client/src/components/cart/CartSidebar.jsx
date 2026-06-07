import { X, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import '../../styles/CartSidebar.css'

export default function CartSidebar() {
  const { items, open, setOpen, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()

  if (!open) return null

  return (
    <>
      <div className="cart-overlay" onClick={() => setOpen(false)} />

      <aside className="cart-sidebar">

        {/* Header */}
        <div className="cart-header">
          <div>
            <span className="cart-header__title">Your Cart</span>
            <span className="cart-header__count">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          </div>
          <button className="cart-close-btn" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} className="cart-empty__icon" />
            <p className="cart-empty__text">Your cart is empty</p>
            <p className="cart-empty__sub">Add products to get started</p>
          </div>
        ) : (
          <div className="cart-items">
            {items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item__image">
                  {item.image
                    ? <img src={item.image} alt={item.name} />
                    : <div style={{ width:'100%', height:'100%', background:'#0D0703' }} />
                  }
                </div>
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__price">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    {item.quantity > 1 && (
                      <span className="cart-item__unit-price"> (Rs. {Number(item.price).toLocaleString()} each)</span>
                    )}
                  </p>
                  <div className="cart-item__bottom">
                    <div className="cart-item__qty-controls">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >−</button>
                      <span className="cart-item__qty-val">{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >+</button>
                    </div>
                    <button className="cart-item__remove" onClick={() => removeFromCart(item.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <button className="cart-checkout-btn" onClick={() => { setOpen(false); navigate('/checkout') }}>
              Proceed to Checkout
            </button>
            <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
          </div>
        )}
      </aside>
    </>
  )
}
