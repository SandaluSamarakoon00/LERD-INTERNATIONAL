import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const API         = import.meta.env.VITE_API_URL
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items,    setItems]    = useState([])
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [user,     setUser]     = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        await fetchCart(u)
      } else {
        // load from localStorage for guests
        const saved = localStorage.getItem('lerd_cart')
        setItems(saved ? JSON.parse(saved) : [])
      }
    })
    return unsub
  }, [])

  async function fetchCart(u) {
    try {
      const token = await u.getIdToken()
      const res   = await fetch(`${API}/api/cart`, { headers: { Authorization: `Bearer ${token}` } })
      const data  = await res.json()
      setItems(data.items || [])
    } catch {
      setItems([])
    }
  }

  async function addToCart(product, qty = 1) {
    const item = {
      productId: product.id,
      name:      product.name,
      price:     product.price,
      image:     product.mainImage || null,
      quantity:  qty,
    }

    if (user) {
      setLoading(true)
      try {
        const token = await user.getIdToken()
        const res   = await fetch(`${API}/api/cart/add`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify(item),
        })
        const data = await res.json()
        setItems(data.items || [])
      } catch { }
      setLoading(false)
    } else {
      // Guest cart in localStorage
      setItems(prev => {
        const existing = prev.findIndex(i => i.productId === product.id)
        let updated
        if (existing >= 0) {
          updated = prev.map((i, idx) => idx === existing ? { ...i, quantity: i.quantity + qty } : i)
        } else {
          updated = [...prev, { ...item }]
        }
        localStorage.setItem('lerd_cart', JSON.stringify(updated))
        return updated
      })
    }
    setOpen(true)
  }

  async function removeFromCart(productId) {
    if (user) {
      try {
        const token = await user.getIdToken()
        const res   = await fetch(`${API}/api/cart/remove/${productId}`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setItems(data.items || [])
      } catch { }
    } else {
      setItems(prev => {
        const updated = prev.filter(i => i.productId !== productId)
        localStorage.setItem('lerd_cart', JSON.stringify(updated))
        return updated
      })
    }
  }

  async function updateQuantity(productId, newQty) {
    if (newQty <= 0) return removeFromCart(productId)

    if (user) {
      try {
        const token = await user.getIdToken()
        const res   = await fetch(`${API}/api/cart/update`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ productId, quantity: newQty }),
        })
        const data = await res.json()
        setItems(data.items || [])
      } catch { }
    } else {
      setItems(prev => {
        const updated = prev.map(i => i.productId === productId ? { ...i, quantity: newQty } : i)
        localStorage.setItem('lerd_cart', JSON.stringify(updated))
        return updated
      })
    }
  }

  async function clearCart() {
    if (user) {
      try {
        const token = await user.getIdToken()
        await fetch(`${API}/api/cart/clear`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      } catch { }
    } else {
      localStorage.removeItem('lerd_cart')
    }
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0)

  return (
    <CartContext.Provider value={{ items, open, setOpen, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
