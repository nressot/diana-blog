// Netlify Function - Stripe Checkout Session
const stripe = require('stripe')

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Check Stripe key
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe is not configured' })
    }
  }

  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const { priceId, productId, productName } = JSON.parse(event.body || '{}')

    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Price ID is required' })
      }
    }

    const siteUrl = process.env.URL || process.env.SITE_URL || 'http://localhost:5173'

    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        productId: productId || '',
        productName: productName || ''
      },
      success_url: `${siteUrl}/boutique?success=true`,
      cancel_url: `${siteUrl}/boutique?canceled=true`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC']
      }
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    }
  } catch (err) {
    console.error('Stripe error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}
