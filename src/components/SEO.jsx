import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Le Coven de Diana'
const SITE_URL = 'https://covendediana.ch'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_DESCRIPTION = 'Blog litteraire de Diana - Explorez mes pensees, recits et inspirations. Fiction, poesie, reflexions et voyages a travers les mots.'

/**
 * Composant SEO pour gerer les meta tags dynamiques
 *
 * @param {Object} props
 * @param {string} props.title - Titre de la page (sera suffixe avec le nom du site)
 * @param {string} [props.description] - Description de la page
 * @param {string} [props.image] - URL de l'image pour les partages sociaux
 * @param {string} [props.url] - URL canonique de la page
 * @param {string} [props.type] - Type Open Graph (website, article, product)
 * @param {Object} [props.article] - Donnees specifiques pour les articles
 * @param {Object} [props.product] - Donnees specifiques pour les produits
 * @param {boolean} [props.noindex] - Si true, empeche l'indexation
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  article,
  product,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = url ? `${SITE_URL}${url}` : undefined

  return (
    <Helmet>
      {/* Balises de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Article specifique */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedAt} />
          {article.modifiedAt && (
            <meta property="article:modified_time" content={article.modifiedAt} />
          )}
          <meta property="article:author" content={article.author || 'Diana'} />
          {article.category && (
            <meta property="article:section" content={article.category} />
          )}
        </>
      )}

      {/* Product specifique */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content="EUR" />
          {product.availability && (
            <meta property="product:availability" content={product.availability} />
          )}
        </>
      )}
    </Helmet>
  )
}

// Export des constantes pour reutilisation
export { SITE_NAME, SITE_URL, DEFAULT_IMAGE, DEFAULT_DESCRIPTION }
