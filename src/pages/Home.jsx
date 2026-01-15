import { ArrowRight, BookOpen, PenLine } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import CategoryCard from '../components/CategoryCard'
import AuthorCard from '../components/AuthorCard'
import TypewriterEffect from '../components/TypewriterEffect'
import MonDernierLivre from '../components/MonDernierLivre'
import CssCat from '../components/CssCat'
import { useArticles, useCategories, useFeaturedArticles, useAuthor } from '../lib/useArticles'

const dynamicWords = ['restent', 'inspirent', 'touchent', 'marquent', 'resonnent']

export default function Home() {
  // Fetch depuis Sanity avec fallback vers donnees statiques
  const { data: articles } = useArticles()
  const { data: categories } = useCategories()
  const { data: featuredArticles } = useFeaturedArticles()
  const { data: author } = useAuthor()
  return (
    <div className="bg-terracotta-pattern">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <div className="max-w-xl">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-tight">
                <span className="block">Des mots qui</span>
                <span className="block">voyagent,</span>
                <span className="block">des histoires qui</span>
                <span className="block text-primary-600 dark:text-primary-500 italic">
                  <TypewriterEffect
                    words={dynamicWords}
                    typingSpeed={120}
                    deletingSpeed={60}
                    pauseTime={2500}
                  />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                Bienvenue dans mon univers littéraire. Je suis {author?.name || 'Diana'}, et ici je partage mes réflexions, mes récits et mes découvertes au fil de la plume.
              </p>

              {/* CTA Buttons - style preserve, no navigation */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5" />
                  Lire mes articles
                </button>
                <button
                  type="button"
                  className="btn-outline-arrow inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-medium border hover:bg-cream-200 transition-colors cursor-pointer"
                  style={{ borderColor: '#1c1a17' }}
                >
                  Qui suis-je ?
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Ligne decorative */}
              <div className="relative mt-10 pt-8">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-300 via-neutral-300 dark:from-neutral-700 dark:via-neutral-700 via-70% to-transparent" />
              </div>
            </div>

            {/* Sketch illustration */}
            <div className="hidden lg:flex items-end justify-center translate-y-12">
              <img
                src="/hero-illustration.png"
                alt="Illustration livre et ampoule"
                className="w-full max-w-lg h-auto dark:opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticles?.[0] && (
        <section className="py-8 lg:py-12">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold">À la une</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">Ma dernière pensée</p>
              </div>
            </div>
            <ArticleCard article={featuredArticles[0]} variant="featured" disabled />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 lg:py-12 bg-cream-200/50 dark:bg-neutral-900/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold">Catégories</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">Explorez par thème</p>
            </div>
            <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
              Tout voir <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories || []).map((category) => (
              <CategoryCard key={category.id} category={category} disabled />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold">Derniers articles</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">Mes écrits les plus récents</p>
            </div>
            <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
              Tout voir <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(articles || []).slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} disabled />
            ))}
          </div>
        </div>
      </section>

      {/* Mon Dernier Livre Section */}
      <MonDernierLivre />

      {/* Author Section */}
      <section className="py-8 lg:py-12 bg-cream-200/50 dark:bg-neutral-900/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold">Qui je suis</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">Quelques mots sur moi</p>
              </div>
            </div>
            <div className="bg-cream-50 dark:bg-neutral-900 rounded-3xl p-8 lg:p-12 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <AuthorCard />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 lg:py-14">
        <div className="container-custom">
          <div className="relative pt-12 md:pt-14 lg:pt-16">
            {/* Chat CSS anime en haut a droite */}
            <CssCat className="absolute -top-1.5 right-6 md:right-8 lg:right-12 z-30" />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 p-8 lg:p-16 text-white">
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <PenLine className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
                Restez connecté à mes écrits
              </h2>
              <p className="text-primary-100 mb-8 text-lg">
                Une newsletter mensuelle avec mes réflexions, nouveaux textes et découvertes littéraires. Pas de spam, promis.
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
            {/* Decorative elements */}
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
