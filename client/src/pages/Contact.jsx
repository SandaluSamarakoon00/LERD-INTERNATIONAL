import '../styles/Contact.css'

const socialLinks = [
  {
    label: 'Instagram',
    color: '#E1306C',
    href: 'https://www.instagram.com/lerd.lk',
    icon: (color) => (
      <svg className="contact-social-icon" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill={color}/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    color: '#1877F2',
    href: 'https://www.facebook.com/lerd.sl',
    icon: (color) => (
      <svg className="contact-social-icon" fill={color} viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    color: '#010101',
    href: 'https://www.tiktok.com/@lerdlk',
    icon: (color) => (
      <svg className="contact-social-icon" fill={color} viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    color: '#0A66C2',
    href: 'https://www.linkedin.com/company/lerd/',
    icon: (color) => (
      <svg className="contact-social-icon" fill={color} viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    color: '#E60023',
    href: 'https://pin.it/324VFDu',
    icon: (color) => (
      <svg className="contact-social-icon" fill={color} viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    color: '#FF0000',
    href: 'https://youtube.com/@lerdinternational',
    icon: (color) => (
      <svg className="contact-social-icon" fill={color} viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

export default function Contact() {
  return (
    <div className="contact-page">

      {/* ── Hero ── */}
      <div className="contact-hero">
        <p className="contact-hero-eyebrow">Get In Touch</p>
        <h1 className="contact-hero-title">Contact Us</h1>
        <div className="contact-divider">
          <div className="contact-divider-line" />
          <div className="contact-divider-diamond" />
          <div className="contact-divider-line" />
        </div>
        <p className="contact-hero-sub" style={{ marginTop: '16px' }}>
          We'd love to hear from you. Reach out and we'll get back to you shortly.
        </p>
      </div>

      {/* ── Main ── */}
      <div className="contact-main">

        {/* Form */}
        <div>
          <span className="contact-form-label">Send us a message</span>
          <form action="https://formsubmit.co/info@lerd.lk" method="POST">
            <input type="hidden" name="_subject" value="New message from LERD website" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

            <div className="contact-row">
              <input
                className="contact-input"
                type="text"
                name="name"
                placeholder="Your Name"
                required
              />
              <input
                className="contact-input"
                type="email"
                name="email"
                placeholder="Your Email"
                required
              />
            </div>

            <textarea
              className="contact-textarea"
              name="message"
              placeholder="Your Message"
              required
            />

            <button className="contact-btn" type="submit">
              Send Message
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="contact-sidebar">

          <div className="contact-info-block">
            <p className="contact-info-eyebrow">Email</p>
            <a className="contact-info-value" href="mailto:info@lerd.lk">
              info@lerd.lk
            </a>
          </div>

          <div className="contact-info-block">
            <p className="contact-info-eyebrow">Phone</p>
            <a className="contact-info-value" href="tel:+94759831831">
              +94 759 831 831
            </a>
            <a
              href="https://wa.me/94759831831"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#25D366',
                textDecoration: 'none',
                fontFamily: 'Josefin Sans, sans-serif',
              }}
            >
              <svg width="18" height="18" fill="#25D366" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-social-block">
            <p className="contact-info-eyebrow">Follow Us</p>
            <div className="contact-social-grid">
              {socialLinks.map(({ label, href, icon, color }) => (
                <a
                  key={label}
                  className="contact-social-link"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; e.currentTarget.style.background = `${color}10` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.background = '' }}
                >
                  {icon(color)}
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}