import { useState } from 'react'
import { stripePromise } from './stripe'

export function useCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkout = async (product) => {
    setLoading(true)
    setError(null)

    try {
      // For now, simulate checkout or use Stripe Checkout links
      // In production, this would call your backend API

      // Option 1: Direct Stripe Checkout (if product has stripePriceId)
      if (product.stripePriceId) {
        const stripe = await stripePromise

        if (!stripe) {
          throw new Error('Stripe non configure. Veuillez configurer VITE_STRIPE_PUBLIC_KEY.')
        }

        // Call backend to create checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: product.stripePriceId,
            productId: product.id,
            productName: product.title,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erreur lors de la creation de la session de paiement')
        }

        const { url } = await response.json()

        // Redirect to Stripe Checkout
        if (url) {
          window.location.href = url
          return
        }
      }

      // Option 2: Fallback - show coming soon message
      alert('Le paiement sera disponible prochainement!')

    } catch (err) {
      setError(err.message)
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { checkout, loading, error }
}
