// Netlify Function - Unsubscribe from Newsletter
// Allows users to unsubscribe via a link in emails

const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'text/html; charset=utf-8'
  }

  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.SUPABASE_URL || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: generateHtmlPage('Erreur', 'Service temporairement indisponible.', false)
    }
  }

  try {
    // Get email from query parameter
    const email = event.queryStringParameters?.email

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: generateHtmlPage('Erreur', 'Email manquant.', false)
      }
    }

    const supabase = createClient(process.env.SUPABASE_URL, supabaseKey)

    // Find subscriber
    const { data: subscriber, error: findError } = await supabase
      .from('subscribers')
      .select('id, status, first_name')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (findError) {
      console.error('Error finding subscriber:', findError)
      return {
        statusCode: 500,
        headers,
        body: generateHtmlPage('Erreur', 'Une erreur est survenue.', false)
      }
    }

    if (!subscriber) {
      return {
        statusCode: 200,
        headers,
        body: generateHtmlPage('Non inscrit', 'Cet email n\'est pas inscrit \u00e0 la newsletter.', false)
      }
    }

    if (subscriber.status === 'unsubscribed') {
      return {
        statusCode: 200,
        headers,
        body: generateHtmlPage('D\u00e9j\u00e0 d\u00e9sinscrit', 'Vous \u00eates d\u00e9j\u00e0 d\u00e9sinscrit de la newsletter.', false)
      }
    }

    // Unsubscribe
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Error unsubscribing:', updateError)
      return {
        statusCode: 500,
        headers,
        body: generateHtmlPage('Erreur', 'Une erreur est survenue lors de la d\u00e9sinscription.', false)
      }
    }

    const name = subscriber.first_name || ''
    return {
      statusCode: 200,
      headers,
      body: generateHtmlPage(
        'D\u00e9sinscription confirm\u00e9e',
        `${name ? name + ', vous avez' : 'Vous avez'} \u00e9t\u00e9 d\u00e9sinscrit de la newsletter Le Coven de Diana. Vous ne recevrez plus d'emails de notre part.`,
        true
      )
    }

  } catch (err) {
    console.error('Unsubscribe error:', err)
    return {
      statusCode: 500,
      headers,
      body: generateHtmlPage('Erreur', 'Une erreur est survenue.', false)
    }
  }
}

function generateHtmlPage(title, message, success) {
  const iconColor = success ? '#22c55e' : '#ef4444'
  const icon = success ? '&#10003;' : '&#10007;'

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Le Coven de Diana</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #faf9f6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      text-align: center;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 48px 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .icon {
      width: 64px;
      height: 64px;
      background: ${iconColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      color: white;
      font-size: 32px;
    }
    h1 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 16px;
      font-family: Georgia, serif;
    }
    p {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      background: #d4a574;
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
    }
    .btn:hover {
      background: #c49464;
    }
    .logo {
      margin-bottom: 32px;
      color: #1a1a1a;
      font-size: 20px;
      font-family: Georgia, serif;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Le Coven de Diana</div>
    <div class="card">
      <div class="icon">${icon}</div>
      <h1>${title}</h1>
      <p>${message}</p>
      <a href="https://le-coven-de-diana.netlify.app" class="btn">Retour au site</a>
    </div>
  </div>
</body>
</html>
  `
}
