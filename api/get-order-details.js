/* eslint-disable no-undef */
// Serverless function for Vercel/Netlify
// Retrieves order details from Stripe session

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { session_id } = req.query

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID required' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured' })
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    // Retrieve the session with line items
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer_details']
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    // Format the response
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

    res.status(200).json(orderDetails)
  } catch (err) {
    console.error('Error retrieving order:', err)

    if (err.type === 'StripeInvalidRequestError') {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.status(500).json({ error: 'Failed to retrieve order details' })
  }
}
