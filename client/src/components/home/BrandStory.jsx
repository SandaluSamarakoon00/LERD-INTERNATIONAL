import { Link } from 'react-router-dom'

export default function BrandStory() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#FAF7F2', fontFamily: 'Josefin Sans, sans-serif' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Image side */}
        <div className="relative">
          <img
            src="/images/hero-spread.jpg"
            alt="Leather craftsman at work"
            className="w-full h-[500px] object-cover"
            style={{ border: '1px solid rgba(184,134,11,0.25)' }}
          />
        </div>

        {/* Text side */}
        <div>
          <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: '#B8860B' }}>Our Story</p>
          <h2
            className="font-serif leading-tight mb-6"
            style={{ color: '#1A0F08', fontSize: 'clamp(28px, 3.5vw, 46px)', fontFamily: 'Playfair Display, serif' }}
          >
            Where Leather<br />
            <span className="italic" style={{ color: '#B8860B' }}>Tells a Story</span>
          </h2>

          <p className="text-sm leading-relaxed mb-4" style={{ color: '#5C3D2E', textAlign: 'justify' }}>
            At LERD, we believe in crafting more than just leather products; we craft stories of sustainability and style. Our journey begins with locally sourced raw materials, supporting our community and reducing carbon footprints. We take pride in using only real leather, ensuring authenticity and durability without compromising on ethical standards. Every piece we create is meticulously handmade, embodying the artistry and dedication of our craftsmen.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#5C3D2E', textAlign: 'justify' }}>
            Our commitment to sustainability extends to our packaging, which is eco-friendly and designed to minimize environmental impact. We are proud to say that no animals are harmed in our production process; the leather we use is a by-product of the meat industry, promoting ethical practices and waste reduction.
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#5C3D2E', textAlign: 'justify' }}>
            LERD isn't just a brand; it's a symbol of responsible luxury, where each product tells a story of craftsmanship, ethics, and environmental consciousness. Join us in shaping a better world, one leather creation at a time.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-px" style={{ backgroundColor: '#B8860B', opacity: 0.6 }} />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#B8860B' }} />
            <div className="w-16 h-px" style={{ backgroundColor: '#B8860B', opacity: 0.6 }} />
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase px-8 py-3 transition-all duration-200"
            style={{ border: '1px solid #B8860B', color: '#B8860B' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B8860B'; e.currentTarget.style.color = '#FAF7F2' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#B8860B' }}
          >
            Read Full Story
          </Link>
        </div>
      </div>
    </section>
  )
}
