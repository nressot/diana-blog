/* eslint-disable no-undef */
// Serverless function for Vercel/Netlify
// Get orders for authenticated user

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.query

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    // Fetch orders for this email, grouped by session
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return res.status(500).json({ error: 'Failed to fetch orders' })
    }

    // Group orders by stripe_session_id
    const groupedOrders = orders.reduce((acc, order) => {
      const sessionId = order.stripe_session_id
      if (!acc[sessionId]) {
        acc[sessionId] = {
          id: sessionId,
          reference: sessionId.slice(-12).toUpperCase(),
          created_at: order.created_at,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          shipping_address: order.shipping_address,
          billing_address: order.billing_address,
          status: order.status,
          tracking_number: order.tracking_number,
          tracking_url: order.tracking_url,
          items: [],
          total: 0
        }
      }
      acc[sessionId].items.push({
        product_id: order.product_id,
        product_title: order.product_title,
        product_type: order.product_type,
        quantity: order.quantity,
        amount: order.amount
      })
      acc[sessionId].total += order.amount || 0
      return acc
    }, {})

    const ordersList = Object.values(groupedOrders)

    res.status(200).json({ orders: ordersList })
  } catch (err) {
    console.error('Error in get-user-orders:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
