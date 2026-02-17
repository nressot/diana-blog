import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Mail, ArrowRight, Loader2, XCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { clearCart } = useCart()

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Clear the cart after successful order
    clearCart()
  }, [clearCart])

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        // Fetch order details from our API
        const response = await fetch(`/api/get-order-details?session_id=${sessionId}`)

        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data)
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
        // Don't show error - just display generic confirmation
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Chargement de votre commande...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-600 to-emerald-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Merci pour votre commande !
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Votre commande a été confirmée et sera expédiée dans les plus brefs délais.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-16">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl shadow-lg overflow-hidden order-container"
          >
            {/* Confirmation Banner - Beige/Cream */}
            <div className="p-6 border-b order-banner">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 order-banner-icon">
                  <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold order-item-title">
                    Confirmation envoyée par email
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Vous recevrez un email de confirmation avec les détails de votre commande.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-8">
              {sessionId && (
                <div className="mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                    Numéro de référence
                  </p>
                  <p className="font-mono text-lg font-semibold order-item-title">
                    {sessionId.slice(-12).toUpperCase()}
                  </p>
                </div>
              )}

              {/* Order Details if available */}
              {orderDetails && (
                <div className="space-y-6">
                  {orderDetails.items && orderDetails.items.length > 0 && (
                    <div>
                      <h3 className="font-semibold order-item-title mb-4">
                        Articles commandés
                      </h3>
                      <div className="space-y-3">
                        {orderDetails.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-4 rounded-lg order-item-card"
                          >
                            <div>
                              <p className="font-medium order-item-title">
                                {item.description || item.name}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Quantité: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold order-item-title">
                              CHF {((item.amount_total || item.price) / 100).toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {orderDetails.total && (
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold order-item-title">
                          Total
                        </span>
                        <span className="font-bold text-primary-600">
                          CHF {(orderDetails.total / 100).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Next Steps */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold order-item-title mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  Prochaines étapes
                </h3>
                <ul className="space-y-3 order-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-sm font-medium text-primary-600 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Vous recevrez un email de confirmation dans quelques minutes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-sm font-medium text-primary-600 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Votre commande sera préparée sous 1-2 jours ouvrables.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-sm font-medium text-primary-600 flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Un email avec le suivi d'expédition vous sera envoyé lors de l'envoi.</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/boutique"
                  className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Continuer mes achats
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="flex-1 py-3 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl hover:bg-cream-100 dark:hover:bg-neutral-800 transition-colors text-center"
                >
                  Une question ?
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-neutral-500 dark:text-neutral-400">
              Besoin d'aide ? Contactez-nous à{' '}
              <a
                href="mailto:contact@diana-auteure.ch"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
              >
                contact@diana-auteure.ch
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Canceled order page component
export function OrderCanceled() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-neutral-950">
      <section className="relative py-20 bg-gradient-to-br from-neutral-600 to-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Commande annulée
            </h1>
            <p className="text-lg text-neutral-200 max-w-xl mx-auto">
              Votre commande a été annulée. Aucun paiement n'a été effectué.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Votre panier a été conservé. Vous pouvez reprendre votre commande à tout moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/boutique"
                className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Retourner à la boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="py-3 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl hover:bg-cream-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Besoin d'aide ?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
