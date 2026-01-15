import { Link } from 'react-router-dom'
import { Twitter, Instagram, Linkedin } from 'lucide-react'
import { author } from '../data/articles'

export default function AuthorCard({ variant = 'default' }) {
  if (variant === 'sidebar') {
    return (
      <div className="bg-cream-200 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold">{author.name}</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{author.role}</p>
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          {author.bio}
        </p>
        <span className="text-sm font-medium text-neutral-400 cursor-not-allowed">
          En savoir plus
        </span>
      </div>
    )
  }

  // Full variant for about page
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
      <div className="shrink-0">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900"
        />
      </div>
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-2">{author.name}</h1>
        <p className="text-lg text-primary-600 dark:text-primary-500 mb-4">{author.role}</p>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6 max-w-2xl">
          {author.bio}
        </p>

        {/* Stats */}
        <div className="flex justify-center lg:justify-start gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{author.stats.articles}</div>
            <div className="text-sm text-neutral-500">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{author.stats.readers}</div>
            <div className="text-sm text-neutral-500">Lecteurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{author.stats.years}</div>
            <div className="text-sm text-neutral-500">Années</div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center lg:justify-start gap-3">
          <a
            href={author.social.twitter}
            className="w-10 h-10 rounded-full bg-cream-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={author.social.instagram}
            className="w-10 h-10 rounded-full bg-cream-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={author.social.linkedin}
            className="w-10 h-10 rounded-full bg-cream-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
