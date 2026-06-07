import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Building2, ExternalLink } from 'lucide-react'

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/lerd.lk',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/lerd.sl',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@lerdlk',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/lerd/',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pin.it/324VFDu',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@lerdinternational',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/94759831831',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-leather-900 text-leather-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <img src="/images/lerd-logo.png" alt="LERD" className="h-10 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="font-serif text-2xl text-leather-100 tracking-widest">LERD</p>
            </div>
            <p className="text-xs tracking-[0.3em] text-yellow-600 uppercase mb-4">Luxurious Leather Crafts</p>
            <p className="text-sm leading-relaxed text-leather-400">
              Handcrafted leather goods made with passion, precision, and pride — born in Sri Lanka.
            </p>

            {/* Social icons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="text-leather-500 hover:text-yellow-400 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-leather-200 mb-5">Shop</h4>
            <ul className="space-y-3">
              {['Wallets', 'Bags', 'Belts', 'Accessories', 'New Arrivals'].map(item => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-leather-400 hover:text-yellow-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-leather-200 mb-5">Company</h4>
            <ul className="space-y-3">
              {[['About', '/about'], ['Products', '/products'],['Spotlight', '/spotlight'], ['Contact', '/contact'], ['Our Story', '/about']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-leather-400 hover:text-yellow-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-leather-200 mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                [Mail,   'info@lerd.lk',  'mailto:info@lerd.lk'],
                [Phone,  '+94 759 831 831',   'tel:+94759831831'],
                [Building2,'Lerd International (Pvt) Ltd', null],
                [MapPin, 'Kandy, Sri Lanka',          null],
              ].map(([Icon, text, href]) => (
                <li key={text} className="flex items-center gap-3 text-sm text-leather-400">
                  <Icon size={15} className="text-yellow-600 flex-shrink-0" />
                  {href
                    ? <a href={href} className="hover:text-yellow-400 transition-colors">{text}</a>
                    : text}
                </li>
              ))}
            </ul>
            {/* Map preview */}
            <div className="relative mt-5 overflow-hidden group" style={{ border: '1px solid rgba(184,134,11,0.25)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1961!2d80.5828236!3d7.1795561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae36f007dd06f73%3A0x7159af6a28252b1f!2sLERD!5e0!3m2!1sen!2slk!4v1748000000000!5m2!1sen!2slk"
                width="100%"
                height="150"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)', display: 'block' }}
                allowFullScreen
                loading="lazy"
                title="LERD Location"
              />
              {/* Clickable overlay — opens full Google Maps */}
              <a
                href="https://maps.app.goo.gl/WKkhzgeNnQcU3HiS9"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-leather-900 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300"
                aria-label="Open in Google Maps"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-yellow-400 font-medium">
                  <ExternalLink size={13} />
                  Open in Maps
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-leather-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-leather-500">© 2026 LERD. All rights reserved.</p>
          <p className="text-xs text-leather-500">Handcrafted with love in Sri Lanka</p>
        </div>
      </div>
    </footer>
  )
}
