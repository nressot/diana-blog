import { useState } from 'react'
import { ArrowRight, BookOpen, PenLine, Loader2, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import CategoryCard from '../components/CategoryCard'
import AuthorCard from '../components/AuthorCard'
import TypewriterEffect from '../components/TypewriterEffect'
import MonDernierLivre from '../components/MonDernierLivre'
import CssCat from '../components/CssCat'
import { useSupabaseArticles, useSupabaseCategories, useSupabaseFeaturedArticle, useSupabaseAuthor } from '../lib/useSupabaseArticles'
import { useHomePage } from '../lib/usePages'

export default function Home() {
  // Fetch depuis Supabase avec fallback vers donnees statiques
  const { data: articles } = useSupabaseArticles()
  const { data: categories } = useSupabaseCategories()
  const { data: featuredArticles } = useSupabaseFeaturedArticle()
  const { data: author } = useSupabaseAuthor()
  const { data: pageContent } = useHomePage()

  // Newsletter state
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState(null)
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setNewsletterMessage('Veuillez entrer un email valide')
      return
    }

    setNewsletterLoading(true)
    setNewsletterMessage(null)

    try {
      const response = await fetch('/.netlify/functions/subscribe-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: firstName.trim() })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setNewsletterSuccess(true)
        setNewsletterMessage(data.message)
        setEmail('')
      } else {
        setNewsletterMessage(data.error || 'Erreur lors de l\'inscription')
      }
    } catch (err) {
      setNewsletterMessage('Erreur de connexion')
    } finally {
      setNewsletterLoading(false)
    }
  }

  // Extraire le contenu de la page avec valeurs par defaut
  const hero = pageContent?.hero || {}
  const sections = pageContent?.sections || {}
  const newsletter = pageContent?.newsletter || {}
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
                <span className="block">{hero.titleLine1 || 'Des mots qui'}</span>
                <span className="block">{hero.titleLine2 || 'voyagent,'}</span>
                <span className="block">{hero.titleLine3 || 'des histoires qui'}</span>
                <span className="block text-primary-600 dark:text-primary-500 italic">
                  <TypewriterEffect
                    words={hero.typewriterWords || ['restent', 'inspirent', 'touchent', 'marquent', 'resonnent']}
                    typingSpeed={120}
                    deletingSpeed={60}
                    pauseTime={2500}
                  />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                {hero.subtitle || `Bienvenue dans mon univers littéraire. Je suis ${author?.name || 'Diana'}, et ici je partage mes réflexions, mes récits et mes découvertes au fil de la plume.`}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={hero.primaryCta?.link || '/blog'}
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10"
                >
                  <BookOpen className="w-5 h-5" />
                  {hero.primaryCta?.text || 'Lire mes articles'}
                </Link>
                <Link
                  to={hero.secondaryCta?.link || '/about'}
                  className="btn-outline-arrow inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-medium border hover:bg-cream-200 transition-colors"
                  style={{ borderColor: '#1c1a17' }}
                >
                  {hero.secondaryCta?.text || 'Qui suis-je ?'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Ligne decorative */}
              <div className="relative mt-10 pt-8">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-300 via-neutral-300 dark:from-neutral-700 dark:via-neutral-700 via-70% to-transparent" />
              </div>
            </div>

            {/* Logo principal */}
            <div className="hidden lg:flex items-center justify-center">
              <img
                src="/guideline/assets/brand/logo-principal-dark.svg"
                alt="Logo Diana"
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
                <h2 className="text-2xl lg:text-3xl font-semibold">
                  {sections.featured?.title || 'A la une'}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">{sections.featured?.subtitle || 'Ma dernière pensée'}</p>
              </div>
            </div>
            <ArticleCard article={featuredArticles[0]} variant="featured" />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 lg:py-12 bg-cream-200/50 dark:bg-neutral-900/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold">
                {sections.categories?.title || 'Catégories'}
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">{sections.categories?.subtitle || 'Explorez par thème'}</p>
            </div>
            <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
              Tout voir <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories || []).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold">
                {sections.latestArticles?.title || 'Derniers articles'}
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">{sections.latestArticles?.subtitle || 'Mes écrits les plus récents'}</p>
            </div>
            <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
              Tout voir <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(articles || []).slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
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
                <h2 className="text-2xl lg:text-3xl font-semibold">
                  {sections.author?.title || 'Qui je suis'}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">{sections.author?.subtitle || 'Quelques mots sur moi'}</p>
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
                {newsletter.title || 'Restez connecté à mes écrits'}
              </h2>
              <p className="text-primary-100 mb-8 text-lg">
                {newsletter.description || 'Une newsletter mensuelle avec mes réflexions, nouveaux textes et découvertes littéraires. Pas de spam, promis.'}
              </p>
              {newsletterSuccess ? (
                <div className="flex items-center justify-center gap-3 text-white bg-white/20 rounded-full py-4 px-8 max-w-md mx-auto">
                  <Check className="w-6 h-6" />
                  <span className="font-medium">{newsletterMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 justify-center max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prenom"
                      className="sm:w-40 h-14 px-6 rounded-full bg-white/15 border border-white/25 placeholder-white/60 focus:bg-white/25 focus:border-white/50 outline-none transition-all text-white"
                      disabled={newsletterLoading}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={newsletter.placeholder || 'votre@email.com'}
                      className="flex-1 h-14 px-6 rounded-full bg-white/15 border border-white/25 placeholder-white/60 focus:bg-white/25 focus:border-white/50 outline-none transition-all text-white"
                      disabled={newsletterLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="h-14 px-8 rounded-full bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 sm:self-center"
                  >
                    {newsletterLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      newsletter.buttonText || 'S\'abonner'
                    )}
                  </button>
                </form>
              )}
              {newsletterMessage && !newsletterSuccess && (
                <p className="text-white/80 text-sm mt-3 text-center">{newsletterMessage}</p>
              )}
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
