import PDFDocument          from 'pdfkit'
import path                from 'path'
import { fileURLToPath }   from 'url'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH  = path.join(__dirname, '../../../client/public/images/lerd-logo.png')

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-LK', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatAddress(c) {
  return [c.address1, c.address2, c.city, c.state, c.postalCode, c.country]
    .filter(Boolean).join(', ')
}

export function generateInvoicePDF(order) {
  return new Promise((resolve, reject) => {
    const { orderId, items, customer, amount, createdAt } = order
    const doc    = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks = []

    doc.on('data',  chunk => chunks.push(chunk))
    doc.on('end',   ()    => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const name  = `${customer.firstName} ${customer.lastName}`
    const COL_W = 495   // 595 page width − 50 left − 50 right

    // ── Dark header band ─────────────────────────────────────────────────────
    doc.rect(0, 0, 595, 88).fill('#1A0F08')

    // Logo — cream background badge so it shows clearly on dark header
    doc.rect(44, 12, 64, 64).fill('#FAF6F0')
    try {
      doc.image(LOGO_PATH, 48, 16, { fit: [56, 56], align: 'center', valign: 'center' })
    } catch (_) {
      // logo not found — fall back to text only
    }

    // Brand name — Times-Bold, gold
    doc.font('Times-Bold').fontSize(26).fillColor('#B8860B')
       .text('LERD', 118, 18)

    // Tagline — Times-Italic
    doc.font('Times-Italic').fontSize(8.5).fillColor('#A07850')
       .text('Luxurious Leather Crafts', 118, 48)

    // Contact line
    doc.font('Helvetica').fontSize(7.5).fillColor('#7A5C3A')
       .text('info@lerd.lk  ·  +94 759 831 831  ·  Kandy, Sri Lanka', 118, 62)

    // INVOICE label — right side
    doc.font('Times-Bold').fontSize(22).fillColor('#FFFFFF')
       .text('INVOICE', 50, 18, { align: 'right', width: COL_W })
    doc.font('Helvetica').fontSize(8.5).fillColor('#A07850')
       .text(`#${orderId}`, 50, 48, { align: 'right', width: COL_W })

    // Gold separator line
    doc.rect(0, 88, 595, 2.5).fill('#B8860B')

    // ── Order details + Bill To ───────────────────────────────────────────────
    let y = 108

    // Left — order meta
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#B8860B')
       .text('ORDER DETAILS', 50, y)
    y += 14

    ;[
      ['Order Number',    `#${orderId}`],
      ['Order Date',      formatDate(createdAt)],
      ['Payment Status',  'Paid'],
    ].forEach(([label, value]) => {
      doc.font('Helvetica').fontSize(9).fillColor('#7A5C3A').text(label, 50, y)
      doc.font('Helvetica').fontSize(9).fillColor('#1A0F08').text(value, 185, y)
      y += 14
    })

    // Right — bill to
    let ry = 108
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#B8860B')
       .text('BILL TO', 320, ry)
    ry += 14
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#1A0F08').text(name, 320, ry)
    ry += 13
    doc.font('Helvetica').fontSize(9).fillColor('#5C3D2E')
    doc.text(customer.email, 320, ry)
    ry += 13
    doc.text(customer.phone, 320, ry)
    if (customer.phone2) { ry += 13; doc.text(customer.phone2, 320, ry) }
    ry += 13
    doc.text(formatAddress(customer), 320, ry, { width: 225 })

    // ── Items table ───────────────────────────────────────────────────────────
    y = Math.max(y, ry) + 22

    // Table header
    doc.rect(50, y, COL_W, 26).fill('#1A0F08')
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#B8860B')
    doc.text('ITEM',          60,  y + 9)
    doc.text('QTY',          355,  y + 9, { width: 45,  align: 'center' })
    doc.text('UNIT PRICE',   400,  y + 9, { width: 70,  align: 'right'  })
    doc.text('TOTAL',        470,  y + 9, { width: 70,  align: 'right'  })
    y += 26

    items.forEach((item, i) => {
      const bg = i % 2 === 0 ? '#FFFFFF' : '#FAF6F0'
      doc.rect(50, y, COL_W, 26).fill(bg)
      doc.font('Helvetica').fontSize(9).fillColor('#1A0F08')
      doc.text(item.name,                                                           60,  y + 8, { width: 290 })
      doc.text(String(item.quantity),                                              355,  y + 8, { width: 45,  align: 'center' })
      doc.text(`Rs. ${Number(item.price).toLocaleString()}`,                       400,  y + 8, { width: 70,  align: 'right'  })
      doc.text(`Rs. ${(Number(item.price) * item.quantity).toLocaleString()}`,     470,  y + 8, { width: 70,  align: 'right'  })
      y += 26
    })

    // Shipping row
    doc.rect(50, y, COL_W, 24).fill('#FAF6F0')
    doc.font('Helvetica').fontSize(9).fillColor('#7A5C3A').text('Shipping', 60, y + 7)
    doc.font('Helvetica-Bold').fillColor('#22C55E')
       .text('Free', 470, y + 7, { width: 70, align: 'right' })
    y += 24

    // Total row
    doc.rect(50, y, COL_W, 30).fill('#1A0F08')
    doc.font('Times-Bold').fontSize(11).fillColor('#B8860B')
       .text('TOTAL AMOUNT PAID', 60, y + 9)
       .text(`Rs. ${Number(amount).toLocaleString()}`, 400, y + 9, { width: 140, align: 'right' })
    y += 30

    // ── Thank you note ────────────────────────────────────────────────────────
    y += 20
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#B8860B').lineWidth(0.6).stroke()
    y += 14

    doc.font('Times-Italic').fontSize(10).fillColor('#5C3D2E')
       .text(
         'Thank you for choosing LERD. Every piece we craft is made with passion, precision, and pride.',
         50, y, { align: 'center', width: COL_W }
       )

    // ── Footer band ───────────────────────────────────────────────────────────
    doc.rect(0, 782, 595, 60).fill('#1A0F08')

    doc.font('Times-Bold').fontSize(9).fillColor('#B8860B')
       .text('Luxurious  ·  Excellence  ·  Reliable  ·  Durable', 50, 796, { align: 'center', width: COL_W })

    doc.font('Helvetica').fontSize(7.5).fillColor('#7A5C3A')
       .text('© 2026 LERD International (Pvt) Ltd. All rights reserved.', 50, 812, { align: 'center', width: COL_W })

    doc.end()
  })
}
