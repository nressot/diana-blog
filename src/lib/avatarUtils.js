/**
 * Utilitaires pour les avatars - couleurs et initiales coherentes
 */

// Palette de couleurs unique pour tout le site
const AVATAR_COLORS = [
  'bg-primary-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-fuchsia-500',
  'bg-orange-500',
]

/**
 * Genere une couleur de fond basee sur le nom
 * Utilise un hash pour garantir la meme couleur pour le meme nom
 */
export function getAvatarColor(name) {
  if (!name) return 'bg-neutral-400'

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/**
 * Genere les initiales a partir d'un nom
 */
export function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
