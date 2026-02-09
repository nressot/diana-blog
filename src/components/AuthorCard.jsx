import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { author as defaultAuthor } from '../data/articles'

// Images pour l'animation de profil
const PROFILE_IMAGES = [
  null, // sera remplace par avatarUrl
  '/diana-portrait-2.webp'
]

// Hook pour l'animation de rotation d'images
function useImageRotation(images, interval = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return currentIndex
}

export default function AuthorCard({ variant = 'default', author: authorProp }) {
  // Utiliser l'auteur passe en prop ou le fallback par defaut
  const author = authorProp || defaultAuthor

  // Normaliser l'avatar (peut etre avatar ou avatar_url selon la source)
  const avatarUrl = author.avatar || author.avatar_url || '/author-avatar.png'

  if (variant === 'sidebar') {
    return (
      <div className="bg-cream-200 rounded-2xl p-6 border border-neutral-900">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={avatarUrl}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold">{author.name}</h4>
            <p className="text-sm text-neutral-500">{author.role || 'Auteur'}</p>
          </div>
        </div>
        <p className="text-sm text-neutral-600 mb-4">
          {author.bio || 'Contributeur du blog.'}
        </p>
        <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
          En savoir plus
        </button>
      </div>
    )
  }

  // Full variant for about page
  const stats = author.stats || { articles: 0, readers: '0', years: 0 }
  const social = author.social || {}

  // Construire la liste d'images avec l'avatar principal
  const profileImages = [avatarUrl, ...PROFILE_IMAGES.filter(Boolean)]
  const currentImageIndex = useImageRotation(profileImages, 4000)
  const currentImage = profileImages[currentImageIndex]

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
      <div className="shrink-0 relative w-48 h-48 lg:w-64 lg:h-64">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={author.name}
            className="absolute inset-0 w-full h-full rounded-full object-cover ring-4 ring-primary-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </div>
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-2">{author.name}</h1>
        <p className="text-lg text-primary-600 mb-4">{author.role || 'Auteur'}</p>
        <p className="text-neutral-600 text-lg mb-6 max-w-2xl">
          {author.bio || 'Contributeur du blog.'}
        </p>

        {/* Stats */}
        <div className="flex justify-center lg:justify-start gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.articles}</div>
            <div className="text-sm text-neutral-500">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.readers}</div>
            <div className="text-sm text-neutral-500">Lecteurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.years}</div>
            <div className="text-sm text-neutral-500">Annees</div>
          </div>
        </div>

        {/* Social Links */}
        {social.instagram && (
          <div className="flex justify-center lg:justify-start gap-3">
            <a
              href={social.instagram}
              className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
