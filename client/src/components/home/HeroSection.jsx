import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import '../../styles/HeroSection.css'

const WORDS = ['Luxurious', 'Excellence', 'Reliable', 'Durable']

function LERDReveal() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300)
    const t2 = setTimeout(() => setPhase(2), 7500)
    const t3 = setTimeout(() => setPhase(3), 9200)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  return (
    <div className="mb-4">

      {/* LERD title area */}
      <div className="relative lerd-reveal-height">

        {/* Four words layer */}
        <div className="absolute inset-0 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-7">
          {WORDS.map((word, i) => (
            <div
              key={word}
              className="flex items-baseline overflow-hidden basis-[48%] sm:basis-auto justify-center sm:justify-start"
              style={{
                opacity: phase >= 1 && phase < 3 ? 1 : 0,
                transform: `translateY(${phase >= 1 ? 0 : 20}px)`,
                transition: `opacity 0.55s ease ${i * 0.14}s, transform 0.55s ease ${i * 0.14}s`,
              }}
            >
              <span
                className="font-serif leading-none font-bold"
                style={{ color: '#FACC15', fontSize: 'clamp(36px, 7vw, 110px)', lineHeight: 1 }}
              >
                {word[0]}
              </span>
              <span
                style={{
                  color: '#F5ECD7',
                  fontSize: 'clamp(14px, 1.2vw, 16px)',
                  fontFamily: 'Josefin Sans, sans-serif',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: phase >= 2 ? '0px' : '200px',
                  opacity: phase >= 2 ? 0 : 1,
                  transition: `max-width 0.65s ease ${i * 0.07}s, opacity 0.45s ease ${i * 0.07}s`,
                  marginLeft: '3px',
                  paddingBottom: '6px',
                  alignSelf: 'flex-end',
                }}
              >
                {word.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>

        {/* LERD title layer */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: `scale(${phase >= 3 ? 1 : 0.88})`,
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p
            className="font-serif leading-none tracking-tighter"
            style={{ color: '#F5ECD7', fontSize: 'clamp(48px, 8vw, 110px)' }}
          >
            LERD
          </p>
        </div>
      </div>

      {/* Words row — directly below LERD, fades in with it */}
      <div
        className="flex justify-center gap-4 sm:gap-6 mt-2"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: `translateY(${phase >= 3 ? 0 : 8}px)`,
          transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
        }}
      >
        {WORDS.map(w => (
          <span
            key={w}
            className="text-[9.5px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.35em] uppercase font-medium"
            style={{ color: '#F5ECD7' }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}

const photos = [
  '/images/hero-flatlay.jpg',
  '/images/hero-wallet.jpg',
  '/images/hero-main.jpg',
  '/images/hero-craft.jpg',
  '/images/hero-jewelry.jpg',
  '/images/hero-cases.jpg',
  '/images/hero-spread.jpg',
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-x-hidden"
      style={{ backgroundColor: '#1A0F08' }}
    >

      {/* ── Photo mosaic background ── */}
      <div className="lerd-bg-grid">
        {['ga','gb','gc','gd','ge','gf','gg'].map((cls, i) => (
          <div key={cls} className={cls}>
            <img src={photos[i]} alt="" />
          </div>
        ))}
      </div>

      {/* ── Dark warm overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(20,10,4,0.78) 0%, rgba(50,25,8,0.65) 50%, rgba(20,10,4,0.80) 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Grain texture ── */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          zIndex: 1,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Gold accent line ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-600 opacity-80"
        style={{ zIndex: 2 }}
      />

      {/* ── Text content ── */}
      <div
        className="relative w-full max-w-4xl mx-auto px-6 text-center pt-28 pb-8"
        style={{ zIndex: 3 }}
      >
        <p className="text-[13px] tracking-[0.15em] sm:tracking-[0.9em] text-yellow-400 uppercase mb-4">
          Handmade Leather Products <span className="whitespace-nowrap">Sri Lanka</span>
        </p>

        <LERDReveal />

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-24 h-px bg-yellow-400 opacity-90" />
          <div className="w-2 h-2 rotate-45 bg-yellow-400" />
          <div className="w-24 h-px bg-yellow-400 opacity-90" />
        </div>

        <h1
          className="font-serif leading-tight mb-3"
          style={{ color: '#F0E6D3', fontSize: 'clamp(22px, 3.5vw, 52px)' }}
        >
          Where Leather<br />
          <span className="italic text-yellow-500">Tells a Story</span>
        </h1>

        <p
          className="text-base tracking-wide max-w-lg mx-auto mb-7 leading-relaxed"
          style={{ color: '#FACC15' }}
        >
          Premium leather goods crafted by hand — each piece built to last a lifetime and age beautifully with you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-7">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-leather-900 px-10 py-3.5 text-xs tracking-[0.25em] uppercase font-bold transition-colors duration-200"
          >
            Shop Collection <ArrowRight size={14} />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 border border-leather-500 hover:border-yellow-500 hover:text-yellow-400 px-10 py-3.5 text-xs tracking-[0.25em] uppercase transition-colors duration-200"
            style={{ color: '#DFC5A0' }}
          >
            Our Story
          </Link>
        </div>

        <div
          className="flex justify-center gap-6 sm:gap-14 pt-6"
          style={{ borderTop: '2px solid rgba(250,204,21,0.55)' }}
        >
          {[
            { num: '100%', label: 'Handmade' },
            { num: '🇱🇰',  label: 'Made in Sri Lanka' },
          ].map(({ num, label, sub }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#FACC15' }}>{num}</p>
              <p className="text-[9px] sm:text-[12px] tracking-[0.1em] sm:tracking-[0.35em] uppercase mt-1 font-medium whitespace-nowrap" style={{ color: '#F5ECD7' }}>{label}</p>
              <p className="text-[10px] tracking-wide mt-0.5" style={{ color: '#A67C52' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}