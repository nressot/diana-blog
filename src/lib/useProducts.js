/**
 * Hooks pour recuperer les produits depuis Sanity
 * Avec fallback vers les donnees statiques si Sanity n'est pas configure
 */

import { useState, useEffect } from 'react'
import { client, isSanityConfigured } from './sanity'

// Import des donnees statiques pour fallback
import {
  products as staticProducts,
  productCategories as staticProductCategories,
  featuredProducts as staticFeaturedProducts,
} from '../data/products'

// Sanity queries pour les produits (a creer dans le schema Sanity)
const productsQuery = `*[_type == "product"] | order(createdAt desc) {
  _id,
  title,
  slug,
  excerpt,
  description,
  "image": image.asset->url,
  "images": images[].asset->url,
  "category": category->name,
  "categoryColor": category->color,
  "categorySlug": category->slug.current,
  price,
  originalPrice,
  featured,
  inStock,
  createdAt
}`

const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  description,
  "image": image.asset->url,
  "images": images[].asset->url,
  "category": category->name,
  "categoryColor": category->color,
  "categorySlug": category->slug.current,
  price,
  originalPrice,
  featured,
  inStock,
  createdAt
}`

const featuredProductsQuery = `*[_type == "product" && featured == true] | order(createdAt desc) {
  _id,
  title,
  slug,
  excerpt,
  "image": image.asset->url,
  "category": category->name,
  "categoryColor": category->color,
  price,
  originalPrice,
  featured,
  inStock
}`

const productCategoriesQuery = `*[_type == "productCategory"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  color,
  "count": count(*[_type == "product" && references(^._id)])
}`

const relatedProductsQuery = `*[_type == "product" && category._ref == $categoryId && _id != $currentId][0...3] {
  _id,
  title,
  slug,
  excerpt,
  "image": image.asset->url,
  "category": category->name,
  "categoryColor": category->color,
  price,
  originalPrice,
  inStock
}`

/**
 * Normalise un produit Sanity vers le format attendu
 */
function normalizeProduct(product) {
  if (!product) return null
  return {
    id: product._id || product.id,
    title: product.title,
    slug: product.slug?.current || product.slug,
    excerpt: product.excerpt,
    description: product.description,
    image: product.image,
    images: product.images || [product.image],
    category: product.category,
    categoryColor: product.categoryColor || 'bg-neutral-400',
    categorySlug: product.categorySlug,
    price: product.price,
    originalPrice: product.originalPrice,
    featured: product.featured || false,
    inStock: product.inStock !== false,
    createdAt: product.createdAt,
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
    id: cat._id || cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color || 'bg-neutral-400',
    count: cat.count || 0,
  }))
}

/**
 * Hook generique pour les requetes Sanity avec fallback
 */
function useSanityWithFallback(query, params, fallbackData, normalizer = (x) => x) {
  const [data, setData] = useState(fallbackData)
  const [loading, setLoading] = useState(isSanityConfigured)
  const [error, setError] = useState(null)
  const [usingSanity, setUsingSanity] = useState(false)

  useEffect(() => {
    if (!isSanityConfigured) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await client.fetch(query, params)
        if (result && (Array.isArray(result) ? result.length > 0 : true)) {
          setData(normalizer(result))
          setUsingSanity(true)
        }
        setError(null)
      } catch (err) {
        console.warn('Sanity fetch error, using fallback data:', err.message)
        setError(err)
        // Garde les donnees de fallback
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, JSON.stringify(params)])

  return { data, loading, error, usingSanity }
}

/**
 * Recuperer tous les produits
 */
export function useProducts() {
  return useSanityWithFallback(
    productsQuery,
    {},
    staticProducts,
    normalizeProducts
  )
}

/**
 * Recuperer un produit par slug
 */
export function useProduct(slug) {
  const staticProduct = staticProducts.find((p) => p.slug === slug) || null

  const { data, loading, error, usingSanity } = useSanityWithFallback(
    productBySlugQuery,
    { slug },
    staticProduct,
    normalizeProduct
  )

  return { product: data, loading, error, usingSanity }
}

/**
 * Recuperer les produits mis en avant
 */
export function useFeaturedProducts() {
  return useSanityWithFallback(
    featuredProductsQuery,
    {},
    staticFeaturedProducts,
    normalizeProducts
  )
}

/**
 * Recuperer les categories de produits
 */
export function useProductCategories() {
  return useSanityWithFallback(
    productCategoriesQuery,
    {},
    staticProductCategories,
    normalizeProductCategories
  )
}

/**
 * Recuperer les produits lies (meme categorie)
 */
export function useRelatedProducts(categorySlug, currentId, limit = 3) {
  const staticRelated = staticProducts
    .filter((p) => p.id !== currentId && p.category.toLowerCase() === categorySlug?.toLowerCase())
    .slice(0, limit)

  // Pour le fallback, on utilise une logique simple basee sur la categorie
  const fallbackRelated = staticRelated.length > 0
    ? staticRelated
    : staticProducts.filter((p) => p.id !== currentId).slice(0, limit)

  return useSanityWithFallback(
    relatedProductsQuery,
    { categoryId: categorySlug, currentId },
    fallbackRelated,
    normalizeProducts
  )
}

/**
 * Verifier si Sanity est configure
 */
export function isSanityEnabled() {
  return isSanityConfigured
}
