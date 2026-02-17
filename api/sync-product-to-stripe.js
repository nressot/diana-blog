/* eslint-disable no-undef */
/**
 * API pour synchroniser un produit vers Stripe
 * - Cree ou met a jour le produit dans Stripe
 * - Cree les prix pour chaque format
 * - Stocke les IDs Stripe dans Supabase
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe non configure' })
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
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
      // Mise a jour
      console.log('Updating existing Stripe product:', product.stripe_product_id)
      stripeProduct = await stripe.products.update(
        product.stripe_product_id,
        stripeProductData
      )
    } else {
      // Creation
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
        // Le prix existe deja - on ne peut pas modifier un prix Stripe
        // On verifie juste qu'il est toujours valide
        try {
          stripePrice = await stripe.prices.retrieve(format.stripe_price_id)
          console.log('Existing price found:', stripePrice.id)
        } catch (e) {
          // Prix invalide, on en cree un nouveau
          console.log('Price not found, creating new one')
          stripePrice = await stripe.prices.create(priceData)
        }
      } else {
        // Creer un nouveau prix
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
    res.status(200).json({
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
}
