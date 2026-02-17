import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  Loader2,
  ShoppingBag,
  ChevronRight,
  MapPin,
  Calendar,
  Truck,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function formatPrice(priceInCents) {
  if (!priceInCents) return 'CHF 0,00'
  const francs = (priceInCents / 100).toFixed(2).replace('.', ',')
  return `CHF ${francs}`
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function getStatusConfig(status) {
  switch (status) {
    case 'completed':
      return {
        label: 'Confirmée',
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        icon: CheckCircle
      }
    case 'shipped':
      return {
        label: 'Expédiée',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        icon: Truck
      }
    case 'delivered':
      return {
        label: 'Livrée',
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        icon: CheckCircle
      }
    case 'pending':
      return {
        label: 'En attente',
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        icon: Clock
      }
    case 'canceled':
      return {
        label: 'Annulée',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        icon: XCircle
      }
    case 'failed':
      return {
        label: 'Échouée',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        icon: AlertCircle
      }
    default:
      return {
        label: 'En cours',
        color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
        icon: Package
      }
  }
}

export default function Orders() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/get-user-orders?email=${encodeURIComponent(user.email)}`)

        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          setError('Erreur lors du chargement des commandes')
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Erreur lors du chargement des commandes')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchOrders()
    }
  }, [user, authLoading])

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Chargement de vos commandes...
          </p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-neutral-950">
        <div className="container-custom py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-cream-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-neutral-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Connectez-vous pour voir vos commandes
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Vous devez être connecté pour accéder à l'historique de vos commandes.
            </p>
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              Se connecter
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-neutral-950">
      {/* Header */}
      <section className="py-12 bg-cream-100 border-b border-neutral-200">
        <div className="container-custom">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
              <Package className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Mes commandes
              </h1>
              <p className="text-neutral-600">
                Retrouvez l'historique et le suivi de vos commandes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-cream-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Aucune commande pour le moment
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                Découvrez notre boutique et passez votre première commande !
              </p>
              <Link
                to="/boutique"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
              >
                Découvrir la boutique
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status)
                const StatusIcon = statusConfig.icon
                const isExpanded = expandedOrder === order.id

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-cream-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cream-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            Commande #{order.reference}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(order.created_at)}
                            </span>
                            <span>{order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {formatPrice(order.total)}
                        </span>
                        <ChevronRight className={`w-5 h-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {/* Order Details (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-neutral-200 dark:border-neutral-800">
                        {/* Items */}
                        <div className="p-6 bg-cream-50 dark:bg-neutral-800/30">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                            Articles commandes
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex justify-between items-center p-3 bg-white dark:bg-neutral-900 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-neutral-900 dark:text-white">
                                    {item.product_title}
                                  </p>
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.product_type === 'ebook' ? 'E-book' : 'Livre broche'} - Quantite: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold text-neutral-900 dark:text-white">
                                  {formatPrice(item.amount)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping & Tracking */}
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                          {/* Shipping Address */}
                          {order.shipping_address && (
                            <div>
                              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-600" />
                                Adresse de livraison
                              </h4>
                              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                <p className="font-medium text-neutral-900 dark:text-white">{order.shipping_address.name}</p>
                                <p>{order.shipping_address.line1}</p>
                                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                                <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                                <p>{order.shipping_address.country}</p>
                              </div>
                            </div>
                          )}

                          {/* Tracking */}
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                              <Truck className="w-4 h-4 text-primary-600" />
                              Suivi de livraison
                            </h4>
                            {order.tracking_number ? (
                              <div className="text-sm">
                                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                                  Numero de suivi: <span className="font-mono font-medium text-neutral-900 dark:text-white">{order.tracking_number}</span>
                                </p>
                                {order.tracking_url && (
                                  <a
                                    href={order.tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium"
                                  >
                                    Suivre mon colis
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {order.status === 'completed'
                                  ? 'Votre colis sera bientot expedie. Vous recevrez un email avec le numero de suivi.'
                                  : 'Informations de suivi non disponibles.'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 flex gap-3">
                          <Link
                            to="/contact"
                            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-cream-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            Une question ?
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
