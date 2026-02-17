// Netlify Function - Get Order Details
// Returns order details from Stripe session

const stripe = require('stripe')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
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
      body: JSON.stringify({ error: 'Stripe not configured' })
    }
  }

  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)
  const { session_id } = event.queryStringParameters || {}

  if (!session_id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Session ID required' })
    }
  }

  try {
    const session = await stripeClient.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer_details']
    })

    if (!session) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Session not found' })
      }
    }

    const orderDetails = {
      sessionId: session.id,
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      items: session.line_items?.data.map(item => ({
        description: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
        currency: item.currency,
      })) || [],
      total: session.amount_total,
      currency: session.currency,
      shippingAddress: session.shipping_details?.address,
      createdAt: new Date(session.created * 1000).toISOString(),
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(orderDetails)
    }
  } catch (err) {
    console.error('Error retrieving order:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve order details' })
    }
  }
}
