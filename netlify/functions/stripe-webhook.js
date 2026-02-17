// Netlify Function - Stripe Webhook
// Handles checkout.session.completed events to create orders in Supabase

const stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

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

  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.SUPABASE_URL || !supabaseKey) {
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
    supabaseKey
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

  // Get product info from metadata (cart_items is a JSON string)
  let cartItems = []
  let productId = null
  let productTitle = 'Produit inconnu'
  let productType = null

  try {
    if (session.metadata?.cart_items) {
      cartItems = JSON.parse(session.metadata.cart_items)
      if (cartItems.length > 0) {
        // For single item, use its details
        if (cartItems.length === 1) {
          productId = cartItems[0].product_id || null
          productTitle = cartItems[0].product_title || 'Produit'
          productType = cartItems[0].format_type || null
        } else {
          // For multiple items, create a summary
          productTitle = cartItems.map(item => item.product_title).join(', ')
        }
      }
    }
    // Fallback to old metadata format
    if (productTitle === 'Produit inconnu' && session.metadata?.productName) {
      productId = session.metadata.productId || null
      productTitle = session.metadata.productName
      productType = session.metadata.productType || null
    }
  } catch (e) {
    console.error('Error parsing cart_items:', e)
  }

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

  // Send confirmation email
  await sendConfirmationEmail(orderData, session)
}

/**
 * Send order confirmation email via Resend
 */
async function sendConfirmationEmail(orderData, session) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'

  const orderReference = session.id.slice(-12).toUpperCase()
  const amountFormatted = ((orderData.amount || 0) / 100).toFixed(2).replace('.', ',')

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: orderData.customer_email,
      subject: `Confirmation de commande #${orderReference} - Le Coven de Diana`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf9f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0; font-family: Georgia, serif;">Le Coven de Diana</h1>
      <p style="color: #666; margin-top: 8px;">Merci pour votre commande</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <!-- Confirmation Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: #d4a574; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 32px;">&#10003;</span>
        </div>
      </div>

      <h2 style="color: #1a1a1a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">Commande confirmee !</h2>
      <p style="color: #666; text-align: center; margin: 0 0 32px 0;">
        Bonjour ${orderData.customer_name || 'cher client'},<br>
        Votre commande a bien ete enregistree.
      </p>

      <!-- Order Details -->
      <div style="background: #faf9f6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #666;">Reference</span>
          <span style="color: #1a1a1a; font-weight: 600; font-family: monospace;">#${orderReference}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #666;">Article</span>
          <span style="color: #1a1a1a; font-weight: 500;">${orderData.product_title}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #e5e5e5; padding-top: 12px; margin-top: 12px;">
          <span style="color: #1a1a1a; font-weight: 600;">Total</span>
          <span style="color: #d4a574; font-weight: 700; font-size: 18px;">CHF ${amountFormatted}</span>
        </div>
      </div>

      <!-- Next Steps -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 16px 0;">Prochaines etapes</h3>
        <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
          <div style="width: 24px; height: 24px; background: #d4a574; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px; flex-shrink: 0;">1</div>
          <p style="margin: 0; color: #666; line-height: 24px;">Votre commande sera preparee sous 1-2 jours ouvrables.</p>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
          <div style="width: 24px; height: 24px; background: #d4a574; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px; flex-shrink: 0;">2</div>
          <p style="margin: 0; color: #666; line-height: 24px;">Vous recevrez un email avec le suivi d'expedition.</p>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://le-coven-de-diana.netlify.app/mes-commandes" style="display: inline-block; background: #d4a574; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Suivre ma commande
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #999; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">Des questions ? Contactez-nous</p>
      <a href="mailto:contact@covendediana.ch" style="color: #d4a574; text-decoration: none;">contact@covendediana.ch</a>
      <p style="margin: 24px 0 0 0; font-size: 12px;">Diana - Le Coven de Diana</p>
    </div>
  </div>
</body>
</html>
      `
    })

    if (error) {
      console.error('Error sending confirmation email:', error)
    } else {
      console.log('Confirmation email sent:', data?.id)
    }
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
    // Don't throw - email failure shouldn't fail the webhook
  }
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutExpired(supabase, session) {
  console.log('Processing checkout.session.expired:', session.id)

  // Get order info before updating
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', session.id)
    .single()

  // Update existing order to canceled if exists
  const { error } = await supabase
    .from('orders')
    .update({ status: 'canceled' })
    .eq('stripe_session_id', session.id)

  if (error) {
    console.error('Error updating expired session:', error)
  }

  // Send cancellation email if order existed
  if (order) {
    await sendCancellationEmail(order, session)
  }
}

/**
 * Send order cancellation email via Resend
 */
async function sendCancellationEmail(order, session) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'

  const orderReference = session.id.slice(-12).toUpperCase()

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `Commande annulee #${orderReference} - Le Coven de Diana`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf9f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0; font-family: Georgia, serif;">Le Coven de Diana</h1>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: #9ca3af; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 32px;">&#10005;</span>
        </div>
      </div>

      <h2 style="color: #1a1a1a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">Commande annulee</h2>
      <p style="color: #666; text-align: center; margin: 0 0 32px 0;">
        Bonjour ${order.customer_name || 'cher client'},<br>
        Votre commande n'a pas pu etre finalisee.
      </p>

      <!-- Order Details -->
      <div style="background: #faf9f6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #666;">Reference</span>
          <span style="color: #1a1a1a; font-weight: 600; font-family: monospace;">#${orderReference}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #666;">Article</span>
          <span style="color: #1a1a1a; font-weight: 500;">${order.product_title || 'Produit'}</span>
        </div>
      </div>

      <p style="color: #666; text-align: center; margin: 0 0 24px 0;">
        Si vous souhaitez finaliser votre achat, vous pouvez retourner sur notre boutique.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://le-coven-de-diana.netlify.app/boutique" style="display: inline-block; background: #d4a574; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Retourner a la boutique
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #999; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">Des questions ? Contactez-nous</p>
      <a href="mailto:contact@covendediana.ch" style="color: #d4a574; text-decoration: none;">contact@covendediana.ch</a>
      <p style="margin: 24px 0 0 0; font-size: 12px;">Diana - Le Coven de Diana</p>
    </div>
  </div>
</body>
</html>
      `
    })

    if (error) {
      console.error('Error sending cancellation email:', error)
    } else {
      console.log('Cancellation email sent:', data?.id)
    }
  } catch (err) {
    console.error('Failed to send cancellation email:', err)
  }
}

/**
 * Handle refund
 */
async function handleRefund(supabase, charge) {
  console.log('Processing refund for payment intent:', charge.payment_intent)

  // Get order info before updating
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent', charge.payment_intent)
    .single()

  const { error } = await supabase
    .from('orders')
    .update({ status: 'refunded' })
    .eq('stripe_payment_intent', charge.payment_intent)

  if (error) {
    console.error('Error updating refund status:', error)
  }

  // Send refund email if order found
  if (order) {
    await sendRefundEmail(order, charge)
  }
}

/**
 * Send refund confirmation email via Resend
 */
async function sendRefundEmail(order, charge) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'

  const orderReference = order.stripe_session_id?.slice(-12).toUpperCase() || 'N/A'
  const refundAmount = ((charge.amount_refunded || 0) / 100).toFixed(2).replace('.', ',')

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `Remboursement confirme #${orderReference} - Le Coven de Diana`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf9f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0; font-family: Georgia, serif;">Le Coven de Diana</h1>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: #3b82f6; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 28px;">&#8634;</span>
        </div>
      </div>

      <h2 style="color: #1a1a1a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">Remboursement confirme</h2>
      <p style="color: #666; text-align: center; margin: 0 0 32px 0;">
        Bonjour ${order.customer_name || 'cher client'},<br>
        Votre remboursement a ete effectue avec succes.
      </p>

      <!-- Order Details -->
      <div style="background: #faf9f6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #666;">Reference</span>
          <span style="color: #1a1a1a; font-weight: 600; font-family: monospace;">#${orderReference}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #666;">Article</span>
          <span style="color: #1a1a1a; font-weight: 500;">${order.product_title || 'Produit'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #e5e5e5; padding-top: 12px; margin-top: 12px;">
          <span style="color: #1a1a1a; font-weight: 600;">Montant rembourse</span>
          <span style="color: #3b82f6; font-weight: 700; font-size: 18px;">CHF ${refundAmount}</span>
        </div>
      </div>

      <p style="color: #666; text-align: center; margin: 0 0 24px 0;">
        Le remboursement apparaitra sur votre compte dans un delai de 5 a 10 jours ouvrables selon votre banque.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://le-coven-de-diana.netlify.app/mes-commandes" style="display: inline-block; background: #d4a574; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Voir mes commandes
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #999; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">Des questions ? Contactez-nous</p>
      <a href="mailto:contact@covendediana.ch" style="color: #d4a574; text-decoration: none;">contact@covendediana.ch</a>
      <p style="margin: 24px 0 0 0; font-size: 12px;">Diana - Le Coven de Diana</p>
    </div>
  </div>
</body>
</html>
      `
    })

    if (error) {
      console.error('Error sending refund email:', error)
    } else {
      console.log('Refund email sent:', data?.id)
    }
  } catch (err) {
    console.error('Failed to send refund email:', err)
  }
}
