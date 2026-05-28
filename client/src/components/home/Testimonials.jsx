import { Star } from 'lucide-react'
import { testimonials } from '../../data/products'

export default function Testimonials() {
  return (
    <section className="py-24 bg-leather-100 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] text-yellow-600 uppercase mb-3">Happy customers</p>
          <h2 className="font-serif text-4xl md:text-5xl text-leather-800">What They Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ id, name, location, text, rating }) => (
            <div key={id} className="bg-white p-8 relative">
              {/* Quote mark */}
              <span className="font-serif text-7xl text-leather-200 leading-none absolute top-4 left-6 select-none">"</span>

              {/* Stars */}
              <div className="flex gap-1 mb-4 relative z-10">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={13} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-leather-600 text-sm leading-relaxed mb-6 relative z-10">{text}</p>

              <div className="flex items-center gap-3 border-t border-leather-100 pt-5">
                <div className="w-9 h-9 rounded-full bg-leather-700 flex items-center justify-center text-leather-100 text-xs font-bold">
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-leather-800">{name}</p>
                  <p className="text-xs text-leather-400">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
