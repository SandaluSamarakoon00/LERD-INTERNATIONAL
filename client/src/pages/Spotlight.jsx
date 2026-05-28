import '../styles/Spotlight.css'

const photos = [
  { src: '/images/spotlight-1.jpg', alt: 'LERD at fashion show' },
  { src: '/images/spotlight-2.jpg', alt: 'LERD runway look' },
  { src: '/images/spotlight-3.jpg', alt: 'LERD collection showcase' },
  { src: '/images/spotlight-4.jpg', alt: 'LERD runway group shot' },
  { src: '/images/spotlight-5.jpg', alt: 'LERD leather harness on runway' },
  { src: '/images/spotlight-6.jpg', alt: 'LERD portrait shoot' },
  { src: '/images/spotlight-7.jpg', alt: 'LERD leather strap detail' },
]

export default function Spotlight() {
  return (
    <div className="spotlight-page">

      {/* ── Hero ── */}
      <div className="spotlight-hero">
        <p className="spotlight-hero-eyebrow">Fashion · Events · Awards</p>
        <h1 className="spotlight-hero-title">Spotlight</h1>
        <div className="spotlight-divider">
          <div className="spotlight-divider-line" />
          <div className="spotlight-divider-diamond" />
          <div className="spotlight-divider-line" />
        </div>
        <p className="spotlight-hero-sub" style={{ marginTop: '16px' }}>
          Behind the scenes and on the runway — moments that define who we are.
        </p>
      </div>

      {/* ── Gallery ── */}
      <div className="spotlight-gallery">
        <div className="spotlight-grid">
          {photos.map(({ src, alt }) => (
            <div key={src} className="spotlight-grid-item">
              <img src={src} alt={alt} />
              <div className="spotlight-grid-item-overlay" />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
