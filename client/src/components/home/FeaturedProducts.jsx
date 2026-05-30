import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const API = import.meta.env.VITE_API_URL

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(data => {
        const men   = data.filter(p => p.collection === 'Men')
        const women = data.filter(p => p.collection === 'Women')

        const pickedMen   = pickRandom(men,   2)
        const pickedWomen = pickRandom(women, 2)

        // Order: Men, Women, Men, Women
        const result = [
          pickedMen[0],
          pickedWomen[0],
          pickedMen[1],
          pickedWomen[1],
        ].filter(Boolean)

        setFeatured(result)
      })
      .catch(() => {})
  }, [])

  if (featured.length === 0) return null

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] text-yellow-600 uppercase mb-3">Handpicked for you</p>
            <h2 className="font-serif text-4xl md:text-5xl text-leather-800">Featured Collection</h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-leather-500 hover:text-yellow-600 transition-colors border-b border-leather-300 hover:border-yellow-600 pb-1 self-start md:self-auto"
          >
            View all products <ArrowRight size={13} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map(product => (
            <div
              key={product.id}
              className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4]">
                {product.mainImage ? (
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-leather-100 flex items-center justify-center text-leather-400 text-xs">
                    No image
                  </div>
                )}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-leather-800 text-leather-100 text-[9px] tracking-widest uppercase px-2 py-1">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-leather-900 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-[10px] tracking-[0.3em] text-leather-400 uppercase mb-1">
                  {product.category || product.collection}
                </p>
                <h3 className="font-serif text-leather-800 text-lg mb-2">{product.name}</h3>
                <p className="text-sm font-semibold text-leather-700">
                  Rs. {Number(product.price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
