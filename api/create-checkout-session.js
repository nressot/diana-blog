/* eslint-disable no-undef */
// Serverless function for Vercel/Netlify
// This creates a Stripe Checkout session

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
  const { priceId, productId, productName } = req.body

  // Validate required fields
  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Optional: Add metadata for order tracking
      metadata: {
        productId: productId || '',
        productName: productName || '',
      },
      // Redirect URLs after payment
      success_url: `${process.env.SITE_URL || 'http://localhost:5173'}/boutique?success=true`,
      cancel_url: `${process.env.SITE_URL || 'http://localhost:5173'}/boutique?canceled=true`,
      // Optional: Collect billing address
      billing_address_collection: 'required',
      // Optional: Collect shipping address for physical products
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
