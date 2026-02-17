/* eslint-disable no-undef */
// Serverless function for sending shipping notification emails
// Uses Resend for email delivery

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'
const SITE_NAME = 'Diana - Ecrivaine'

function generateShippingEmailHTML(order) {
  const {
    customer_name,
    product_title,
    product_type,
    quantity,
    tracking_number,
    tracking_url,
    shipping_address
  } = order

  const formattedAddress = shipping_address
    ? [
        shipping_address.name,
        shipping_address.line1,
        shipping_address.line2,
        `${shipping_address.postal_code} ${shipping_address.city}`,
        shipping_address.country
      ].filter(Boolean).join('<br>')
    : 'Non renseignee'

  const trackingSection = tracking_url
    ? `<a href="${tracking_url}" style="display: inline-block; background-color: #c17f59; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">Suivre mon colis</a>`
    : tracking_number
      ? `<p style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 16px 0;">${tracking_number}</p>`
      : ''

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre commande a ete expediee</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f3ef; color: #1a1a1a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color: #c17f59; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Votre commande est en route !
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Bonjour ${customer_name || 'cher client'},
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Bonne nouvelle ! Votre commande vient d'etre expediee et est en chemin vers vous.
              </p>

              <!-- Product Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf8f5; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
                      Article commande
                    </p>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">
                      ${product_title}
                    </p>
                    ${product_type ? `<p style="margin: 4px 0 0; font-size: 14px; color: #666;">${product_type}${quantity > 1 ? ` x ${quantity}` : ''}</p>` : ''}
                  </td>
                </tr>
              </table>

              <!-- Tracking Box -->
              ${tracking_number ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0f7f4; border-radius: 12px; margin-bottom: 24px; border: 1px solid #d4e8dc;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #2d6a4f; text-transform: uppercase; letter-spacing: 0.5px;">
                      Numero de suivi
                    </p>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a; font-family: monospace;">
                      ${tracking_number}
                    </p>
                    ${trackingSection}
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Delivery Address -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf8f5; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
                      Adresse de livraison
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #4a4a4a; line-height: 1.6;">
                      ${formattedAddress}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Le delai de livraison est generalement de 2 a 5 jours ouvrables selon votre localisation.
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Merci pour votre confiance et bonne lecture !
              </p>

              <p style="margin: 24px 0 0; font-size: 16px; color: #4a4a4a;">
                Chaleureusement,<br>
                <strong>Diana</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf8f5; padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #888;">
                ${SITE_NAME}
              </p>
              <p style="margin: 0; font-size: 12px; color: #aaa;">
                Cet email a ete envoye automatiquement suite a l'expedition de votre commande.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

function generateShippingEmailText(order) {
  const {
    customer_name,
    product_title,
    product_type,
    quantity,
    tracking_number,
    tracking_url,
    shipping_address
  } = order

  const formattedAddress = shipping_address
    ? [
        shipping_address.name,
        shipping_address.line1,
        shipping_address.line2,
        `${shipping_address.postal_code} ${shipping_address.city}`,
        shipping_address.country
      ].filter(Boolean).join('\n')
    : 'Non renseignee'

  return `
Bonjour ${customer_name || 'cher client'},

Bonne nouvelle ! Votre commande vient d'etre expediee et est en chemin vers vous.

ARTICLE COMMANDE
${product_title}${product_type ? ` (${product_type})` : ''}${quantity > 1 ? ` x ${quantity}` : ''}

${tracking_number ? `NUMERO DE SUIVI
${tracking_number}
${tracking_url ? `\nSuivre mon colis: ${tracking_url}` : ''}
` : ''}
ADRESSE DE LIVRAISON
${formattedAddress}

Le delai de livraison est generalement de 2 a 5 jours ouvrables selon votre localisation.

Merci pour votre confiance et bonne lecture !

Chaleureusement,
Diana

---
${SITE_NAME}
Cet email a ete envoye automatiquement suite a l'expedition de votre commande.
`
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured')
    return res.status(500).json({ error: 'Email service not configured' })
  }

  try {
    const { order } = req.body

    if (!order) {
      return res.status(400).json({ error: 'Order data is required' })
    }

    if (!order.customer_email) {
      return res.status(400).json({ error: 'Customer email is required' })
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Votre commande a ete expediee - ${order.product_title}`,
      html: generateShippingEmailHTML(order),
      text: generateShippingEmailText(order)
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email', details: error.message })
    }

    console.log('Shipping notification sent:', data.id)
    return res.status(200).json({
      success: true,
      messageId: data.id,
      sentTo: order.customer_email
    })

  } catch (error) {
    console.error('Error sending shipping notification:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
