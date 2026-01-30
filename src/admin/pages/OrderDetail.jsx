import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  ArrowLeft,
  Receipt,
  User,
  Mail,
  MapPin,
  Package,
  CreditCard,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    if (!supabase || !id) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount, currency = 'chf') => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-600 text-white">
            <CheckCircle size={16} />
            Paiement complete
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-amber-500 text-white">
            <Clock size={16} />
            En attente de paiement
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white">
            <XCircle size={16} />
            Paiement echoue
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white">
            <RefreshCw size={16} />
            Rembourse
          </span>
        )
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-500 text-white">
            <XCircle size={16} />
            Annule
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-400 text-white">
            {status}
          </span>
        )
    }
  }

  const formatAddress = (address) => {
    if (!address) return null
    const parts = [
      address.name,
      address.line1,
      address.line2,
      `${address.postal_code} ${address.city}`,
      address.country
    ].filter(Boolean)
    return parts
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Commande introuvable</h2>
        <p className="text-gray-500 mb-4">Cette commande n'existe pas ou a ete supprimee.</p>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft size={16} />
          Retour aux commandes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commande</h1>
            <p className="text-gray-500 text-sm font-mono">{order.id}</p>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product */}
          <div className="bg-cream-50 rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="p-5 bg-primary-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Produit commande</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{order.product_title}</h3>
                  {order.product_type && (
                    <span className="inline-block mt-1 px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full capitalize">
                      {order.product_type}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatPrice(order.amount, order.currency)}
                  </p>
                  <p className="text-sm text-neutral-500 uppercase">{order.currency}</p>
                </div>
              </div>
              {order.product_id && (
                <Link
                  to={`/admin/products/${order.product_id}`}
                  className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-700 text-sm"
                >
                  Voir le produit
                  <ExternalLink size={14} />
                </Link>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-cream-50 rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="p-5 bg-primary-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Client</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-900">{order.customer_name || 'Non renseigne'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-400" />
                <a
                  href={`mailto:${order.customer_email}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {order.customer_email}
                </a>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="bg-cream-50 rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="p-4 bg-neutral-100 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  <h3 className="font-medium text-neutral-900">Adresse de livraison</h3>
                </div>
              </div>
              <div className="p-4">
                {order.shipping_address ? (
                  <div className="space-y-1 text-neutral-700">
                    {formatAddress(order.shipping_address).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 italic">Non renseignee</p>
                )}
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-cream-50 rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="p-4 bg-neutral-100 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-neutral-500" />
                  <h3 className="font-medium text-neutral-900">Adresse de facturation</h3>
                </div>
              </div>
              <div className="p-4">
                {order.billing_address ? (
                  <div className="space-y-1 text-neutral-700">
                    {formatAddress(order.billing_address).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 italic">Non renseignee</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dates */}
          <div className="bg-cream-50 rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neutral-400" />
              Dates
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Creee le</span>
                <span className="text-neutral-900">{formatDate(order.created_at)}</span>
              </div>
              {order.updated_at !== order.created_at && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mise a jour</span>
                  <span className="text-neutral-900">{formatDate(order.updated_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stripe Info */}
          <div className="bg-cream-50 rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-neutral-400" />
              Stripe
            </h3>
            <div className="space-y-3 text-sm">
              {order.stripe_session_id && (
                <div>
                  <p className="text-neutral-500 mb-1">Session ID</p>
                  <p className="text-neutral-700 font-mono text-xs break-all">
                    {order.stripe_session_id}
                  </p>
                </div>
              )}
              {order.stripe_payment_intent && (
                <div>
                  <p className="text-neutral-500 mb-1">Payment Intent</p>
                  <p className="text-neutral-700 font-mono text-xs break-all">
                    {order.stripe_payment_intent}
                  </p>
                </div>
              )}
            </div>
            {order.stripe_payment_intent && (
              <a
                href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#635BFF] text-white rounded-lg hover:bg-[#5851DB] transition-colors text-sm w-full justify-center"
              >
                <ExternalLink size={16} />
                Voir sur Stripe
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="bg-cream-50 rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${order.customer_email}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Mail size={16} />
                Contacter le client
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
