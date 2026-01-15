import { formatDate } from '../lib/sanity'

/**
 * Genere les initiales a partir d'un nom
 */
function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Genere une couleur de fond basee sur le nom
 */
function getAvatarColor(name) {
  if (!name) return 'bg-neutral-400'

  const colors = [
    'bg-primary-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-cyan-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-orange-500',
  ]

  // Hash simple du nom pour obtenir un index de couleur
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export default function CommentCard({ comment }) {
  const initials = getInitials(comment.name)
  const avatarColor = getAvatarColor(comment.name)
  const formattedDate = formatDate(comment.createdAt)

  return (
    <div className="flex gap-4 p-4 bg-cream-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
      {/* Avatar */}
      <div className={`shrink-0 w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center`}>
        <span className="text-white text-sm font-semibold">{initials}</span>
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {comment.name}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {formattedDate}
          </span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  )
}
