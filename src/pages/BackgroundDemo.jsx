import { useParams, Link } from 'react-router-dom'
import { ArrowRight, BookOpen, PenLine, ArrowLeft } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import CategoryCard from '../components/CategoryCard'
import AuthorCard from '../components/AuthorCard'
import TypewriterEffect from '../components/TypewriterEffect'
import MonDernierLivre from '../components/MonDernierLivre'
import CssCat from '../components/CssCat'
import { useArticles, useCategories, useFeaturedArticles, useAuthor } from '../lib/useArticles'

/* Floating Stars Component - SVG stars animated */
function FloatingStars() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Etoile 4 branches */}
      <svg className="absolute w-5 h-5 text-primary-400/40 animate-float-slow" style={{ top: '15%', left: '8%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches */}
      <svg className="absolute w-6 h-6 text-primary-400/30 animate-float-medium" style={{ top: '25%', right: '12%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Etoile 4 branches petite */}
      <svg className="absolute w-4 h-4 text-primary-500/45 animate-float-fast" style={{ top: '60%', left: '15%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches grande */}
      <svg className="absolute w-7 h-7 text-primary-400/25 animate-float-slow" style={{ top: '40%', right: '20%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Point scintillant */}
      <svg className="absolute w-3 h-3 text-primary-500/50 animate-twinkle" style={{ top: '70%', right: '8%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      {/* Etoile 4 branches moyenne */}
      <svg className="absolute w-5 h-5 text-primary-400/35 animate-float-medium" style={{ top: '80%', left: '25%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches petite */}
      <svg className="absolute w-4 h-4 text-primary-500/40 animate-float-fast" style={{ top: '20%', left: '45%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Point scintillant 2 */}
      <svg className="absolute w-3 h-3 text-primary-500/45 animate-twinkle-delayed" style={{ top: '50%', left: '60%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      {/* Etoile 4 branches */}
      <svg className="absolute w-6 h-6 text-primary-400/30 animate-float-slow" style={{ top: '35%', left: '75%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches supplementaire */}
      <svg className="absolute w-5 h-5 text-primary-500/35 animate-float-medium" style={{ top: '10%', right: '35%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Point scintillant 3 */}
      <svg className="absolute w-2 h-2 text-primary-500/55 animate-twinkle" style={{ top: '85%', right: '40%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
    </div>
  )
}

const dynamicWords = ['restent', 'inspirent', 'touchent', 'marquent', 'resonnent']

const backgrounds = {
  '1': {
    class: 'bg-cream-50',
    name: 'V1 - Etoiles flottantes',
    description: 'Etoiles SVG animees sur fond neutre'
  },
  '2': {
    class: 'bg-stars-v2',
    name: 'V2 - Etoiles variees + points',
    description: 'Etoiles 4 et 6 branches avec petits points'
  },
  '3': {
    class: 'bg-stars-moon-v3',
    name: 'V3 - Etoiles + lune',
    description: 'Etoiles avec croissant de lune'
  },
  '4': {
    class: 'bg-stars-minimal-v4',
    name: 'V4 - Minimaliste',
    description: 'Tres subtil - points et etoiles rares'
  },
  '5': {
    class: 'bg-celestial-v5',
    name: 'V5 - Celeste complet',
    description: 'Etoiles variees, lune et points (style image reference)'
  }
}

export default function BackgroundDemo() {
  const { version } = useParams()
  const bg = backgrounds[version] || backgrounds['1']

  const { data: articles } = useArticles()
  const { data: categories } = useCategories()
  const { data: featuredArticles } = useFeaturedArticles()
  const { data: author } = useAuthor()

  const featured = featuredArticles?.[0] || articles?.[0]
  const recentArticles = articles?.slice(1, 4) || []
  const popularArticles = articles?.slice(0, 4) || []

  return (
    <div className={`min-h-screen ${bg.class} relative`}>
      {/* Floating Stars for V1 */}
      {version === '1' && <FloatingStars />}

      {/* Navigation entre les versions */}
      <div className="fixed top-20 left-4 z-50 bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 max-w-xs">
        <h3 className="font-bold text-sm mb-2">Demo Background</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">{bg.name}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-4">{bg.description}</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(backgrounds).map((v) => (
            <Link
              key={v}
              to={`/demo/bg/${v}`}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                v === version
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              V{v}
            </Link>
          ))}
        </div>
        <Link
          to="/"
          className="mt-4 flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour accueil
        </Link>
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="container-custom">
          <div className="max-w-4xl">
            <p className="text-primary-600 font-medium mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Blog Litteraire
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Des mots qui{' '}
              <span className="text-gradient">
                <TypewriterEffect words={dynamicWords} />
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl">
              Explorez mes reflexions sur la litterature, l'ecriture et la vie.
              Un espace de partage et de decouverte.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/blog"
                className="btn-outline-arrow inline-flex items-center gap-2 px-6 py-3 border border-neutral-900 dark:border-white rounded-full font-medium"
              >
                Decouvrir le blog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="pb-16 lg:pb-24">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-8">A la une</h2>
            <ArticleCard article={featured} variant="featured" />
          </div>
        </section>
      )}

      {/* Mon Dernier Livre */}
      <MonDernierLivre />

      {/* Recent Articles */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold">Articles recents</h2>
            <Link
              to="/blog"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-16 lg:py-24 bg-cream-200/50 dark:bg-neutral-900/50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-10 text-center">Explorer par categorie</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Author Section */}
      {author && (
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <AuthorCard author={author} variant="featured" />
          </div>
        </section>
      )}

      {/* Popular Articles Sidebar Style */}
      <section className="py-16 lg:py-24 bg-cream-200/50 dark:bg-neutral-900/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-8">Les plus lus</h2>
              <div className="space-y-6">
                {popularArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Categories populaires</h3>
              <div className="space-y-3">
                {categories?.slice(0, 5).map((category) => (
                  <Link
                    key={category.id}
                    to={`/categorie/${category.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-cream-50 dark:bg-neutral-800 hover:bg-cream-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-neutral-500">{category.count} articles</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 lg:py-14">
        <div className="container-custom">
          <div className="relative pt-12 md:pt-14 lg:pt-16">
            <CssCat className="absolute -top-1.5 right-6 md:right-8 lg:right-12 z-30" />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 p-8 lg:p-16 text-white">
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <PenLine className="w-12 h-12 mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
                  Restez connecte a mes ecrits
                </h2>
                <p className="text-primary-100 mb-8 text-lg">
                  Une newsletter mensuelle avec mes reflexions, nouveaux textes et decouvertes litteraires. Pas de spam, promis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="flex-1 h-14 px-6 rounded-full bg-white/15 border border-white/25 placeholder-white/60 focus:bg-white/25 focus:border-white/50 outline-none transition-all text-white"
                  />
                  <button className="h-14 px-8 rounded-full bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors shadow-lg">
                    S'abonner
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
              <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
