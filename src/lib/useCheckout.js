import { useState } from 'react'

export function useCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Checkout pour un seul produit (achat direct)
  const checkoutSingleProduct = async (product) => {
    setLoading(true)
    setError(null)

    try {
      const selectedFormat = product.selectedFormat || product.formats?.[0]
      const priceId = selectedFormat?.stripe_price_id || selectedFormat?.stripePriceId || product.stripe_price_id || product.stripePriceId

      if (!priceId) {
        // Fallback: utiliser price_data si pas de stripePriceId
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              id: product.id,
              productId: product.id,
              title: product.title,
              price: selectedFormat?.price || product.price,
              formatType: selectedFormat?.type,
              formatLabel: selectedFormat?.label,
              quantity: 1,
            }]
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erreur lors de la creation de la session de paiement')
        }

        const { url } = await response.json()
        if (url) {
          window.location.href = url
          return
        }
      }

      // Utiliser le price ID Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          singleProduct: {
            priceId: priceId,
            productId: product.id,
            productName: product.title,
            quantity: 1,
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la creation de la session de paiement')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }

    } catch (err) {
      setError(err.message)
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Checkout pour le panier complet
  const checkoutCart = async (cartItems) => {
    setLoading(true)
    setError(null)

    try {
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Votre panier est vide')
      }

      // Transformer les items du panier pour l'API
      const items = cartItems.map(item => {
        const product = item.product
        const selectedFormat = product.selectedFormat || product.formats?.[0]

        return {
          id: product.id,
          productId: product.id,
          title: product.title,
          price: selectedFormat?.price || product.price,
          stripePriceId: selectedFormat?.stripe_price_id || selectedFormat?.stripePriceId || product.stripe_price_id || product.stripePriceId,
          formatType: selectedFormat?.type,
          formatLabel: selectedFormat?.label,
          quantity: item.quantity,
        }
      })

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la creation de la session de paiement')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }

    } catch (err) {
      setError(err.message)
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Alias pour compatibilite
  const checkout = checkoutSingleProduct

  return {
    checkout,
    checkoutSingleProduct,
    checkoutCart,
    loading,
    error,
    clearError: () => setError(null)
  }
}
