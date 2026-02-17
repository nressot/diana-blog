/**
 * Hooks pour recuperer les produits depuis Supabase
 * Avec fallback vers les donnees statiques si Supabase n'est pas configure
 */

import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// Import des donnees statiques pour fallback
import {
  products as staticProducts,
  productCategories as staticProductCategories,
  featuredProducts as staticFeaturedProducts,
} from '../data/products'

const isSupabaseConfigured = !!supabase

/**
 * Normalise un produit Supabase vers le format attendu
 */
function normalizeProduct(product) {
  if (!product) return null
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    excerpt: product.excerpt || '',
    description: product.description || '',
    image: product.image,
    images: (product.images && product.images.length > 0) ? product.images : [product.image].filter(Boolean),
    category: product.product_categories?.name || 'Non classe',
    categoryColor: product.product_categories?.color || 'bg-neutral-400',
    categorySlug: product.product_categories?.slug,
    price: product.price,
    originalPrice: product.original_price,
    featured: product.featured || false,
    inStock: product.in_stock !== false,
    createdAt: product.created_at,
    formats: product.formats || [],
    productType: product.product_type,
    bookMeta: product.book_meta,
    stripeProductId: product.stripe_product_id,
  }
}

/**
 * Normalise une liste de produits
 */
function normalizeProducts(products) {
  if (!products) return []
  return products.map(normalizeProduct)
}

/**
 * Normalise les categories de produits
 */
function normalizeProductCategories(categories) {
  if (!categories) return []
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color || 'bg-neutral-400',
    count: cat.product_count || 0,
  }))
}

/**
 * Recuperer tous les produits
 */
export function useProducts() {
  const [data, setData] = useState(staticProducts)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('*, product_categories(*)')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        if (products && products.length > 0) {
          setData(normalizeProducts(products))
        }
        setError(null)
      } catch (err) {
        console.warn('Supabase fetch error, using fallback data:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { data, loading, error }
}

/**
 * Recuperer un produit par slug
 */
export function useProduct(slug) {
  const staticProduct = staticProducts.find((p) => p.slug === slug) || null
  const [product, setProduct] = useState(staticProduct)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !slug) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*, product_categories(*)')
          .eq('slug', slug)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          setProduct(normalizeProduct(data))
        }
        setError(null)
      } catch (err) {
        console.warn('Supabase fetch error, using fallback data:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}

/**
 * Recuperer les produits mis en avant
 */
export function useFeaturedProducts() {
  const [data, setData] = useState(staticFeaturedProducts)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const fetchFeatured = async () => {
      try {
        setLoading(true)
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('*, product_categories(*)')
          .eq('featured', true)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        if (products && products.length > 0) {
          setData(normalizeProducts(products))
        }
        setError(null)
      } catch (err) {
        console.warn('Supabase fetch error, using fallback data:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  return { data, loading, error }
}

/**
 * Recuperer les categories de produits
 */
export function useProductCategories() {
  const [data, setData] = useState(staticProductCategories)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const fetchCategories = async () => {
      try {
        setLoading(true)

        // Get categories with product count
        const { data: categories, error: fetchError } = await supabase
          .from('product_categories')
          .select('*, products(count)')
          .order('name')

        if (fetchError) throw fetchError

        if (categories && categories.length > 0) {
          const normalized = categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            color: cat.color || 'bg-neutral-400',
            count: cat.products?.[0]?.count || 0,
          }))
          setData(normalized)
        }
        setError(null)
      } catch (err) {
        console.warn('Supabase fetch error, using fallback data:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { data, loading, error }
}

/**
 * Recuperer les produits lies (meme categorie)
 */
export function useRelatedProducts(categorySlug, currentId, limit = 3) {
  const staticRelated = staticProducts
    .filter((p) => p.id !== currentId && p.category?.toLowerCase() === categorySlug?.toLowerCase())
    .slice(0, limit)

  const fallbackRelated = staticRelated.length > 0
    ? staticRelated
    : staticProducts.filter((p) => p.id !== currentId).slice(0, limit)

  const [data, setData] = useState(fallbackRelated)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Validate UUID format - skip Supabase query if ID is not a valid UUID
    const isValidUUID = currentId && typeof currentId === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentId)

    if (!isSupabaseConfigured || !currentId || !isValidUUID) {
      setLoading(false)
      return
    }

    const fetchRelated = async () => {
      try {
        setLoading(true)

        // First get the current product's category
        const { data: currentProduct } = await supabase
          .from('products')
          .select('category_id')
          .eq('id', currentId)
          .single()

        if (currentProduct?.category_id) {
          const { data: products, error: fetchError } = await supabase
            .from('products')
            .select('*, product_categories(*)')
            .eq('category_id', currentProduct.category_id)
            .neq('id', currentId)
            .limit(limit)

          if (fetchError) throw fetchError

          if (products && products.length > 0) {
            setData(normalizeProducts(products))
          }
        }
        setError(null)
      } catch (err) {
        console.warn('Supabase fetch error, using fallback data:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [categorySlug, currentId, limit])

  return { data, loading, error }
}

/**
 * Verifier si Supabase est configure
 */
export function isSupabaseEnabled() {
  return isSupabaseConfigured
}
