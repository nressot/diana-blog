import { getAvatarColor, getInitials } from '../lib/avatarUtils'

/**
 * Formate une date en francais
 */
function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return ''
  }
}

export default function CommentCard({ comment }) {
  const initials = getInitials(comment.name)
  const avatarColor = getAvatarColor(comment.name)
  const formattedDate = formatDate(comment.createdAt)

  return (
    <div className="flex gap-4 p-4 bg-cream-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
      {/* Avatar */}
      {comment.avatarUrl ? (
        <img
          src={comment.avatarUrl}
          alt={comment.name}
          className="shrink-0 w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className={`shrink-0 w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center`}>
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold" style={{ color: '#1c1a17' }}>
            {comment.name}
          </span>
          <span className="text-xs text-neutral-500">
            {formattedDate}
          </span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#292524' }}>
          {comment.content}
        </p>
      </div>
    </div>
  )
}
