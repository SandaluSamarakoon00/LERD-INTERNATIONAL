import { Link } from 'react-router-dom'
import '../styles/Novara.css'

const whyChoose = [
  {
    title: 'Premium Materials',
    desc: 'Hospitality-grade synthetic leather engineered for durability and elegance.',
  },
  {
    title: 'Custom Manufacturing',
    desc: 'Tailored solutions to match your brand identity and interior design.',
  },
  {
    title: 'Professional Craftsmanship',
    desc: 'Precision finishing and attention to every detail.',
  },
  {
    title: 'Hospitality Expertise',
    desc: 'Designed specifically for hotels, resorts, restaurants, and premium commercial spaces.',
  },
  {
    title: 'Sustainable Alternative',
    desc: 'Luxury aesthetics without compromising environmental responsibility.',
  },
]

const coreValues = [
  { title: 'Excellence',    desc: 'We pursue perfection in every detail.'                               },
  { title: 'Innovation',    desc: 'We continuously improve materials, design, and functionality.'        },
  { title: 'Partnership',   desc: 'We work closely with our clients to bring their vision to life.'      },
  { title: 'Sustainability',desc: 'We promote responsible materials and long-lasting products.'          },
]

const products = [
  { name: 'Menu Covers',               desc: 'Custom-designed menu covers for restaurants, cafés, bars, and hotels.' },
  { name: 'Bill Presenters',           desc: 'Elegant bill folders designed to complement premium dining experiences.' },
  { name: 'Coasters',                  desc: 'Durable and stylish coasters customised with your branding.' },
  { name: 'Tissue Box Covers',         desc: 'Luxury tissue box covers suitable for guest rooms, lounges, and reception areas.' },
  { name: 'Door Hangers',              desc: 'Professional room service and privacy signage solutions.' },
  { name: 'Room Folders',              desc: 'Guest information folders, directory folders, and welcome folders.' },
  { name: 'Vanity Trays',              desc: 'Premium trays designed for hotel rooms, villas, and luxury accommodations.' },
  { name: 'Notepads & Desk Accessories', desc: 'Functional accessories for guest rooms, meeting rooms, and executive offices.' },
  { name: 'Corporate Gift Solutions',  desc: 'Customised premium accessories for corporate gifting and events.' },
]

const customizationOptions = [
  'Logo Embossing',
  'Foil Stamping',
  'UV Printing',
  'Custom Colours',
  'Custom Sizes',
  'Material Selection',
  'Stitching Options',
  'Metal Branding Elements',
  'Packaging Customization',
]

const materialFeatures = [
  'Water Resistant',
  'Easy to Clean',
  'Long Lasting',
  'Scratch Resistant',
  'Hospitality Grade',
  'Luxury Finish',
  'Sustainable Alternative',
]

const industries = [
  {
    title: 'Hotels & Resorts',
    desc: 'Guest room accessories, reception products, restaurant accessories, and spa essentials.',
  },
  {
    title: 'Restaurants & Cafés',
    desc: 'Menu covers, bill presenters, table accessories, and branding solutions.',
  },
  {
    title: 'Villas & Boutique Properties',
    desc: 'Luxury accessories designed to enhance guest experiences.',
  },
  {
    title: 'Corporate Offices',
    desc: 'Executive desk accessories, meeting room products, and premium gifting.',
  },
  {
    title: 'Wellness & Spa Facilities',
    desc: 'Elegant trays, guest accessories, and customised branding solutions.',
  },
]

export default function Novara() {
  return (
    <div className="novara-page">

      {/* ── Hero ── */}
      <div className="novara-hero">
        <p className="novara-hero-eyebrow">Premium Hospitality Accessories</p>
        <h1 className="novara-hero-title">
          Crafted for<br />
          <span className="novara-heading-italic">Elegant Spaces</span>
        </h1>
        <div className="novara-divider">
          <div className="novara-divider-line" />
          <div className="novara-divider-diamond" />
          <div className="novara-divider-line" />
        </div>
        <p className="novara-hero-sub">
          Premium hospitality accessories and custom interior essentials designed to elevate
          guest experiences through exceptional craftsmanship, sophisticated design, and
          durable performance materials.
        </p>
        <div className="novara-hero-cta-group">
          <Link to="/contact" className="novara-hero-cta">
            Get in Touch
          </Link>
          <a
            href="/docs/novara-catalogue.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="novara-hero-cta-outline"
          >
            View Catalogue
          </a>
        </div>
      </div>

      {/* ── About NOVARA ── */}
      <section className="novara-section">
        <div className="novara-about-grid">
          <div>
            <p className="novara-eyebrow">About NOVARA</p>
            <h2 className="novara-heading" style={{ marginBottom: '24px' }}>
              Where Detail Defines<br />
              <span className="novara-heading-italic">the Experience</span>
            </h2>
            <p className="novara-body">
              NOVARA is a premium hospitality accessories brand specialising in luxury synthetic
              leather and customised interior solutions. We create refined products for hotels,
              resorts, villas, restaurants, spas, offices, and corporate environments where
              attention to detail matters.
            </p>
            <p className="novara-body" style={{ marginBottom: 0 }}>
              Every NOVARA product is designed to combine elegance, durability, and functionality,
              helping businesses create memorable experiences for their guests and customers.
            </p>
          </div>

          <div>
            <p className="novara-eyebrow" style={{ marginBottom: '24px' }}>Why Choose NOVARA</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {whyChoose.map(({ title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '6px', height: '6px', background: '#B8860B',
                    borderRadius: '50%', flexShrink: 0, marginTop: '6px',
                  }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A0F08', marginBottom: '3px' }}>{title}</p>
                    <p style={{ fontSize: '16px', color: '#7A5230', lineHeight: '1.6' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <div className="novara-section-alt">
        <div className="novara-section-inner">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="novara-eyebrow">Our Story</p>
            <h2 className="novara-heading">At NOVARA, we believe the smallest<br />details create the greatest impressions.</h2>
          </div>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p className="novara-body">
              Born from a passion for hospitality and refined craftsmanship, NOVARA was established to
              provide premium accessories that enhance the guest experience. We specialise in creating
              elegant hospitality products using high-quality synthetic leather and modern manufacturing techniques.
            </p>
            <p className="novara-body">
              From luxury resorts and boutique hotels to restaurants, corporate offices, and wellness
              spaces, our products are designed to seamlessly blend functionality with sophisticated aesthetics.
            </p>
            <p className="novara-body" style={{ marginBottom: 0 }}>
              Through customisation, innovation, and exceptional service, NOVARA helps brands transform
              everyday essentials into memorable experiences.
            </p>
          </div>
        </div>
      </div>

      {/* ── Vision & Mission ── */}
      <section className="novara-section">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="novara-eyebrow">What Drives Us</p>
          <h2 className="novara-heading">Vision &amp; Mission</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="novara-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div className="novara-card-bar" />
              <p className="novara-card-eyebrow">Our Vision</p>
            </div>
            <p className="novara-card-title">
              To become South Asia's leading hospitality accessories brand, recognised for
              exceptional craftsmanship, innovative design, and premium guest experience solutions.
            </p>
          </div>
          <div className="novara-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div className="novara-card-bar" />
              <p className="novara-card-eyebrow">Our Mission</p>
            </div>
            <p className="novara-card-title">
              To create elegant hospitality products that elevate commercial spaces through superior
              quality, customisation, and thoughtful design.
            </p>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <div className="novara-section-alt">
        <div className="novara-section-inner" style={{ textAlign: 'center' }}>
          <p className="novara-eyebrow">What We Stand For</p>
          <h2 className="novara-heading" style={{ marginBottom: '48px' }}>Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {coreValues.map(({ title, desc }) => (
              <div key={title}>
                <div className="novara-value-diamond" />
                <p className="novara-value-title">{title}</p>
                <p className="novara-value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <section className="novara-section">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <p className="novara-eyebrow">What We Make</p>
          <h2 className="novara-heading">Hospitality Accessories</h2>
        </div>
        <div className="novara-products-grid">
          {products.map(({ name, desc }) => (
            <div key={name} className="novara-product-item">
              <div className="novara-product-dot" />
              <p className="novara-product-name">{name}</p>
              <p className="novara-product-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Customization ── */}
      <div className="novara-section-alt">
        <div className="novara-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <p className="novara-eyebrow">Tailored to Your Brand</p>
              <h2 className="novara-heading" style={{ marginBottom: '16px' }}>Every property has its own identity.</h2>
              <p className="novara-body" style={{ maxWidth: '600px', margin: '0 auto 8px', textAlign: 'center' }}>
                NOVARA offers fully customised hospitality products designed to reflect your brand,
                interior theme, and guest experience objectives.
              </p>
            </div>
          </div>
          <ul className="novara-checklist">
            {customizationOptions.map(opt => (
              <li key={opt}>
                <span className="novara-check-icon">✓</span>
                {opt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Materials ── */}
      <section className="novara-section">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <p className="novara-eyebrow">Built to Perform</p>
          <h2 className="novara-heading" style={{ marginBottom: '16px' }}>Premium Hospitality Materials</h2>
          <p className="novara-body" style={{ maxWidth: '620px', margin: '0 auto 0', textAlign: 'center' }}>
            NOVARA uses carefully selected hospitality-grade synthetic leather materials engineered
            for durability, aesthetics, and performance.
          </p>
        </div>
        <ul className="novara-materials-list">
          {materialFeatures.map(feat => (
            <li key={feat}>
              <span className="novara-bullet" />
              {feat}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Industries ── */}
      <div className="novara-section-alt">
        <div className="novara-section-inner">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <p className="novara-eyebrow">Who We Serve</p>
            <h2 className="novara-heading">Industries We Serve</h2>
          </div>
          <div className="novara-industries-grid">
            {industries.map(({ title, desc }) => (
              <div key={title} className="novara-industry-card">
                <p className="novara-industry-title">{title}</p>
                <p className="novara-industry-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects ── */}
      <section className="novara-section" style={{ textAlign: 'center' }}>
        <p className="novara-eyebrow">Our Work</p>
        <h2 className="novara-heading" style={{ marginBottom: '24px' }}>Trusted by Leading Hospitality Brands</h2>
        <div className="novara-divider" style={{ margin: '0 auto 32px' }}>
          <div className="novara-divider-line" />
          <div className="novara-divider-diamond" />
          <div className="novara-divider-line" />
        </div>
        <p className="novara-body" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          From boutique hotels and fine-dining restaurants to luxury resorts and corporate offices —
          NOVARA products are trusted across South Asia's leading hospitality spaces.
          Our portfolio includes hotel projects, restaurant installations, and corporate branding solutions.
        </p>
      </section>

      {/* ── CTA ── */}
      <div className="novara-cta">
        <p className="novara-cta-eyebrow">Ready to Elevate Your Space?</p>
        <h2 className="novara-cta-title">Let's Create Something<br /><em>Extraordinary</em></h2>
        <p className="novara-cta-sub">
          Get in touch with our team to discuss your customisation needs and bring your
          hospitality vision to life.
        </p>
        <div className="novara-cta-btn-group">
          <Link to="/contact" className="novara-cta-btn">
            Contact Us
          </Link>
          <a
            href="/docs/novara-catalogue.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="novara-cta-btn-outline"
          >
            View Catalogue
          </a>
        </div>
      </div>

    </div>
  )
}
