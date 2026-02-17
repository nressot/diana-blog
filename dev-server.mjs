#!/usr/bin/env node
/**
 * Dev server for API routes
 * Simulates Vercel/Netlify serverless functions locally
 */

import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 4000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

// Initialize Supabase (use service role key for write operations)
const supabase = process.env.VITE_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)
  ? createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)
  : null

// Initialize Resend for email
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    stripe: !!stripe,
    supabase: !!supabase
  })
})

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env' })
  }

  const { items, singleProduct } = req.body

  try {
    let lineItems = []
    let cartItemsMetadata = []

    if (singleProduct) {
      const { priceId, productId, productName, quantity = 1 } = singleProduct

      if (priceId) {
        lineItems = [{
          price: priceId,
          quantity: quantity,
        }]
      } else {
        return res.status(400).json({ error: 'Price ID is required for single product' })
      }

      cartItemsMetadata = [{
        product_id: productId,
        product_title: productName,
        quantity: quantity,
      }]
    } else if (items && Array.isArray(items) && items.length > 0) {
      lineItems = items.map(item => {
        if (item.stripePriceId) {
          return {
            price: item.stripePriceId,
            quantity: item.quantity || 1,
          }
        } else {
          return {
            price_data: {
              currency: 'chf',
              product_data: {
                name: item.title || item.productName || 'Produit',
                description: item.formatLabel ? `Format: ${item.formatLabel}` : undefined,
              },
              unit_amount: item.price,
            },
            quantity: item.quantity || 1,
          }
        }
      })

      cartItemsMetadata = items.map(item => ({
        product_id: item.productId || item.id,
        product_title: item.title || item.productName,
        format_type: item.formatType,
        quantity: item.quantity || 1,
      }))
    } else {
      return res.status(400).json({ error: 'No items provided for checkout' })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      metadata: {
        cart_items: JSON.stringify(cartItemsMetadata),
        item_count: cartItemsMetadata.length.toString(),
      },
      success_url: `${process.env.SITE_URL || 'http://localhost:5173'}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || 'http://localhost:5173'}/boutique?canceled=true`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      allow_promotion_codes: true,
      locale: 'fr',
      // Create customer to enable email receipts (activate in Stripe Dashboard > Settings > Emails)
      customer_creation: 'always',
    })

    res.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Get order details
app.get('/api/get-order-details', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' })
  }

  const { session_id } = req.query

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID required' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer_details']
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
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

    res.json(orderDetails)
  } catch (err) {
    console.error('Error retrieving order:', err)
    res.status(500).json({ error: 'Failed to retrieve order details' })
  }
})

// Stripe webhook (simplified for dev)
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('Webhook received (dev mode - not processing)')
  res.json({ received: true })
})

// Get user orders
app.get('/api/get-user-orders', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase is not configured' })
  }

  const { email } = req.query

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    // Fetch orders for this email
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return res.status(500).json({ error: 'Failed to fetch orders' })
    }

    // Group orders by stripe_session_id
    const groupedOrders = (orders || []).reduce((acc, order) => {
      const sessionId = order.stripe_session_id
      if (!acc[sessionId]) {
        acc[sessionId] = {
          id: sessionId,
          reference: sessionId.slice(-12).toUpperCase(),
          created_at: order.created_at,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          shipping_address: order.shipping_address,
          billing_address: order.billing_address,
          status: order.status,
          tracking_number: order.tracking_number,
          tracking_url: order.tracking_url,
          items: [],
          total: 0
        }
      }
      acc[sessionId].items.push({
        product_id: order.product_id,
        product_title: order.product_title,
        product_type: order.product_type,
        quantity: order.quantity,
        amount: order.amount
      })
      acc[sessionId].total += order.amount || 0
      return acc
    }, {})

    const ordersList = Object.values(groupedOrders)

    res.json({ orders: ordersList })
  } catch (err) {
    console.error('Error in get-user-orders:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Sync product to Stripe
app.post('/api/sync-product-to-stripe', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe non configure' })
  }
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase non configure' })
  }

  const { productId } = req.body

  if (!productId) {
    return res.status(400).json({ error: 'productId requis' })
  }

  try {
    // 1. Recuperer le produit depuis Supabase
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*, product_categories(*)')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      console.error('Product fetch error:', fetchError)
      return res.status(404).json({ error: 'Produit non trouve' })
    }

    console.log('Syncing product:', product.title)

    // 2. Preparer les donnees Stripe
    const stripeProductData = {
      name: product.title,
      description: product.excerpt || product.description || '',
      metadata: {
        supabase_id: product.id,
        category: product.product_categories?.name || '',
        product_type: product.product_type || 'book'
      }
    }

    // Ajouter l'image si disponible
    if (product.image) {
      stripeProductData.images = [product.image]
    }

    let stripeProduct

    // 3. Creer ou mettre a jour le produit Stripe
    if (product.stripe_product_id) {
      console.log('Updating existing Stripe product:', product.stripe_product_id)
      stripeProduct = await stripe.products.update(
        product.stripe_product_id,
        stripeProductData
      )
    } else {
      console.log('Creating new Stripe product')
      stripeProduct = await stripe.products.create(stripeProductData)
    }

    console.log('Stripe product ID:', stripeProduct.id)

    // 4. Gerer les prix pour chaque format
    const formats = product.formats || []
    const updatedFormats = []

    for (const format of formats) {
      const priceData = {
        currency: 'chf',
        product: stripeProduct.id,
        unit_amount: format.price || product.price,
        metadata: {
          format_type: format.type || 'book',
          format_label: format.label || 'Standard'
        }
      }

      let stripePrice

      if (format.stripe_price_id) {
        // Verifier si le prix existe toujours
        try {
          stripePrice = await stripe.prices.retrieve(format.stripe_price_id)
          console.log('Existing price found:', stripePrice.id)
        } catch (e) {
          console.log('Price not found, creating new one')
          stripePrice = await stripe.prices.create(priceData)
        }
      } else {
        console.log('Creating new price for format:', format.type || format.label)
        stripePrice = await stripe.prices.create(priceData)
      }

      updatedFormats.push({
        ...format,
        stripe_price_id: stripePrice.id
      })
    }

    // 5. Si pas de formats, creer un prix par defaut
    if (updatedFormats.length === 0 && product.price) {
      console.log('No formats, creating default price')
      const defaultPrice = await stripe.prices.create({
        currency: 'chf',
        product: stripeProduct.id,
        unit_amount: product.price,
        metadata: {
          format_type: 'default',
          format_label: 'Prix standard'
        }
      })

      updatedFormats.push({
        type: 'default',
        label: 'Standard',
        price: product.price,
        stripe_price_id: defaultPrice.id,
        inStock: product.in_stock
      })
    }

    // 6. Mettre a jour le produit dans Supabase
    const { error: updateError } = await supabase
      .from('products')
      .update({
        stripe_product_id: stripeProduct.id,
        stripe_synced_at: new Date().toISOString(),
        formats: updatedFormats
      })
      .eq('id', productId)

    if (updateError) {
      console.error('Error updating Supabase:', updateError)
      return res.status(500).json({ error: 'Erreur mise a jour Supabase' })
    }

    // 7. Reponse
    res.json({
      success: true,
      stripeProductId: stripeProduct.id,
      formats: updatedFormats.map(f => ({
        type: f.type,
        label: f.label,
        stripe_price_id: f.stripe_price_id
      })),
      message: `Produit "${product.title}" synchronise avec Stripe`
    })

  } catch (err) {
    console.error('Stripe sync error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Archive Stripe product (when deleting from admin)
app.post('/api/archive-stripe-product', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe non configure' })
  }

  const { stripeProductId } = req.body

  if (!stripeProductId) {
    return res.status(400).json({ error: 'stripeProductId requis' })
  }

  try {
    // Archive the product (set active: false)
    // Stripe doesn't allow deleting products with prices, but we can archive them
    const archivedProduct = await stripe.products.update(stripeProductId, {
      active: false
    })

    console.log('Stripe product archived:', stripeProductId)

    res.json({
      success: true,
      message: `Produit ${stripeProductId} archive dans Stripe`
    })
  } catch (err) {
    console.error('Stripe archive error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Send shipping notification email
app.post('/api/send-shipping-notification', async (req, res) => {
  if (!resend) {
    return res.status(500).json({ error: 'Resend non configure. Ajoutez RESEND_API_KEY dans .env' })
  }

  const { order } = req.body

  if (!order) {
    return res.status(400).json({ error: 'Donnees de commande requises' })
  }

  if (!order.customer_email) {
    return res.status(400).json({ error: 'Email client requis' })
  }

  try {
    const FROM_EMAIL = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'
    const SITE_NAME = 'Diana - Ecrivaine'

    // Generate HTML email
    const formattedAddress = order.shipping_address
      ? [
          order.shipping_address.name,
          order.shipping_address.line1,
          order.shipping_address.line2,
          `${order.shipping_address.postal_code} ${order.shipping_address.city}`,
          order.shipping_address.country
        ].filter(Boolean).join('<br>')
      : 'Non renseignee'

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
                Bonne nouvelle ! Votre commande vient d'etre expediee et est en chemin vers vous.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf8f5; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Article commande</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">${order.product_title}</p>
                    ${order.product_type ? `<p style="margin: 4px 0 0; font-size: 14px; color: #666;">${order.product_type}${order.quantity > 1 ? ` x ${order.quantity}` : ''}</p>` : ''}
                  </td>
                </tr>
              </table>
              ${order.tracking_number ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0f7f4; border-radius: 12px; margin-bottom: 24px; border: 1px solid #d4e8dc;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #2d6a4f; text-transform: uppercase; letter-spacing: 0.5px;">Numero de suivi</p>
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
                Le delai de livraison est generalement de 2 a 5 jours ouvrables selon votre localisation.
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

Bonne nouvelle ! Votre commande vient d'etre expediee.

ARTICLE: ${order.product_title}${order.product_type ? ` (${order.product_type})` : ''}
${order.tracking_number ? `\nNUMERO DE SUIVI: ${order.tracking_number}${order.tracking_url ? `\nSuivre: ${order.tracking_url}` : ''}` : ''}

Chaleureusement,
Diana`

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Votre commande a ete expediee - ${order.product_title}`,
      html,
      text
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Echec envoi email', details: error.message })
    }

    console.log('Shipping notification sent:', data.id, 'to', order.customer_email)
    res.json({
      success: true,
      messageId: data.id,
      sentTo: order.customer_email
    })

  } catch (err) {
    console.error('Error sending shipping notification:', err)
    res.status(500).json({ error: err.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`\n  API Dev Server running on http://localhost:${PORT}`)
  console.log(`  Stripe configured: ${!!stripe}`)
  console.log(`  Supabase configured: ${!!supabase}`)
  console.log(`  Resend configured: ${!!resend}\n`)
})
