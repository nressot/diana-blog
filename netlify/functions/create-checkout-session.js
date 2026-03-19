// Netlify Function - Stripe Checkout Session
// Supports both single product and cart checkout

const stripe = require('stripe')

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

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe is not configured' })
    }
  }

  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const body = JSON.parse(event.body || '{}')
    const { items, singleProduct, customerEmail } = body

    let lineItems = []
    let cartItemsMetadata = []

    // Mode: Single product checkout
    if (singleProduct) {
      const { priceId, productId, productName, quantity = 1 } = singleProduct

      if (!priceId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Price ID is required' })
        }
      }

      lineItems = [{
        price: priceId,
        quantity: quantity
      }]

      cartItemsMetadata = [{
        product_id: productId,
        product_title: productName,
        quantity: quantity
      }]
    }
    // Mode: Cart checkout with multiple items
    else if (items && Array.isArray(items) && items.length > 0) {
      lineItems = items.map(item => {
        if (item.stripePriceId) {
          return {
            price: item.stripePriceId,
            quantity: item.quantity || 1
          }
        } else {
          // Fallback: create price_data if no Stripe price ID
          return {
            price_data: {
              currency: 'chf',
              product_data: {
                name: item.title || item.productName || 'Produit',
                description: item.formatLabel ? `Format: ${item.formatLabel}` : undefined
              },
              unit_amount: item.price
            },
            quantity: item.quantity || 1
          }
        }
      })

      cartItemsMetadata = items.map(item => ({
        product_id: item.productId || item.id,
        product_title: item.title || item.productName,
        format_type: item.formatType,
        quantity: item.quantity || 1
      }))
    }
    // Legacy mode: direct priceId in body
    else if (body.priceId) {
      lineItems = [{
        price: body.priceId,
        quantity: 1
      }]

      cartItemsMetadata = [{
        product_id: body.productId || '',
        product_title: body.productName || '',
        quantity: 1
      }]
    }
    else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No items provided for checkout' })
      }
    }

    const siteUrl = process.env.URL || process.env.SITE_URL || 'https://le-coven-de-diana.netlify.app'

    const sessionConfig = {
      mode: 'payment',
      payment_method_types: ['card', 'twint'],
      line_items: lineItems,
      metadata: {
        cart_items: JSON.stringify(cartItemsMetadata),
        item_count: cartItemsMetadata.length.toString()
      },
      success_url: `${siteUrl}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/boutique?canceled=true`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC']
      },
      allow_promotion_codes: true,
      locale: 'fr',
      customer_creation: 'always'
    }

    // Pre-fill customer email if provided (from logged-in user)
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail
    }

    const session = await stripeClient.checkout.sessions.create(sessionConfig)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id })
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
