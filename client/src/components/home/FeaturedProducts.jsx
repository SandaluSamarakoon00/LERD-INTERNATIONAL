import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { products } from '../../data/products'

export default function FeaturedProducts() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">

              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-leather-800 text-leather-100 text-[9px] tracking-widest uppercase px-2 py-1">
                    {product.badge}
                  </span>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-leather-900 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-yellow-600 hover:bg-yellow-500 text-leather-900 text-xs tracking-widest uppercase px-5 py-2.5 flex items-center gap-2 font-semibold">
                    <ShoppingBag size={13} /> Add to cart
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-[10px] tracking-[0.3em] text-leather-400 uppercase mb-1">{product.category}</p>
                <h3 className="font-serif text-leather-800 text-lg mb-2">{product.name}</h3>
                <p className="text-sm font-semibold text-leather-700">
                  Rs. {product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
