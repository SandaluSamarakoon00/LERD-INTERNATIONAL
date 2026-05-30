import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Products.css'

const API = import.meta.env.VITE_API_URL

const badgeColors = {
  Bestseller: { color: '#B8860B', background: '#B8860B22' },
  New:        { color: '#2E7D32', background: '#2E7D3222' },
  Limited:    { color: '#C62828', background: '#C6282822' },
}

const collectionTabs = [
  { key: 'Men',         label: 'Men'         },
  { key: 'Women',       label: 'Women'       },
  { key: 'Accessories', label: 'Accessories' },
]

export default function Products() {
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [collection, setCollection] = useState('Men')
  const [category,   setCategory]   = useState('All')
  const [maxPrice,   setMaxPrice]   = useState(300000)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleCollectionChange(c) {
    setCollection(c)
    setCategory('All')
    setSearch('')
    setMaxPrice(300000)
  }

  const collectionProducts = products.filter(p => p.collection === collection)
  const categoryList = collection === 'Accessories'
    ? []
    : [...new Set(collectionProducts.map(p => p.category).filter(Boolean))]

  const filtered = collectionProducts.filter(p => {
    const matchSearch   = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                          p.code?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || p.category === category
    const matchPrice    = maxPrice >= 300000 || Number(p.price) <= maxPrice
    return matchSearch && matchCategory && matchPrice
  })

  return (
    <div className="products-page">

      {/* Header */}
      <div className="products-header">
        <p className="products-header__eyebrow">Handcrafted in Sri Lanka</p>
        <h1 className="products-header__title">Our Collection</h1>
        <div className="products-header__line" />
      </div>

      {/* Body: sidebar + right */}
      <div className="products-body">

        {/* ── SIDEBAR (desktop only) ── */}
        <aside className="products-sidebar">

          {/* Price Range */}
          <div>
            <p className="sidebar-section__title">Price Range</p>
            <div className="price-range-labels">
              <span>Rs. 0</span>
              <span>Rs. 3,00,000</span>
            </div>
            <input type="range" className="price-range-input"
              min={0} max={300000} step={1000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))} />
            <p className="price-range-value">Up to Rs. {maxPrice.toLocaleString()}</p>
          </div>

          {/* Categories */}
          {categoryList.length > 0 && (
            <div>
              <p className="sidebar-section__title">Category</p>
              <div className="sidebar-category-list">
                <button
                  className={`sidebar-category-btn ${category === 'All' ? 'sidebar-category-btn--active' : ''}`}
                  onClick={() => setCategory('All')}>
                  <span>All</span>
                  <span className="sidebar-category-count">{collectionProducts.length}</span>
                </button>
                {categoryList.map(c => (
                  <button key={c}
                    className={`sidebar-category-btn ${category === c ? 'sidebar-category-btn--active' : ''}`}
                    onClick={() => setCategory(c)}>
                    <span>{c}</span>
                    <span className="sidebar-category-count">
                      {collectionProducts.filter(p => p.category === c).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── RIGHT SIDE ── */}
        <div className="products-right">

          {/* Collection Tabs */}
          <div className="products-collections">
            {collectionTabs.map(({ key, label }) => (
              <button key={key}
                className={`collection-tab ${collection === key ? 'collection-tab--active' : ''}`}
                onClick={() => handleCollectionChange(key)}>
                <span className="collection-tab__label">{label}</span>
              </button>
            ))}
          </div>

          {/* Mobile filters — price + categories */}
          <div className="mobile-filters">
            {/* Price range */}
            <div className="mobile-filter-section">
              <div className="mobile-filter-row">
                <span className="mobile-filter-label">Price Range</span>
                <span className="mobile-filter-value">Up to Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input type="range" className="price-range-input"
                min={0} max={300000} step={1000}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))} />
            </div>

            {/* Categories */}
            {categoryList.length > 0 && (
              <div className="mobile-filter-section">
                <span className="mobile-filter-label">Category</span>
                <div className="mobile-category-filters">
                  <button
                    className={`category-pill ${category === 'All' ? 'category-pill--active' : ''}`}
                    onClick={() => setCategory('All')}>All</button>
                  {categoryList.map(c => (
                    <button key={c}
                      className={`category-pill ${category === c ? 'category-pill--active' : ''}`}
                      onClick={() => setCategory(c)}>{c}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="products-search-wrap">
            <input type="text" className="products-search"
              placeholder={`Search ${collection} products...`}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="products-empty">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="products-empty">No products found.</div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => (
                <div key={p.id} className="product-card" onClick={() => navigate(`/products/${p.id}`)}>
                  <div className="product-card__image-wrap">
                    {p.mainImage
                      ? <img src={p.mainImage} alt={p.name} className="product-card__image" />
                      : <div className="product-card__no-image">No image</div>
                    }
                    {p.badge && (
                      <span className="product-card__badge" style={badgeColors[p.badge]}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="product-card__info">
                    {p.category && <p className="product-card__category">{p.category}</p>}
                    <h3 className="product-card__name">{p.name}</h3>
                    <p className="product-card__price">Rs. {Number(p.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
