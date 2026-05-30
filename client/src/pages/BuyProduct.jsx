import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingBag, Zap, ChevronRight } from 'lucide-react'
import '../styles/BuyProduct.css'

const API = import.meta.env.VITE_API_URL

const badgeColors = {
  Bestseller: { color: '#B8860B', background: '#B8860B22' },
  New:        { color: '#2E7D32', background: '#2E7D3222' },
  Limited:    { color: '#C62828', background: '#C6282822' },
}

export default function BuyProduct() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [product,    setProduct]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [activeImg,  setActiveImg]  = useState(null)
  const [cartMsg,    setCartMsg]    = useState(false)

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        setActiveImg(data.mainImage || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    setCartMsg(true)
    setTimeout(() => setCartMsg(false), 2500)
  }

  const allImages = product
    ? [product.mainImage, ...(product.subImages || [])].filter(Boolean)
    : []

  const stockStatus = () => {
    if (!product) return null
    if (product.stock === null || product.stock === undefined) return null
    if (product.stock === 0)  return <span className="buy-stock buy-stock--out">Out of stock</span>
    if (product.stock <= 5)   return <span className="buy-stock buy-stock--low">Only {product.stock} left</span>
    return <span className="buy-stock buy-stock--in">In stock</span>
  }

  if (loading) return <div className="buy-page"><div className="buy-loading">Loading product…</div></div>
  if (!product) return <div className="buy-page"><div className="buy-loading">Product not found.</div></div>

  return (
    <div className="buy-page">
      <div className="buy-container">

        {/* Breadcrumb */}
        <nav className="buy-breadcrumb">
          <button className="buy-breadcrumb__link" onClick={() => navigate('/')}>Home</button>
          <ChevronRight size={12} className="buy-breadcrumb__sep" />
          <button className="buy-breadcrumb__link" onClick={() => navigate('/products')}>Products</button>
          <ChevronRight size={12} className="buy-breadcrumb__sep" />
          <span className="buy-breadcrumb__current">{product.name}</span>
        </nav>

        <div className="buy-layout">

          {/* ── LEFT: Images ── */}
          <div className="buy-images">

            {/* Thumbnails — left strip on desktop, below on mobile */}
            {allImages.length > 1 && (
              <div className="buy-sub-images">
                {allImages.map((url, i) => (
                  <div key={i}
                    className={`buy-sub-thumb ${activeImg === url ? 'buy-sub-thumb--active' : ''}`}
                    onClick={() => setActiveImg(url)}>
                    <img src={url} alt={`view-${i}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="buy-main-image">
              {activeImg
                ? <img src={activeImg} alt={product.name} />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#7A5C3A' }}>No image</div>
              }
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="buy-details">

            {/* Badges */}
            <div className="buy-badges">
              {product.collection && (
                <span className="buy-collection-badge">{product.collection}</span>
              )}
              {product.badge && (
                <span className="buy-badge" style={badgeColors[product.badge]}>{product.badge}</span>
              )}
            </div>

            {product.category && <p className="buy-category">{product.category}</p>}

            <h1 className="buy-name">{product.name}</h1>
            <span className="buy-code">{product.code}</span>

            <div className="buy-divider" />

            <p className="buy-price">Rs. {Number(product.price).toLocaleString()}</p>
            {/* {stockStatus()} */}

            {product.description && (
              <>
                <div className="buy-divider" />
                <p className="buy-description">{product.description}</p>
              </>
            )}

            {/* Action Buttons */}
            <div className="buy-actions">
              <button className="buy-btn-buynow" onClick={() => navigate('/contact')}>
                <Zap size={14} style={{ display:'inline', marginRight:'8px', verticalAlign:'middle' }} />
                Buy Now
              </button>
              <button className="buy-btn-cart" onClick={handleAddToCart}>
                <ShoppingBag size={14} style={{ display:'inline', marginRight:'8px', verticalAlign:'middle' }} />
                {cartMsg ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
