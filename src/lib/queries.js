// Queries GROQ pour Sanity

// Recuperer tous les articles
export const articlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  readTime,
  featured,
  "category": category->{
    _id,
    name,
    slug,
    color
  },
  "author": author->{
    _id,
    name,
    avatar,
    role
  }
}`

// Recuperer un article par slug
export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  content,
  image,
  publishedAt,
  readTime,
  featured,
  "category": category->{
    _id,
    name,
    slug,
    color
  },
  "author": author->{
    _id,
    name,
    avatar,
    role,
    bio,
    stats,
    social
  }
}`

// Recuperer les articles mis en avant
export const featuredArticlesQuery = `*[_type == "article" && featured == true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  readTime,
  featured,
  "category": category->{
    _id,
    name,
    slug,
    color
  },
  "author": author->{
    _id,
    name,
    avatar
  }
}`

// Recuperer les articles recents (limite)
export const recentArticlesQuery = `*[_type == "article"] | order(publishedAt desc)[0...$limit] {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  readTime,
  featured,
  "category": category->{
    _id,
    name,
    slug,
    color
  },
  "author": author->{
    _id,
    name,
    avatar
  }
}`

// Recuperer les articles par categorie
export const articlesByCategoryQuery = `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  readTime,
  featured,
  "category": category->{
    _id,
    name,
    slug,
    color
  },
  "author": author->{
    _id,
    name,
    avatar
  }
}`

// Recuperer les articles lies (meme categorie, excluant l'article actuel)
export const relatedArticlesQuery = `*[_type == "article" && category._ref == $categoryId && _id != $currentId] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  readTime,
  "category": category->{
    _id,
    name,
    slug,
    color
  }
}`

// Recuperer toutes les categories
export const categoriesQuery = `*[_type == "category"] | order(name asc) {
  _id,
  name,
  slug,
  color,
  description,
  "count": count(*[_type == "article" && references(^._id)])
}`

// Recuperer l'auteur principal
export const authorQuery = `*[_type == "author"][0] {
  _id,
  name,
  slug,
  role,
  avatar,
  bio,
  stats,
  social
}`

// Recuperer tous les slugs d'articles (pour SSG/ISR)
export const articleSlugsQuery = `*[_type == "article" && defined(slug.current)][].slug.current`

// Recuperer les commentaires d'un article
export const commentsQuery = `*[_type == "comment" && article._ref == $articleId] | order(createdAt desc) {
  _id,
  name,
  content,
  createdAt
}`

// Compter les commentaires d'un article
export const commentCountQuery = `count(*[_type == "comment" && article._ref == $articleId])`
