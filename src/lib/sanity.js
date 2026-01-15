import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Verifier si Sanity est configure
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const isValidProjectId = projectId && /^[a-z0-9-]+$/.test(projectId)

// IMPORTANT: Remplace YOUR_PROJECT_ID par ton vrai project ID Sanity
// Creer le client seulement si le projectId est valide
export const client = isValidProjectId
  ? createClient({
      projectId,
      dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
      useCdn: true, // `false` pour donnees en temps reel
      apiVersion: '2024-01-01',
    })
  : null

// Exporter le statut de configuration
export const isSanityConfigured = isValidProjectId

// Image URL builder (seulement si client existe)
const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source) {
  if (!source || !builder) return null
  return builder.image(source)
}

// Helper pour formater les dates
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
