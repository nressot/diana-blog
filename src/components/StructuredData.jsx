import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://le-coven-de-diana.netlify.app'
const SITE_NAME = 'Le Coven de Diana'
const AUTHOR_NAME = 'Diana'
const AUTHOR_IMAGE = `${SITE_URL}/author-avatar.jpg`

/**
 * Schema WebSite - pour le site global
 */
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Blog litteraire de Diana - Fiction, poesie, reflexions et voyages a travers les mots.',
    inLanguage: 'fr-FR',
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

/**
 * Schema Person - pour l'auteur Diana
 */
export function PersonSchema({ socialLinks = [] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: SITE_URL,
    image: AUTHOR_IMAGE,
    jobTitle: 'Ecrivaine & Blogueuse',
    description: 'Passionnee par les mots depuis toujours, je partage ici mes reflexions, mes recits et mes decouvertes litteraires.',
    sameAs: socialLinks.filter(Boolean)
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

/**
 * Schema BlogPosting - pour les articles de blog
 */
export function BlogPostingSchema({ article }) {
  if (!article) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || '',
    image: article.image || `${SITE_URL}/og-image.jpg`,
    datePublished: article.publishedAt || article.published_at,
    dateModified: article.updatedAt || article.updated_at || article.publishedAt || article.published_at,
    author: {
      '@type': 'Person',
      name: article.author?.name || AUTHOR_NAME,
      url: SITE_URL
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-principal-light.svg`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/article/${article.slug}`
    },
    articleSection: article.category?.name || 'Blog',
    wordCount: article.readTime ? article.readTime * 200 : undefined,
    inLanguage: 'fr-FR'
  }

  // Nettoyer les valeurs undefined
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) delete schema[key]
  })

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

/**
 * Schema Product - pour les produits de la boutique
 */
export function ProductSchema({ product, selectedFormat }) {
  if (!product) return null

  const price = selectedFormat?.price || product.price
  const priceInEuros = price ? (price / 100).toFixed(2) : '0.00'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.excerpt || product.description || '',
    image: product.image,
    url: `${SITE_URL}/boutique/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME
    },
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME
    },
    offers: {
      '@type': 'Offer',
      price: priceInEuros,
      priceCurrency: 'CHF',
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME
      }
    }
  }

  // Ajouter le type de livre si c'est un livre
  if (product.product_type === 'book' || product.book_meta) {
    schema['@type'] = 'Book'
    if (product.book_meta) {
      schema.numberOfPages = product.book_meta.pages
      schema.bookFormat = product.book_meta.format === 'ebook'
        ? 'https://schema.org/EBook'
        : 'https://schema.org/Paperback'
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

/**
 * Schema FAQPage - pour les pages avec FAQ
 */
export function FAQSchema({ items }) {
  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

/**
 * Schema BreadcrumbList - pour la navigation fil d'Ariane
 */
export function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

/**
 * Schema ItemList - pour les listes d'articles ou produits
 */
export function ItemListSchema({ items, type = 'Article' }) {
  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.slice(0, 10).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': type,
        name: item.title,
        url: type === 'Product'
          ? `${SITE_URL}/boutique/${item.slug}`
          : `${SITE_URL}/article/${item.slug}`,
        image: item.image
      }
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

export { SITE_URL, SITE_NAME, AUTHOR_NAME }
