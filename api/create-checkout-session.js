/* eslint-disable no-undef */
// Serverless function for Vercel/Netlify
// Creates a Stripe Checkout session for cart items

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check for Stripe secret key
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured' })
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const { items, singleProduct } = req.body

  try {
    let lineItems = []
    let cartItemsMetadata = []

    // Support both single product (legacy) and cart items
    if (singleProduct) {
      // Legacy single product checkout
      const { priceId, productId, productName, quantity = 1 } = singleProduct

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' })
      }

      lineItems = [{
        price: priceId,
        quantity: quantity,
      }]

      cartItemsMetadata = [{
        product_id: productId,
        product_title: productName,
        quantity: quantity,
      }]
    } else if (items && Array.isArray(items) && items.length > 0) {
      // Cart checkout with multiple items
      lineItems = items.map(item => {
        // Use Stripe Price ID if available, otherwise create price data
        if (item.stripePriceId) {
          return {
            price: item.stripePriceId,
            quantity: item.quantity || 1,
          }
        } else {
          // Create ad-hoc price for products without Stripe Price ID
          return {
            price_data: {
              currency: 'chf',
              product_data: {
                name: item.title || item.productName || 'Produit',
                description: item.formatLabel ? `Format: ${item.formatLabel}` : undefined,
              },
              unit_amount: item.price, // Price in centimes
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
      payment_method_types: ['card', 'twint'],
      line_items: lineItems,
      // Metadata for order tracking
      metadata: {
        cart_items: JSON.stringify(cartItemsMetadata),
        item_count: cartItemsMetadata.length.toString(),
      },
      // Redirect URLs after payment
      success_url: `${process.env.SITE_URL || 'http://localhost:5173'}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || 'http://localhost:5173'}/boutique?canceled=true`,
      // Collect billing address
      billing_address_collection: 'required',
      // Collect shipping address for physical products
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Locale
      locale: 'fr',
      // Create customer to enable email receipts (activate in Stripe Dashboard > Settings > Emails)
      customer_creation: 'always',
      // Generate invoice for each payment (sends detailed receipt with invoice PDF)
      invoice_creation: {
        enabled: true,
      },
    })

    res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
