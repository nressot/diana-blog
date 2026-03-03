/**
 * Script de generation du sitemap.xml
 * Execute avant le build pour inclure tous les articles et produits
 *
 * Usage: node scripts/generate-sitemap.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SITE_URL = 'https://le-coven-de-diana.netlify.app'

// Pages statiques avec leurs priorites
const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/blog', changefreq: 'daily', priority: 0.9 },
  { path: '/boutique', changefreq: 'weekly', priority: 0.8 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.6 },
  { path: '/legal', changefreq: 'yearly', priority: 0.3 },
  { path: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { path: '/cgv', changefreq: 'yearly', priority: 0.3 },
]

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0]
  return new Date(date).toISOString().split('T')[0]
}

function generateUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function generateSitemap() {
  console.log('Generation du sitemap...')

  // Connexion a Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Variables Supabase non configurees, generation du sitemap statique uniquement')
    return generateStaticSitemap()
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Recuperer les articles publies
  let articles = []
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    articles = data || []
    console.log(`${articles.length} articles trouves`)
  } catch (err) {
    console.warn('Erreur recuperation articles:', err.message)
  }

  // Recuperer les produits en stock
  let products = []
  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    products = data || []
    console.log(`${products.length} produits trouves`)
  } catch (err) {
    console.warn('Erreur recuperation produits:', err.message)
  }

  // Generer le XML
  const urlEntries = []

  // Pages statiques
  for (const page of STATIC_PAGES) {
    urlEntries.push(generateUrlEntry(
      `${SITE_URL}${page.path}`,
      null,
      page.changefreq,
      page.priority
    ))
  }

  // Articles
  for (const article of articles) {
    urlEntries.push(generateUrlEntry(
      `${SITE_URL}/article/${article.slug}`,
      formatDate(article.updated_at || article.published_at),
      'weekly',
      0.8
    ))
  }

  // Produits
  for (const product of products) {
    urlEntries.push(generateUrlEntry(
      `${SITE_URL}/boutique/${product.slug}`,
      formatDate(product.updated_at),
      'weekly',
      0.7
    ))
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`

  // Ecrire le fichier
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml')
  writeFileSync(outputPath, sitemap, 'utf-8')

  console.log(`Sitemap genere: ${outputPath}`)
  console.log(`Total URLs: ${urlEntries.length}`)
}

function generateStaticSitemap() {
  const urlEntries = STATIC_PAGES.map(page =>
    generateUrlEntry(
      `${SITE_URL}${page.path}`,
      null,
      page.changefreq,
      page.priority
    )
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`

  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml')
  writeFileSync(outputPath, sitemap, 'utf-8')

  console.log(`Sitemap statique genere: ${outputPath}`)
  console.log(`Total URLs: ${urlEntries.length}`)
}

// Execution
generateSitemap().catch(err => {
  console.error('Erreur generation sitemap:', err)
  process.exit(1)
})
