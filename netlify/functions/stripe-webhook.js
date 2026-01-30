// Netlify Function - Stripe Webhook
// Handles checkout.session.completed events to create orders in Supabase

const stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
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

  // Check required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY')
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe not configured' })
    }
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Webhook secret not configured' })
    }
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials')
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database not configured' })
    }
  }

  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const signature = event.headers['stripe-signature']

  let stripeEvent

  try {
    // Verify webhook signature
    stripeEvent = stripeClient.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
    }
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object
        await handleCheckoutComplete(supabase, stripeClient, session)
        break
      }

      case 'checkout.session.expired': {
        const session = stripeEvent.data.object
        await handleCheckoutExpired(supabase, session)
        break
      }

      case 'charge.refunded': {
        const charge = stripeEvent.data.object
        await handleRefund(supabase, charge)
        break
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true })
    }
  } catch (err) {
    console.error('Error processing webhook:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    }
  }
}

/**
 * Handle successful checkout
 */
async function handleCheckoutComplete(supabase, stripeClient, session) {
  console.log('Processing checkout.session.completed:', session.id)

  // Get customer details
  const customerEmail = session.customer_details?.email || session.customer_email
  const customerName = session.customer_details?.name || ''

  // Get shipping address
  const shippingAddress = session.shipping_details?.address
    ? {
        name: session.shipping_details.name,
        line1: session.shipping_details.address.line1,
        line2: session.shipping_details.address.line2,
        city: session.shipping_details.address.city,
        postal_code: session.shipping_details.address.postal_code,
        country: session.shipping_details.address.country
      }
    : null

  // Get billing address
  const billingAddress = session.customer_details?.address
    ? {
        name: session.customer_details.name,
        line1: session.customer_details.address.line1,
        line2: session.customer_details.address.line2,
        city: session.customer_details.address.city,
        postal_code: session.customer_details.address.postal_code,
        country: session.customer_details.address.country
      }
    : null

  // Get product info from metadata
  const productId = session.metadata?.productId || null
  const productTitle = session.metadata?.productName || 'Produit inconnu'
  const productType = session.metadata?.productType || null

  // Check if order already exists (idempotency)
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single()

  if (existingOrder) {
    console.log('Order already exists for session:', session.id)
    // Update status if needed
    await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('stripe_session_id', session.id)
    return
  }

  // Create order
  const orderData = {
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent,
    customer_email: customerEmail,
    customer_name: customerName,
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    product_id: productId,
    product_title: productTitle,
    product_type: productType,
    amount: session.amount_total,
    currency: session.currency,
    status: 'completed'
  }

  const { error } = await supabase.from('orders').insert(orderData)

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }

  console.log('Order created successfully for session:', session.id)
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutExpired(supabase, session) {
  console.log('Processing checkout.session.expired:', session.id)

  // Update existing order to canceled if exists
  const { error } = await supabase
    .from('orders')
    .update({ status: 'canceled' })
    .eq('stripe_session_id', session.id)

  if (error) {
    console.error('Error updating expired session:', error)
  }
}

/**
 * Handle refund
 */
async function handleRefund(supabase, charge) {
  console.log('Processing refund for payment intent:', charge.payment_intent)

  const { error } = await supabase
    .from('orders')
    .update({ status: 'refunded' })
    .eq('stripe_payment_intent', charge.payment_intent)

  if (error) {
    console.error('Error updating refund status:', error)
  }
}
