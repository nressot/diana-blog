/**
 * Adaptateur de donnees - Normalise les donnees Sanity vers le format existant
 * Permet de garder les composants inchanges
 */

import { urlFor, formatDate } from './sanity'

/**
 * Transforme un article Sanity vers le format attendu par les composants
 */
export function normalizeArticle(sanityArticle) {
  if (!sanityArticle) return null

  return {
    id: sanityArticle._id,
    title: sanityArticle.title,
    slug: sanityArticle.slug?.current || sanityArticle.slug,
    excerpt: sanityArticle.excerpt,
    content: sanityArticle.content, // Portable Text (sera rendu separement)
    image: sanityArticle.image ? urlFor(sanityArticle.image).width(800).height(600).url() : null,
    category: sanityArticle.category?.name || 'Non classe',
    categoryColor: sanityArticle.category?.color || 'bg-neutral-500',
    categorySlug: sanityArticle.category?.slug?.current,
    date: formatDate(sanityArticle.publishedAt),
    readTime: sanityArticle.readTime || '5 min',
    views: sanityArticle.views || 0,
    comments: sanityArticle.comments || 0,
    featured: sanityArticle.featured || false,
    author: sanityArticle.author ? normalizeAuthor(sanityArticle.author) : null,
    // Garder les donnees brutes pour des cas specifiques
    _raw: sanityArticle,
  }
}

/**
 * Transforme un tableau d'articles Sanity
 */
export function normalizeArticles(sanityArticles) {
  if (!sanityArticles || !Array.isArray(sanityArticles)) return []
  return sanityArticles.map(normalizeArticle)
}

/**
 * Transforme un auteur Sanity vers le format attendu
 */
export function normalizeAuthor(sanityAuthor) {
  if (!sanityAuthor) return null

  return {
    id: sanityAuthor._id,
    name: sanityAuthor.name,
    slug: sanityAuthor.slug?.current,
    role: sanityAuthor.role || 'Auteur',
    bio: sanityAuthor.bio,
    avatar: sanityAuthor.avatar ? urlFor(sanityAuthor.avatar).width(400).height(400).url() : null,
    stats: sanityAuthor.stats || { articles: 0, readers: '0', years: 0 },
    social: sanityAuthor.social || {},
  }
}

/**
 * Transforme une categorie Sanity vers le format attendu
 */
export function normalizeCategory(sanityCategory) {
  if (!sanityCategory) return null

  return {
    id: sanityCategory._id,
    name: sanityCategory.name,
    slug: sanityCategory.slug?.current,
    color: sanityCategory.color || 'bg-neutral-500',
    description: sanityCategory.description,
    count: sanityCategory.count || 0,
  }
}

/**
 * Transforme un tableau de categories Sanity
 */
export function normalizeCategories(sanityCategories) {
  if (!sanityCategories || !Array.isArray(sanityCategories)) return []
  return sanityCategories.map(normalizeCategory)
}
