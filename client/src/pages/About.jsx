import '../styles/About.css'

export default function About() {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <div className="about-hero">
        <p className="about-hero-eyebrow">Est. 2022 · Sri Lanka</p>
        <h1 className="about-hero-title">Our Story</h1>
        <div className="about-divider">
          <div className="about-divider-line" />
          <div className="about-divider-diamond" />
          <div className="about-divider-line" />
        </div>
        <p className="about-hero-sub">
          Two brothers. One vision. A passion for leather that became a legacy.
        </p>
      </div>

      {/* ── Brand Story ── */}
      <section className="about-section" style={{ maxWidth: '720px' }}>
        <p className="about-eyebrow">The Beginning</p>
        <h2 className="about-heading mb-6">
          Where Leather<br />
          <span className="about-heading-italic">Tells a Story</span>
        </h2>
        <p className="about-body">
          At LERD, we believe in crafting more than just leather products; we craft stories of sustainability and style. Our journey begins with locally sourced raw materials, supporting our community and reducing carbon footprints. We take pride in using only real leather, ensuring authenticity and durability without compromising on ethical standards. Every piece we create is meticulously handmade, embodying the artistry and dedication of our craftsmen.
        </p>
        <p className="about-body">
          Our commitment to sustainability extends to our packaging, which is eco-friendly and designed to minimize environmental impact. We are proud to say that no animals are harmed in our production process; the leather we use is a by-product of the meat industry, promoting ethical practices and waste reduction.
        </p>
        <p className="about-body" style={{ marginBottom: 0 }}>
          LERD isn't just a brand; it's a symbol of responsible luxury, where each product tells a story of craftsmanship, ethics, and environmental consciousness. Join us in shaping a better world, one leather creation at a time.
        </p>
      </section>

      {/* ── Vision & Mission ── */}
      <div className="about-section-alt">
        <div className="about-section-inner">
          <div className="text-center mb-14">
            <p className="about-eyebrow">What Drives Us</p>
            <h2 className="about-heading">Vision &amp; Mission</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="about-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div className="about-card-bar" />
                <p className="about-card-eyebrow">Our Vision</p>
              </div>
              <p className="about-card-title">
                "To Elevate Style by Inspiring Elegance"
              </p>
            </div>
            <div className="about-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div className="about-card-bar" />
                <p className="about-card-eyebrow">Our Mission</p>
              </div>
              <p className="about-card-title" style={{ marginBottom: '12px' }}>
                “Our mission is to create exceptional fashion experiences that elevate personal
                 style and inspire individuals to embrace elegance. Through meticulous
                 craftsmanship, timeless designs, and a commitment to quality, we strive to
                 empower our customers to express their unique identities with confidence and
                 grace. We are dedicated to providing unparalleled customer service, fostering a
                 culture of creativity & innovation, and shaping the future of fashion with our
                 unwavering passion for elevating style and inspiring elegance."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Founders ── */}
      <section className="about-section">
        <div className="text-center mb-14">
          <p className="about-eyebrow">The People Behind LERD</p>
          <h2 className="about-heading">Meet the Founders</h2>
          <div className="about-divider" style={{ marginTop: '20px', marginBottom: 0 }}>
            <div className="about-divider-line" />
            <div className="about-divider-diamond" />
            <div className="about-divider-line" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="text-center">
            <div className="about-founder-frame">
              <img src="/images/founder-chamika.jpg" alt="Chamika De Silva" />
              <div className="about-founder-frame-overlay" />
            </div>
            <p className="about-founder-name">Chamika De Silva</p>
            <div className="about-founder-bio">
              <p style={{ fontWeight: '600', marginBottom: '2px' }}>Masters in Entrepreneurship</p>
              <p style={{ marginBottom: '12px' }}>University of Sri Jayewardenepura</p>
            </div>
          </div>
          <div className="text-center">
            <div className="about-founder-frame">
              <img src="/images/founder-navodh.jpg" alt="Navodh De Silva" />
              <div className="about-founder-frame-overlay" />
            </div>
            <p className="about-founder-name">Navodh De Silva</p>
            <div className="about-founder-bio">
              <p style={{ fontWeight: '600', marginBottom: '2px' }}>Bachelors of Fashion Design &amp; Product Development</p>
              <p>Open University of Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <div className="about-section-alt" style={{ borderBottom: 'none' }}>
        <div className="about-section-inner text-center">
          <p className="about-eyebrow">What We Stand For</p>
          <h2 className="about-heading mb-12">Our Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: 'Craftsmanship', desc: 'Every stitch placed with care and precision' },
              { title: 'Integrity',     desc: 'Honest materials, honest pricing, always'   },
              { title: 'Durability',    desc: 'Built to outlast trends and time itself'    },
              { title: 'Heritage',      desc: 'Rooted in Sri Lankan pride and tradition'   },
            ].map(({ title, desc }) => (
              <div key={title}>
                <div className="about-value-diamond" />
                <p className="about-value-title">{title}</p>
                <p className="about-value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}