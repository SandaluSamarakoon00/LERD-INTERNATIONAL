import '../styles/PrivacyPolicy.css'

const LAST_UPDATED = 'August 9, 2026'

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">

      {/* ── Hero ── */}
      <div className="privacy-hero">
        <p className="privacy-hero-eyebrow">Legal</p>
        <h1 className="privacy-hero-title">Privacy Policy</h1>
        <div className="privacy-divider">
          <div className="privacy-divider-line" />
          <div className="privacy-divider-diamond" />
          <div className="privacy-divider-line" />
        </div>
        <p className="privacy-hero-sub" style={{ marginTop: '20px' }}>
          How LERD International (Pvt) Ltd collects, uses, and protects your information.
        </p>
        <p className="privacy-updated">Last updated: {LAST_UPDATED}</p>
      </div>

      {/* ── Body ── */}
      <div className="privacy-body-wrap">

        <div className="privacy-section">
          <p className="privacy-text">
            This Privacy Policy explains how LERD International (Pvt) Ltd ("LERD", "we", "us", "our")
            collects, uses, discloses, and safeguards your information when you visit lerd.lk, create
            an account, browse our products, or place an order. By using our website, you agree to the
            practices described below.
          </p>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">01</p>
          <h2 className="privacy-section-title">Information We Collect</h2>
          <p className="privacy-text">We collect the following categories of information:</p>
          <ul className="privacy-list">
            <li><strong>Account information</strong> — name, username, email address, and phone number when you register, either directly or via Google Sign-In.</li>
            <li><strong>Order &amp; shipping information</strong> — first and last name, email, phone number(s), delivery address, city, state, postal code, and country, collected at checkout.</li>
            <li><strong>Cart data</strong> — the products, quantities, and prices in your shopping cart, stored in our database while you are signed in, or in your browser's local storage as a guest.</li>
            <li><strong>Payment information</strong> — payments are processed securely by our payment partner, PayHere. We do not collect or store your card number, CVV, or other card details on our servers.</li>
            <li><strong>Communications</strong> — any information you provide when contacting us through the Contact page or by email.</li>
            <li><strong>Usage data</strong> — basic technical information such as browser type and general site interactions, used to keep the site running reliably.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">02</p>
          <h2 className="privacy-section-title">How We Use Your Information</h2>
          <ul className="privacy-list">
            <li>To process and fulfil your orders, including payment confirmation, packaging, and delivery.</li>
            <li>To send transactional emails — order confirmations, invoices, shipping and tracking updates, and delivery follow-ups.</li>
            <li>To create and manage your account, including signing you in and remembering your cart.</li>
            <li>To respond to enquiries submitted through our Contact page.</li>
            <li>To maintain the security of our website and prevent fraudulent transactions.</li>
            <li>To improve our products, services, and overall shopping experience.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">03</p>
          <h2 className="privacy-section-title">How We Share Your Information</h2>
          <p className="privacy-text">
            We do not sell your personal information. We share information only where necessary to
            operate our business:
          </p>
          <ul className="privacy-list">
            <li><strong>PayHere</strong> — to process payments securely for orders you place with us.</li>
            <li><strong>Firebase (Google)</strong> — for account authentication and to securely store account, cart, and order data.</li>
            <li><strong>Cloudinary</strong> — for hosting and delivering product images.</li>
            <li><strong>Delivery &amp; courier partners</strong> — your name, address, and phone number are shared with the courier handling your shipment.</li>
            <li><strong>Legal requirements</strong> — where required to comply with the law or protect our legal rights.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">04</p>
          <h2 className="privacy-section-title">Cookies &amp; Local Storage</h2>
          <p className="privacy-text">
            We use your browser's local storage to remember your shopping cart if you are not signed
            in, so your items are not lost between visits. We may also use cookies for essential site
            functionality and to keep you signed in. You can clear your browser's storage at any time,
            though this may remove items from your guest cart.
          </p>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">05</p>
          <h2 className="privacy-section-title">Data Retention</h2>
          <p className="privacy-text">
            We retain account and order information for as long as your account is active or as needed
            to provide our services, fulfil the purposes described in this policy, and comply with our
            legal and accounting obligations.
          </p>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">06</p>
          <h2 className="privacy-section-title">Your Rights</h2>
          <p className="privacy-text">You may, at any time:</p>
          <ul className="privacy-list">
            <li>Request access to the personal information we hold about you.</li>
            <li>Request that we correct inaccurate or incomplete information.</li>
            <li>Request deletion of your account and associated personal data, subject to any orders we are legally required to retain records of.</li>
            <li>Reset your password or update your profile details at any time while signed in.</li>
          </ul>
          <p className="privacy-text">
            To exercise any of these rights, please contact us using the details below.
          </p>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">07</p>
          <h2 className="privacy-section-title">Data Security</h2>
          <p className="privacy-text">
            We use industry-standard measures to protect your information, including encrypted
            connections (HTTPS), secure authentication, and access-controlled databases. Payments are
            handled entirely by PayHere's PCI-compliant infrastructure — we never see or store your
            full card details.
          </p>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">08</p>
          <h2 className="privacy-section-title">Children's Privacy</h2>
          <p className="privacy-text">
            Our website is not directed at children under 13, and we do not knowingly collect personal
            information from children.
          </p>
        </div>

        <div className="privacy-section">
          <p className="privacy-section-num">09</p>
          <h2 className="privacy-section-title">Changes to This Policy</h2>
          <p className="privacy-text">
            We may update this Privacy Policy from time to time to reflect changes in our practices or
            for legal reasons. The "Last updated" date at the top of this page will reflect the most
            recent revision. We encourage you to review this page periodically.
          </p>
        </div>

        <div className="privacy-section" style={{ marginBottom: 0 }}>
          <p className="privacy-section-num">10</p>
          <h2 className="privacy-section-title">Contact Us</h2>
          <p className="privacy-text">
            If you have any questions about this Privacy Policy or how we handle your data, please
            reach out to us:
          </p>
          <div className="privacy-contact-box">
            <p><strong>LERD International (Pvt) Ltd</strong></p>
            <p>Email: <a href="mailto:info@lerd.lk">info@lerd.lk</a></p>
            <p>Phone: <a href="tel:+94759831831">+94 759 831 831</a></p>
            <p>Address: Kandy, Sri Lanka</p>
          </div>
        </div>

      </div>
    </div>
  )
}
