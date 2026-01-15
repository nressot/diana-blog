/**
 * Hooks pour recuperer les articles depuis Sanity
 * Avec fallback vers les donnees statiques si Sanity n'est pas configure
 */

import { useState, useEffect } from 'react'
import { client, isSanityConfigured } from './sanity'
import {
  articlesQuery,
  articleBySlugQuery,
  featuredArticlesQuery,
  recentArticlesQuery,
  categoriesQuery,
  authorQuery,
  relatedArticlesQuery,
} from './queries'
import {
  normalizeArticle,
  normalizeArticles,
  normalizeCategories,
  normalizeAuthor,
} from './dataAdapter'

// Import des donnees statiques pour fallback
import {
  articles as staticArticles,
  categories as staticCategories,
  author as staticAuthor,
  featuredArticles as staticFeaturedArticles,
} from '../data/articles'

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
 * Recuperer tous les articles
 */
export function useArticles() {
  return useSanityWithFallback(
    articlesQuery,
    {},
    staticArticles,
    normalizeArticles
  )
}

/**
 * Recuperer un article par slug
 */
export function useArticle(slug) {
  const staticArticle = staticArticles.find((a) => a.slug === slug) || null

  const { data, loading, error, usingSanity } = useSanityWithFallback(
    articleBySlugQuery,
    { slug },
    staticArticle,
    normalizeArticle
  )

  return { article: data, loading, error, usingSanity }
}

/**
 * Recuperer les articles mis en avant
 */
export function useFeaturedArticles() {
  return useSanityWithFallback(
    featuredArticlesQuery,
    {},
    staticFeaturedArticles,
    normalizeArticles
  )
}

/**
 * Recuperer les articles recents
 */
export function useRecentArticles(limit = 4) {
  return useSanityWithFallback(
    recentArticlesQuery,
    { limit },
    staticArticles.slice(0, limit),
    normalizeArticles
  )
}

/**
 * Recuperer les categories
 */
export function useCategories() {
  return useSanityWithFallback(
    categoriesQuery,
    {},
    staticCategories,
    normalizeCategories
  )
}

/**
 * Recuperer l'auteur
 */
export function useAuthor() {
  return useSanityWithFallback(
    authorQuery,
    {},
    staticAuthor,
    normalizeAuthor
  )
}

/**
 * Recuperer les articles lies
 */
export function useRelatedArticles(categoryId, currentId, limit = 3) {
  const staticRelated = staticArticles
    .filter((a) => a.id !== currentId)
    .slice(0, limit)

  return useSanityWithFallback(
    relatedArticlesQuery,
    { categoryId, currentId },
    staticRelated,
    normalizeArticles
  )
}

/**
 * Verifier si Sanity est configure
 */
export function isSanityEnabled() {
  return isSanityConfigured
}
