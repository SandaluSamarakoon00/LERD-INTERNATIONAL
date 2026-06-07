import nodemailer from 'nodemailer'
import { generateInvoicePDF } from './pdf.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

function formatAddress(customer) {
  return [
    customer.address1,
    customer.address2,
    customer.city,
    customer.state,
    customer.postalCode,
    customer.country,
  ].filter(Boolean).join(', ')
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function buildEmailHTML({ orderId, customer, items, amount, createdAt }) {
  const name    = `${customer.firstName} ${customer.lastName}`
  const address = formatAddress(customer)
  const date    = formatDate(createdAt)

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #E8D9C5;color:#1A0F08;font-size:14px;">
        ${item.name}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #E8D9C5;text-align:center;color:#5C3D2E;font-size:14px;">
        ${item.quantity}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #E8D9C5;text-align:right;color:#5C3D2E;font-size:14px;">
        Rs. ${(Number(item.price) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Order Confirmation — LERD</title>
</head>
<body style="margin:0;padding:0;background:#F5ECD7;font-family:Georgia,serif;">
  <div style="max-width:620px;margin:40px auto;background:#ffffff;border:1px solid #E8D9C5;border-radius:8px;overflow:hidden;">

    <!-- Header -->
    <div style="background:#1A0F08;padding:36px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:28px;letter-spacing:0.35em;color:#B8860B;font-family:Georgia,serif;font-weight:bold;">
        LERD
      </p>
      <p style="margin:0;font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;">
        Luxurious Leather Crafts
      </p>
    </div>

    <!-- Gold bar -->
    <div style="background:linear-gradient(90deg,#8B6914,#B8860B,#8B6914);height:3px;"></div>

    <!-- Body -->
    <div style="padding:40px;">

      <p style="font-size:15px;color:#1A0F08;margin:0 0 8px;">Dear ${name},</p>

      <p style="font-size:14px;color:#5C3D2E;line-height:1.7;margin:0 0 28px;">
        Thank you for choosing LERD. We are thrilled to let you know that your order has been
        successfully placed and is now being processed by our team.
      </p>

      <!-- Order meta -->
      <div style="background:#FAF6F0;border:1px solid #E8D9C5;border-radius:6px;padding:24px;margin-bottom:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;width:40%;">Order Number</td>
            <td style="padding:6px 0;font-size:14px;color:#1A0F08;font-weight:bold;">#${orderId}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;">Order Date</td>
            <td style="padding:6px 0;font-size:14px;color:#1A0F08;">${date}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;vertical-align:top;">Shipping Address</td>
            <td style="padding:6px 0;font-size:14px;color:#1A0F08;">${address}</td>
          </tr>
        </table>
      </div>

      <!-- Order summary heading -->
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;margin:0 0 12px;">
        Order Summary
      </p>

      <!-- Items table -->
      <table style="width:100%;border-collapse:collapse;border:1px solid #E8D9C5;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:#1A0F08;">
            <th style="padding:12px 16px;text-align:left;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;font-weight:normal;">
              Item
            </th>
            <th style="padding:12px 16px;text-align:center;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;font-weight:normal;">
              Qty
            </th>
            <th style="padding:12px 16px;text-align:right;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;font-weight:normal;">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#FAF6F0;">
            <td colspan="2" style="padding:14px 16px;font-size:13px;font-weight:bold;color:#1A0F08;letter-spacing:0.05em;">
              Total Amount Paid
            </td>
            <td style="padding:14px 16px;text-align:right;font-size:16px;font-weight:bold;color:#B8860B;">
              Rs. ${Number(amount).toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- What's next -->
      <div style="margin:28px 0;padding:20px 24px;border-left:3px solid #B8860B;background:#FAF6F0;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;">
          What happens next?
        </p>
        <p style="margin:0;font-size:14px;color:#5C3D2E;line-height:1.7;">
          Our artisans are currently preparing your items. As soon as your order is packaged
          and handed over to our courier partner, we will send you another email with your
          tracking details.
        </p>
      </div>

      <p style="font-size:14px;color:#5C3D2E;line-height:1.7;margin:0 0 28px;">
        If you have any questions or need to make adjustments to your shipping details,
        please reply directly to this email or contact our support team.
      </p>

      <p style="font-size:14px;color:#5C3D2E;margin:0 0 4px;">Warm regards,</p>
      <p style="font-size:15px;font-weight:bold;color:#1A0F08;margin:0;">The LERD Team</p>
    </div>

    <!-- Gold bar -->
    <div style="background:linear-gradient(90deg,#8B6914,#B8860B,#8B6914);height:3px;"></div>

    <!-- Footer -->
    <div style="background:#1A0F08;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;">
        Luxurious &nbsp;·&nbsp; Excellence &nbsp;·&nbsp; Reliable &nbsp;·&nbsp; Durable
      </p>
      <p style="margin:0;font-size:11px;color:#7A5C3A;font-family:Arial,sans-serif;">
        info@lerd.lk &nbsp;|&nbsp; +94 759 831 831 &nbsp;|&nbsp; Kandy, Sri Lanka
      </p>
      <p style="margin:8px 0 0;font-size:10px;color:#5C3D2E;font-family:Arial,sans-serif;">
        © 2026 LERD International (Pvt) Ltd. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>`
}

export async function sendOrderConfirmation(order) {
  const { customer, orderId, items, amount, createdAt } = order
  const toEmail = customer.email

  const pdfBuffer = await generateInvoicePDF(order)

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || `LERD <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: `We've received your order! | LERD`,
    html:    buildEmailHTML({ orderId, customer, items, amount, createdAt }),
    attachments: [
      {
        filename:    `LERD-Invoice-${orderId}.pdf`,
        content:     pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })

  console.log(`Order confirmation email + PDF sent to ${toEmail} for order ${orderId}`)
}

export async function sendShippingEmail(order, shipping) {
  const { customer, orderId } = order
  const { courierName, trackingNumber, trackingUrl } = shipping
  const name    = `${customer.firstName} ${customer.lastName}`
  const toEmail = customer.email

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your LERD order is on its way!</title></head>
<body style="margin:0;padding:0;background:#F5ECD7;font-family:Georgia,serif;">
<div style="max-width:620px;margin:40px auto;background:#ffffff;border:1px solid #E8D9C5;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <div style="background:#1A0F08;padding:36px 40px;text-align:center;">
    <p style="margin:0 0 4px;font-size:28px;letter-spacing:0.35em;color:#B8860B;font-family:Georgia,serif;font-weight:bold;">LERD</p>
    <p style="margin:0;font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;">Luxurious Leather Crafts</p>
  </div>
  <div style="background:linear-gradient(90deg,#8B6914,#B8860B,#8B6914);height:3px;"></div>

  <!-- Body -->
  <div style="padding:40px;">

    <!-- Truck icon row -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#B8860B22;border:2px solid rgba(184,134,11,0.3);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;">
        🚚
      </div>
    </div>

    <p style="font-size:15px;color:#1A0F08;margin:0 0 8px;">Dear ${name},</p>
    <p style="font-size:14px;color:#5C3D2E;line-height:1.7;margin:0 0 24px;">
      Great news! Your order <strong>#${orderId}</strong> has been meticulously packed and is officially on its way to you.
    </p>

    <!-- Tracking box -->
    <div style="background:#FAF6F0;border:1px solid #E8D9C5;border-left:4px solid #B8860B;border-radius:6px;padding:24px;margin-bottom:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;">Shipment Details</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:7px 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;width:40%;">Courier Partner</td>
          <td style="padding:7px 0;font-size:14px;color:#1A0F08;font-weight:bold;">${courierName}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;">Tracking Number</td>
          <td style="padding:7px 0;font-size:14px;color:#1A0F08;font-family:monospace;letter-spacing:0.08em;">${trackingNumber}</td>
        </tr>
      </table>
      ${trackingUrl ? `
      <div style="margin-top:16px;text-align:center;">
        <a href="${trackingUrl}" target="_blank"
          style="display:inline-block;padding:11px 28px;background:linear-gradient(135deg,#B8860B,#8B6914);color:#FAF6F0;text-decoration:none;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-weight:700;border-radius:6px;font-family:Arial,sans-serif;">
          Track Your Package →
        </a>
      </div>` : ''}
    </div>

    <p style="font-size:13px;color:#7A5C3A;line-height:1.7;margin:0 0 16px;">
      Please allow <strong>24–48 hours</strong> for the tracking link to update. Delivery typically takes <strong>2–4 business days</strong>, depending on your location.
    </p>

    <p style="font-size:14px;color:#5C3D2E;line-height:1.7;margin:0 0 28px;">
      We hope you love your new leather goods as much as we loved crafting them for you.
    </p>

    <p style="font-size:14px;color:#5C3D2E;margin:0 0 4px;">Sincerely,</p>
    <p style="font-size:15px;font-weight:bold;color:#1A0F08;margin:0;">The LERD Team</p>
  </div>

  <div style="background:linear-gradient(90deg,#8B6914,#B8860B,#8B6914);height:3px;"></div>
  <div style="background:#1A0F08;padding:24px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;">
      Luxurious &nbsp;·&nbsp; Excellence &nbsp;·&nbsp; Reliable &nbsp;·&nbsp; Durable
    </p>
    <p style="margin:0;font-size:11px;color:#7A5C3A;font-family:Arial,sans-serif;">
      info@lerd.lk &nbsp;|&nbsp; +94 759 831 831 &nbsp;|&nbsp; Kandy, Sri Lanka
    </p>
  </div>
</div>
</body></html>`

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || `LERD <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: `Your LERD order is on its way! 🚚`,
    html,
  })

  console.log(`Shipping email sent to ${toEmail} for order ${orderId}`)
}

export async function sendDeliveryEmail(order) {
  const { customer, orderId } = order
  const name    = `${customer.firstName} ${customer.lastName}`
  const toEmail = customer.email

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>How is your new LERD product?</title></head>
<body style="margin:0;padding:0;background:#F5ECD7;font-family:Georgia,serif;">
<div style="max-width:620px;margin:40px auto;background:#ffffff;border:1px solid #E8D9C5;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <div style="background:#1A0F08;padding:36px 40px;text-align:center;">
    <p style="margin:0 0 4px;font-size:28px;letter-spacing:0.35em;color:#B8860B;font-family:Georgia,serif;font-weight:bold;">LERD</p>
    <p style="margin:0;font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:#A07850;font-family:Arial,sans-serif;">Luxurious Leather Crafts</p>
  </div>
  <div style="background:linear-gradient(90deg,#8B6914,#B8860B,#8B6914);height:3px;"></div>

  <!-- Body -->
  <div style="padding:40px;">

    <!-- Icon row -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#B8860B22;border:2px solid rgba(184,134,11,0.3);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:30px;">
        ⭐
      </div>
    </div>

    <p style="font-size:15px;color:#1A0F08;margin:0 0 8px;">Dear ${name},</p>
    <p style="font-size:14px;color:#5C3D2E;line-height:1.7;margin:0 0 16px;">
      According to our records, your order <strong>#${orderId}</strong> has arrived!
      We hope unboxing your new product was an absolute pleasure.
    </p>
    <p style="font-size:14px;color:#5C3D2E;line-height:1.7;margin:0 0 28px;">
      At LERD, we strive for perfection in every stitch. Your feedback helps us maintain our commitment to excellence.
      We would love to hear your thoughts on the quality and craftsmanship of your new item.
    </p>

    <!-- Review CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://g.page/r/CR8rJShqr1lxEBM/review" target="_blank"
        style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#B8860B,#8B6914);color:#FAF6F0;text-decoration:none;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;font-weight:700;border-radius:6px;font-family:Arial,sans-serif;">
        ★ &nbsp; Share Your Review
      </a>
    </div>

    <!-- Divider -->
    <div style="height:1px;background:#E8D9C5;margin-bottom:24px;"></div>

    <div style="background:#FAF6F0;border-left:4px solid #B8860B;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#5C3D2E;line-height:1.7;">
        If for any reason your order didn't meet your expectations, please reply to this email immediately.
        Our customer care team is here to make it right.
      </p>
    </div>

    <p style="font-size:14px;color:#5C3D2E;line-height:1.7;margin:0 0 28px;">
      Thank you for supporting our brand.
    </p>

    <p style="font-size:14px;color:#5C3D2E;margin:0 0 4px;">Best regards,</p>
    <p style="font-size:15px;font-weight:bold;color:#1A0F08;margin:0;">The LERD Team</p>
  </div>

  <div style="background:linear-gradient(90deg,#8B6914,#B8860B,#8B6914);height:3px;"></div>
  <div style="background:#1A0F08;padding:24px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#B8860B;font-family:Arial,sans-serif;">
      Luxurious &nbsp;·&nbsp; Excellence &nbsp;·&nbsp; Reliable &nbsp;·&nbsp; Durable
    </p>
    <p style="margin:0;font-size:11px;color:#7A5C3A;font-family:Arial,sans-serif;">
      info@lerd.lk &nbsp;|&nbsp; +94 759 831 831 &nbsp;|&nbsp; Kandy, Sri Lanka
    </p>
  </div>
</div>
</body></html>`

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || `LERD <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: `How is your new LERD product?`,
    html,
  })

  console.log(`Delivery feedback email sent to ${toEmail} for order ${orderId}`)
}
