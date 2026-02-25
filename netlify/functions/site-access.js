// Netlify Function - Site Access Control
// GET: Check if site is public
// POST: Verify password or make site public

const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
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

  // GET - Check site status
  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('is_public')
        .eq('id', 'main')
        .single()

      if (error) {
        // Si la table n'existe pas encore, considerer comme prive
        console.error('Error fetching site settings:', error)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ isPublic: false })
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ isPublic: data?.is_public || false })
      }
    } catch (err) {
      console.error('Error in site-access GET:', err)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ isPublic: false })
      }
    }
  }

  // POST - Verify password or make public
  if (event.httpMethod === 'POST') {
    try {
      const { password, action } = JSON.parse(event.body || '{}')

      if (!password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Mot de passe requis' })
        }
      }

      const viewerPassword = process.env.SITE_VIEWER_PASSWORD
      const adminPassword = process.env.SITE_ADMIN_PASSWORD

      if (!viewerPassword || !adminPassword) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Mots de passe non configures' })
        }
      }

      // Action: verify (just check password for viewing)
      if (action === 'verify') {
        if (password === viewerPassword || password === adminPassword) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, accessGranted: true })
          }
        }
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Mot de passe incorrect' })
        }
      }

      // Action: make_public (permanently disable protection)
      if (action === 'make_public') {
        if (password !== adminPassword) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Mot de passe admin incorrect' })
          }
        }

        // Update Supabase to make site public
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ is_public: true, updated_at: new Date().toISOString() })
          .eq('id', 'main')

        if (updateError) {
          console.error('Error updating site settings:', updateError)
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erreur lors de la mise a jour' })
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, isPublic: true })
        }
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Action invalide' })
      }
    } catch (err) {
      console.error('Error in site-access POST:', err)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erreur serveur' })
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}
