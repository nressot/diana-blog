// Netlify Function - Get User Orders
// Returns all orders for a given customer email

const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Supabase not configured' })
    }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { email } = event.queryStringParameters || {}

  if (!email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Email is required' })
    }
  }

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch orders' })
      }
    }

    // Group orders by stripe_session_id
    const groupedOrders = (orders || []).reduce((acc, order) => {
      const sessionId = order.stripe_session_id
      if (!acc[sessionId]) {
        acc[sessionId] = {
          id: sessionId,
          reference: sessionId ? sessionId.slice(-12).toUpperCase() : 'N/A',
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ orders: ordersList })
    }
  } catch (err) {
    console.error('Error in get-user-orders:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
