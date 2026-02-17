/* eslint-disable no-undef */
// Serverless function for Vercel/Netlify
// Handles Stripe webhook events for order management

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Service role key for server-side operations
)

export const config = {
  api: {
    bodyParser: false, // Required for Stripe signature verification
  },
}

async function buffer(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    const buf = await buffer(req)

    if (webhookSecret) {
      // Verify signature in production
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } else {
      // In development, parse without verification
      event = JSON.parse(buf.toString())
      console.warn('Warning: Webhook signature verification skipped (no STRIPE_WEBHOOK_SECRET)')
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        await handleCheckoutCompleted(session)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        await handleCheckoutExpired(session)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        await handlePaymentFailed(paymentIntent)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Error processing webhook:', err)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

async function handleCheckoutCompleted(session) {
  console.log('Processing checkout.session.completed:', session.id)

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

  // Get line items from the session
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product']
  })

  // Extract customer info
  const customerEmail = session.customer_details?.email || session.customer_email
  const customerName = session.customer_details?.name || ''

  // Extract addresses
  const shippingAddress = session.shipping_details?.address ? {
    name: session.shipping_details.name,
    line1: session.shipping_details.address.line1,
    line2: session.shipping_details.address.line2,
    city: session.shipping_details.address.city,
    postal_code: session.shipping_details.address.postal_code,
    country: session.shipping_details.address.country,
  } : null

  const billingAddress = session.customer_details?.address ? {
    name: session.customer_details.name,
    line1: session.customer_details.address.line1,
    line2: session.customer_details.address.line2,
    city: session.customer_details.address.city,
    postal_code: session.customer_details.address.postal_code,
    country: session.customer_details.address.country,
  } : null

  // Parse cart items from metadata
  let cartItems = []
  try {
    if (session.metadata?.cart_items) {
      cartItems = JSON.parse(session.metadata.cart_items)
    }
  } catch (e) {
    console.error('Error parsing cart items:', e)
  }

  // Create order for each item (or single order with items array)
  const orderItems = lineItems.data.map((item, index) => {
    const cartItem = cartItems[index] || {}
    return {
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      product_id: cartItem.product_id || null,
      product_title: item.description || cartItem.product_title || 'Produit',
      product_type: cartItem.format_type || 'book',
      quantity: item.quantity,
      amount: item.amount_total,
      currency: session.currency || 'chf',
      status: 'completed',
    }
  })

  // Insert orders into Supabase
  for (const orderData of orderItems) {
    const { error } = await supabase
      .from('orders')
      .insert(orderData)

    if (error) {
      console.error('Error creating order:', error)
      // Don't throw - continue processing other items
    } else {
      console.log('Order created successfully:', orderData.product_title)

      // Decrement stock if product_id exists
      if (orderData.product_id) {
        await decrementStock(orderData.product_id, orderData.quantity || 1, orderData.product_type)
      }
    }
  }
}

async function decrementStock(productId, quantity, formatType) {
  try {
    // Get current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('formats, in_stock')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      console.error('Error fetching product for stock update:', fetchError)
      return
    }

    // Update formats stock if applicable
    if (product.formats && Array.isArray(product.formats)) {
      const updatedFormats = product.formats.map(format => {
        if (format.type === formatType && typeof format.stock === 'number') {
          const newStock = Math.max(0, format.stock - quantity)
          return {
            ...format,
            stock: newStock,
            inStock: newStock > 0
          }
        }
        return format
      })

      // Check if any format is still in stock
      const anyInStock = updatedFormats.some(f => f.inStock !== false)

      const { error: updateError } = await supabase
        .from('products')
        .update({
          formats: updatedFormats,
          in_stock: anyInStock
        })
        .eq('id', productId)

      if (updateError) {
        console.error('Error updating stock:', updateError)
      } else {
        console.log(`Stock updated for product ${productId}, format ${formatType}`)
      }
    }
  } catch (e) {
    console.error('Error in decrementStock:', e)
  }
}

async function handleCheckoutExpired(session) {
  console.log('Checkout session expired:', session.id)

  // Update any pending order to canceled
  const { error } = await supabase
    .from('orders')
    .update({ status: 'canceled' })
    .eq('stripe_session_id', session.id)
    .eq('status', 'pending')

  if (error) {
    console.error('Error updating expired order:', error)
  }
}

async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id)

  // Update order status to failed
  const { error } = await supabase
    .from('orders')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent', paymentIntent.id)

  if (error) {
    console.error('Error updating failed payment:', error)
  }
}
