import { ArrowRight, User } from 'lucide-react'
import { authorData } from '../../data/products'

export default function AuthorSection({ author }) {
  // Utiliser les donnees passees ou les donnees par defaut
  const authorInfo = author || authorData

  if (!authorInfo) return null

  return (
    <section className="py-8 mt-2 border-t border-neutral-200">
      <h3 className="font-semibold text-lg mb-6 text-neutral-900">
        A propos de l'autrice
      </h3>

      <div className="flex items-start gap-5">
        {/* Avatar */}
        {authorInfo.avatar ? (
          <img
            src={authorInfo.avatar}
            alt={authorInfo.name}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-neutral-400" />
          </div>
        )}

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-lg text-neutral-900">
            {authorInfo.name}
          </h4>

          {authorInfo.role && (
            <p className="text-sm text-primary-600 mb-2">
              {authorInfo.role}
            </p>
          )}

          <p className="text-neutral-700 leading-relaxed text-sm">
            {authorInfo.shortBio || authorInfo.bio}
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
          >
            En savoir plus
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
