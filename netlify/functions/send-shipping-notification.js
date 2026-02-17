// Netlify Function - Send Shipping Notification Email
// Sends email to customer when order is shipped

const { Resend } = require('resend')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured')
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Email service not configured' })
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  let body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    }
  }

  const { order } = body

  if (!order) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Order data required' })
    }
  }

  if (!order.customer_email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Customer email required' })
    }
  }

  try {
    const FROM_EMAIL = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'
    const SITE_NAME = 'Diana - Le Coven de Diana'

    // Format address
    const formattedAddress = order.shipping_address
      ? [
          order.shipping_address.name,
          order.shipping_address.line1,
          order.shipping_address.line2,
          `${order.shipping_address.postal_code} ${order.shipping_address.city}`,
          order.shipping_address.country
        ].filter(Boolean).join('<br>')
      : 'Non renseignée'

    const trackingSection = order.tracking_url
      ? `<a href="${order.tracking_url}" style="display: inline-block; background-color: #c17f59; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">Suivre mon colis</a>`
      : order.tracking_number
        ? `<p style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 16px 0;">${order.tracking_number}</p>`
        : ''

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f3ef; color: #1a1a1a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #c17f59; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Votre commande est en route !</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Bonjour ${order.customer_name || 'cher client'},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Bonne nouvelle ! Votre commande vient d'être expédiée et est en chemin vers vous.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf8f5; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Article commandé</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">${order.product_title}</p>
                    ${order.product_type ? `<p style="margin: 4px 0 0; font-size: 14px; color: #666;">${order.product_type}${order.quantity > 1 ? ` x ${order.quantity}` : ''}</p>` : ''}
                  </td>
                </tr>
              </table>
              ${order.tracking_number ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0f7f4; border-radius: 12px; margin-bottom: 24px; border: 1px solid #d4e8dc;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #2d6a4f; text-transform: uppercase; letter-spacing: 0.5px;">Numéro de suivi</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a; font-family: monospace;">${order.tracking_number}</p>
                    ${trackingSection}
                  </td>
                </tr>
              </table>
              ` : ''}
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf8f5; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Adresse de livraison</p>
                    <p style="margin: 0; font-size: 14px; color: #4a4a4a; line-height: 1.6;">${formattedAddress}</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Le délai de livraison est généralement de 2 à 5 jours ouvrables selon votre localisation.
              </p>
              <p style="margin: 24px 0 0; font-size: 16px; color: #4a4a4a;">
                Chaleureusement,<br><strong>Diana</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #faf8f5; padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; color: #aaa;">${SITE_NAME}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    const text = `
Bonjour ${order.customer_name || 'cher client'},

Bonne nouvelle ! Votre commande vient d'être expédiée.

ARTICLE: ${order.product_title}${order.product_type ? ` (${order.product_type})` : ''}
${order.tracking_number ? `\nNUMERO DE SUIVI: ${order.tracking_number}${order.tracking_url ? `\nSuivre: ${order.tracking_url}` : ''}` : ''}

Chaleureusement,
Diana`

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Votre commande a été expédiée - ${order.product_title}`,
      html,
      text
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send email', details: error.message })
      }
    }

    console.log('Shipping notification sent:', data.id, 'to', order.customer_email)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: data.id,
        sentTo: order.customer_email
      })
    }

  } catch (err) {
    console.error('Error sending shipping notification:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}
