// Netlify Function - Sync Product to Stripe
// Creates or updates a product and its prices in Stripe

const stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')

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
      body: JSON.stringify({ error: 'Stripe not configured' })
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Supabase not configured' })
    }
  }

  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)
  const supabase = createClient(supabaseUrl, supabaseKey)

  let body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    }
  }

  const { productId } = body

  if (!productId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'productId required' })
    }
  }

  try {
    // 1. Get product from Supabase
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*, product_categories(*)')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      console.error('Product fetch error:', fetchError)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Product not found' })
      }
    }

    console.log('Syncing product:', product.title)

    // 2. Prepare Stripe product data
    const stripeProductData = {
      name: product.title,
      description: product.excerpt || product.description || '',
      metadata: {
        supabase_id: product.id,
        category: product.product_categories?.name || '',
        product_type: product.product_type || 'book'
      }
    }

    if (product.image) {
      stripeProductData.images = [product.image]
    }

    let stripeProduct

    // 3. Create or update Stripe product
    if (product.stripe_product_id) {
      console.log('Updating existing Stripe product:', product.stripe_product_id)
      stripeProduct = await stripeClient.products.update(
        product.stripe_product_id,
        stripeProductData
      )
    } else {
      console.log('Creating new Stripe product')
      stripeProduct = await stripeClient.products.create(stripeProductData)
    }

    console.log('Stripe product ID:', stripeProduct.id)

    // 4. Handle prices for each format
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
        try {
          stripePrice = await stripeClient.prices.retrieve(format.stripe_price_id)
          console.log('Existing price found:', stripePrice.id)
        } catch (e) {
          console.log('Price not found, creating new one')
          stripePrice = await stripeClient.prices.create(priceData)
        }
      } else {
        console.log('Creating new price for format:', format.type || format.label)
        stripePrice = await stripeClient.prices.create(priceData)
      }

      updatedFormats.push({
        ...format,
        stripe_price_id: stripePrice.id
      })
    }

    // 5. If no formats, create default price
    if (updatedFormats.length === 0 && product.price) {
      console.log('No formats, creating default price')
      const defaultPrice = await stripeClient.prices.create({
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

    // 6. Update product in Supabase
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error updating Supabase' })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        stripeProductId: stripeProduct.id,
        formats: updatedFormats.map(f => ({
          type: f.type,
          label: f.label,
          stripe_price_id: f.stripe_price_id
        })),
        message: `Product "${product.title}" synced with Stripe`
      })
    }

  } catch (err) {
    console.error('Stripe sync error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}
