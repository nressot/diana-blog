/**
 * Hooks pour recuperer les articles depuis Supabase
 * Avec fallback vers les donnees statiques si Supabase n'est pas configure
 */

import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// Import des donnees statiques pour fallback
import {
  articles as staticArticles,
  categories as staticCategories,
  author as staticAuthor,
} from '../data/articles'

/**
 * Normaliser un article Supabase vers le format attendu par les composants
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function normalizeArticle(article) {
  if (!article) return null
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    image: article.image_url,
    imagePosition: article.image_position || 'center',
    publishedAt: article.published_at,
    date: formatDate(article.published_at),
    readTime: article.read_time,
    featured: article.featured,
    // Flatten category to match static data format
    category: article.category?.name || null,
    categoryColor: article.category?.color || 'bg-neutral-300',
    categorySlug: article.category?.slug || null,
    categoryId: article.category?.id || null,
    author: article.author ? {
      id: article.author.id,
      name: article.author.name,
      avatar: article.author.avatar_url,
      role: article.author.role,
      bio: article.author.bio,
      stats: article.author.stats,
      social: article.author.social
    } : null
  }
}

/**
 * Recuperer tous les articles
 */
export function useSupabaseArticles() {
  const [data, setData] = useState(staticArticles)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchArticles = async () => {
      try {
        const { data: articles, error } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(id, name, slug, color),
            author:authors(id, name, avatar_url, role)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })

        if (error) throw error
        setData(articles.map(normalizeArticle))
      } catch (err) {
        console.warn('Supabase fetch error, using fallback:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return { data, loading, error }
}

/**
 * Recuperer un article par slug
 */
export function useSupabaseArticle(slug) {
  const staticArticle = staticArticles.find((a) => a.slug === slug) || null
  const [article, setArticle] = useState(staticArticle)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase || !slug) {
      setLoading(false)
      return
    }

    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(id, name, slug, color),
            author:authors(id, name, avatar_url, role, bio, stats, social)
          `)
          .eq('slug', slug)
          .single()

        if (error) throw error
        setArticle(normalizeArticle(data))
      } catch (err) {
        console.warn('Supabase fetch error, using fallback:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  return { article, loading, error }
}

/**
 * Recuperer l'article en vedette (un seul)
 */
export function useSupabaseFeaturedArticle() {
  const staticFeatured = staticArticles.find(a => a.featured) || staticArticles[0]
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase not configured, using static data')
      setData(staticFeatured ? [staticFeatured] : [])
      setLoading(false)
      return
    }

    const fetchFeatured = async () => {
      console.log('Fetching featured article from Supabase...')
      try {
        const { data: articles, error } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(id, name, slug, color),
            author:authors(id, name, avatar_url, role)
          `)
          .eq('status', 'published')
          .eq('featured', true)
          .limit(1)

        if (error) throw error
        console.log('Featured articles count:', articles?.length)
        console.log('Featured article from Supabase:', articles?.[0]?.title || 'AUCUN')

        if (articles && articles.length > 0) {
          setData(articles.map(normalizeArticle))
        } else {
          // Pas d'article en vedette, prendre le plus recent
          console.log('No featured article, fetching most recent...')
          const { data: recentArticles } = await supabase
            .from('articles')
            .select(`
              *,
              category:categories(id, name, slug, color),
              author:authors(id, name, avatar_url, role)
            `)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(1)

          if (recentArticles && recentArticles.length > 0) {
            console.log('Using most recent article:', recentArticles[0].title)
            setData(recentArticles.map(normalizeArticle))
          }
        }
      } catch (err) {
        console.warn('Supabase fetch error, using fallback:', err.message)
        setError(err)
        setData(staticFeatured ? [staticFeatured] : [])
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  return { data, loading, error }
}

/**
 * Recuperer les articles recents
 */
export function useSupabaseRecentArticles(limit = 4) {
  const [data, setData] = useState(staticArticles.slice(0, limit))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchRecent = async () => {
      try {
        const { data: articles, error } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(id, name, slug, color),
            author:authors(id, name, avatar_url, role)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit)

        if (error) throw error
        setData(articles.map(normalizeArticle))
      } catch (err) {
        console.warn('Supabase fetch error, using fallback:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecent()
  }, [limit])

  return { data, loading, error }
}

/**
 * Recuperer les categories
 */
export function useSupabaseCategories() {
  const [data, setData] = useState(staticCategories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchCategories = async () => {
      try {
        // Get categories with article count
        const { data: categories, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error

        // Get article counts per category
        const { data: counts } = await supabase
          .from('articles')
          .select('category_id')
          .eq('status', 'published')

        const countMap = {}
        counts?.forEach(a => {
          countMap[a.category_id] = (countMap[a.category_id] || 0) + 1
        })

        setData(categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          color: cat.color,
          description: cat.description,
          count: countMap[cat.id] || 0
        })))
      } catch (err) {
        console.warn('Supabase fetch error, using fallback:', err.message)
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
 * Recuperer l'auteur
 */
export function useSupabaseAuthor() {
  const [data, setData] = useState(staticAuthor)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchAuthor = async () => {
      try {
        const { data: author, error } = await supabase
          .from('authors')
          .select('*')
          .limit(1)
          .single()

        if (error) throw error
        setData({
          id: author.id,
          name: author.name,
          slug: author.slug,
          role: author.role,
          avatar: author.avatar_url,
          bio: author.bio,
          stats: author.stats,
          social: author.social
        })
      } catch (err) {
        console.warn('Supabase fetch error, using fallback:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [])

  return { data, loading, error }
}

/**
 * Recuperer les articles lies (meme categorie)
 */
export function useSupabaseRelatedArticles(categoryId, currentId, limit = 3) {
  const staticRelated = staticArticles.filter(a => a.id !== currentId).slice(0, limit)
  const [data, setData] = useState(staticRelated)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase || !categoryId) {
      setLoading(false)
      return
    }

    const fetchRelated = async () => {
      try {
        const { data: articles, error } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(id, name, slug, color),
            author:authors(id, name, avatar_url)
          `)
          .eq('status', 'published')
          .eq('category_id', categoryId)
          .neq('id', currentId)
          .limit(limit)

        if (error) throw error
        setData(articles.map(normalizeArticle))
      } catch (err) {
        console.warn('Supabase fetch error, using fallback:', err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [categoryId, currentId, limit])

  return { data, loading, error }
}
