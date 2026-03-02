// Netlify Function - Check Newsletter Subscription Status
// Returns whether an email is subscribed to the newsletter

const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.SUPABASE_URL || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database not configured' })
    }
  }

  try {
    const { email } = JSON.parse(event.body || '{}')

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email required' })
      }
    }

    const supabase = createClient(process.env.SUPABASE_URL, supabaseKey)

    // Try to find subscriber - use maybeSingle to handle no rows case
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('id, status, first_name')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error) {
      console.error('Error checking subscriber:', error)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        subscribed: subscriber?.status === 'active',
        firstName: subscriber?.first_name || null
      })
    }

  } catch (err) {
    console.error('Check newsletter status error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' })
    }
  }
}
