import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import '../styles/PaymentReturn.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-LK', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatAddress(c) {
  return [c.address1, c.address2, c.city, c.state, c.postalCode, c.country]
    .filter(Boolean).join(', ')
}

async function generateInvoicePDF(order) {
  const doc  = new jsPDF({ unit: 'mm', format: 'a4' })
  const { orderId, items, customer, amount, createdAt } = order
  const name = `${customer.firstName} ${customer.lastName}`

  // ── Load logo as base64 ────────────────────────────────────────────────────
  let logoDataUrl = null
  try {
    const res    = await fetch('/images/lerd-logo.png')
    const blob   = await res.blob()
    logoDataUrl  = await new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch (_) { /* logo unavailable — text only */ }

  // ── Dark header band ───────────────────────────────────────────────────────
  doc.setFillColor(26, 15, 8)
  doc.rect(0, 0, 210, 31, 'F')

  // Gold separator
  doc.setDrawColor(184, 134, 11)
  doc.setLineWidth(0.8)
  doc.line(0, 31, 210, 31)

  // Logo — cream badge so logo shows on dark bg
  doc.setFillColor(250, 246, 240)
  doc.rect(10, 4, 22, 23, 'F')
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 11, 5, 20, 20)
  }

  // LERD — Times-Bold, gold
  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(184, 134, 11)
  doc.text('LERD', 36, 15)

  // Tagline — Times-Italic
  doc.setFont('times', 'italic')
  doc.setFontSize(7.5)
  doc.setTextColor(160, 120, 80)
  doc.text('Luxurious Leather Crafts', 36, 22)

  // Contact
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(120, 90, 60)
  doc.text('info@lerd.lk  ·  +94 759 831 831  ·  Kandy, Sri Lanka', 36, 28)

  // INVOICE label — right
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text('INVOICE', 196, 14, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(160, 120, 80)
  doc.text(`#${orderId}`, 196, 22, { align: 'right' })

  // ── Order details + Bill To ────────────────────────────────────────────────
  let y = 42

  // Left
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(184, 134, 11)
  doc.text('ORDER DETAILS', 14, y)
  y += 6

  ;[
    ['Order Number',   `#${orderId}`],
    ['Order Date',     formatDate(createdAt)],
    ['Status',         'Paid'],
  ].forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(120, 90, 60)
    doc.text(label, 14, y)
    doc.setTextColor(26, 15, 8)
    doc.text(value, 60, y)
    y += 6
  })

  // Right
  let ry = 42
  doc.setFont('helvetica', 'bold').setFontSize(7).setTextColor(184, 134, 11)
  doc.text('BILL TO', 115, ry)
  ry += 6

  doc.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(26, 15, 8)
  doc.text(name, 115, ry); ry += 6
  doc.setFont('helvetica', 'normal').setTextColor(92, 61, 46)
  doc.text(customer.email, 115, ry); ry += 6
  doc.text(customer.phone, 115, ry); ry += 6
  if (customer.phone2) { doc.text(customer.phone2, 115, ry); ry += 6 }
  const addrLines = doc.splitTextToSize(formatAddress(customer), 80)
  doc.text(addrLines, 115, ry)

  // ── Items table ────────────────────────────────────────────────────────────
  const tableY = Math.max(y, ry) + 6

  autoTable(doc, {
    startY: tableY,
    head:   [['Item Description', 'Qty', 'Unit Price (Rs.)', 'Total (Rs.)']],
    body:   items.map(item => [
      item.name,
      item.quantity,
      Number(item.price).toLocaleString(),
      (Number(item.price) * item.quantity).toLocaleString(),
    ]),
    foot: [
      ['', '', 'Shipping', 'Free'],
      ['', '', 'Total Amount Paid', `Rs. ${Number(amount).toLocaleString()}`],
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica', fontSize: 8.5,
      cellPadding: 4, textColor: [26, 15, 8],
    },
    headStyles: {
      fillColor: [26, 15, 8], textColor: [184, 134, 11],
      fontStyle: 'bold', fontSize: 7.5,
    },
    footStyles: {
      fillColor: [26, 15, 8], textColor: [184, 134, 11], fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [250, 246, 240] },
    columnStyles: {
      0: { cellWidth: 88 },
      1: { cellWidth: 16, halign: 'center' },
      2: { cellWidth: 44, halign: 'right'  },
      3: { cellWidth: 42, halign: 'right'  },
    },
    didParseCell: (data) => {
      if (data.section === 'foot' && data.row.index === 0) {
        // Shipping row — cream background, normal text
        data.cell.styles.fillColor  = [250, 246, 240]
        data.cell.styles.textColor  = [92, 61, 46]
        data.cell.styles.fontStyle  = 'normal'
        data.cell.styles.fontSize   = 8.5
      }
      if (data.section === 'foot' && data.row.index === 1) {
        // Total row — dark background, gold Times-Bold
        data.cell.styles.fillColor  = [26, 15, 8]
        data.cell.styles.textColor  = [184, 134, 11]
        data.cell.styles.fontStyle  = 'bold'
        data.cell.styles.font       = 'times'
        data.cell.styles.fontSize   = 10
      }
    },
  })

  // ── Thank you note ─────────────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 10
  doc.setDrawColor(184, 134, 11).setLineWidth(0.4)
  doc.line(14, finalY, 196, finalY)

  doc.setFont('times', 'italic').setFontSize(9).setTextColor(92, 61, 46)
  doc.text(
    'Thank you for choosing LERD. Every piece we craft is made with passion, precision, and pride.',
    105, finalY + 7, { align: 'center' }
  )

  // ── Footer band ────────────────────────────────────────────────────────────
  doc.setFillColor(26, 15, 8)
  doc.rect(0, 280, 210, 17, 'F')

  doc.setFont('times', 'bold').setFontSize(8).setTextColor(184, 134, 11)
  doc.text('Luxurious  ·  Excellence  ·  Reliable  ·  Durable', 105, 287, { align: 'center' })

  doc.setFont('helvetica', 'normal').setFontSize(7).setTextColor(120, 90, 60)
  doc.text('© 2026 LERD International (Pvt) Ltd. All rights reserved.', 105, 293, { align: 'center' })

  doc.save(`LERD-Invoice-${orderId}.pdf`)
}

export default function PaymentReturn() {
  const [params]   = useSearchParams()
  const urlOrderId = params.get('order_id')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('lerd_order')
    if (saved) {
      setOrder(JSON.parse(saved))
      sessionStorage.removeItem('lerd_order')
    }
  }, [])

  const orderId = order?.orderId || urlOrderId

  return (
    <div className="pr-page">
      <div className="pr-grid">

        {/* ── LEFT: Success message ── */}
        <div className="pr-success-card">

          <div className="pr-icon">
            <CheckCircle size={32} style={{ color: '#4ade80' }} />
          </div>

          <h1 className="pr-title">Payment Successful</h1>

          <p className="pr-subtitle">
            Thank you for your order. We've received your payment and will begin preparing your handcrafted item.
          </p>

          <div className="pr-divider">
            <div className="pr-divider-line" />
            <div className="pr-divider-diamond" />
            <div className="pr-divider-line" />
          </div>

          {orderId && (
            <div className="pr-order-id-box">
              <p className="pr-order-id-label">Order ID</p>
              <p className="pr-order-id-value">{orderId}</p>
            </div>
          )}

          <p className="pr-email-note">
            A confirmation email has been sent to{' '}
            <span>{order?.customer?.email || 'your email'}</span>.<br />
            Expect delivery within 5–7 business days.
          </p>
        </div>

        {/* ── RIGHT: Summary + buttons ── */}
        <div className="pr-right">

          {/* Order summary */}
          <div className="pr-summary-card">
            <p className="pr-summary-title">Order Summary</p>

            {order ? (
              <>
                {order.items.map((item, i) => (
                  <div key={i} className="pr-item">
                    <div>
                      <p className="pr-item-name">{item.name}</p>
                      <p className="pr-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="pr-item-price">
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                <div className="pr-totals">
                  <div className="pr-shipping-row">
                    <span className="pr-shipping-label">Shipping</span>
                    <span className="pr-shipping-value">Free</span>
                  </div>
                  <div className="pr-total-row">
                    <span className="pr-total-label">Total Paid</span>
                    <span className="pr-total-value">
                      Rs. {Number(order.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="pr-no-data">
                Order details unavailable. Check your email for the full summary.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="pr-buttons">
            {order && (
              <button
                className="pr-btn-invoice"
                onClick={() => generateInvoicePDF(order).catch(console.error)}
              >
                <Download size={15} />
                Download Invoice PDF
              </button>
            )}

            <Link to="/products" className="pr-btn-primary">
              Continue Shopping
            </Link>

            <Link to="/" className="pr-btn-secondary">
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
