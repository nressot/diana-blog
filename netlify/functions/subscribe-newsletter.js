// Netlify Function - Newsletter Subscription
// Stores subscriber in Supabase and sends confirmation email via Resend

const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Check required environment variables
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.SUPABASE_URL || !supabaseKey) {
    console.error('Missing Supabase credentials')
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database not configured' })
    }
  }

  try {
    const { email, firstName } = JSON.parse(event.body || '{}')

    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email invalide' })
      }
    }

    const supabase = createClient(process.env.SUPABASE_URL, supabaseKey)

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Vous etes deja inscrit a la newsletter !'
          })
        }
      } else {
        // Reactivate subscription
        const updateData = {
          status: 'active',
          updated_at: new Date().toISOString()
        }
        if (firstName?.trim()) {
          updateData.first_name = firstName.trim()
        }
        await supabase
          .from('subscribers')
          .update(updateData)
          .eq('id', existing.id)
      }
    } else {
      // Insert new subscriber
      const subscriberData = {
        email: email.toLowerCase().trim(),
        status: 'active',
        source: 'website'
      }

      // Add first_name only if provided
      if (firstName?.trim()) {
        subscriberData.first_name = firstName.trim()
      }

      const { error: insertError } = await supabase
        .from('subscribers')
        .insert(subscriberData)

      if (insertError) {
        console.error('Error inserting subscriber:', insertError)
        // If first_name column doesn't exist, retry without it
        if (insertError.message?.includes('first_name')) {
          delete subscriberData.first_name
          const { error: retryError } = await supabase
            .from('subscribers')
            .insert(subscriberData)
          if (retryError) {
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ error: 'Erreur lors de l\'inscription' })
            }
          }
        } else {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erreur lors de l\'inscription' })
          }
        }
      }
    }

    // Send confirmation email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromEmail = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'

      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'Bienvenue dans ma newsletter ! - Le Coven de Diana',
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf9f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #1a1a1a; font-size: 28px; margin: 0; font-family: Georgia, serif;">Le Coven de Diana</h1>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: #d4a574; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 32px;">&#9993;</span>
        </div>
      </div>

      <h2 style="color: #1a1a1a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">Bienvenue${firstName ? ` ${firstName.trim()}` : ''} !</h2>
      <p style="color: #666; text-align: center; margin: 0 0 24px 0; line-height: 1.6;">
        Merci de vous etre inscrit${firstName ? 'e' : ''} a ma newsletter.<br>
        Vous recevrez desormais mes reflexions, nouveaux textes et decouvertes litteraires directement dans votre boite mail.
      </p>

      <div style="background: #faf9f6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #666; margin: 0; text-align: center; font-style: italic;">
          "Les mots sont des fenetres, ou bien ce sont des murs."
        </p>
      </div>

      <p style="color: #666; text-align: center; margin: 0 0 24px 0;">
        A tres bientot dans votre boite mail !
      </p>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://le-coven-de-diana.netlify.app/blog" style="display: inline-block; background: #d4a574; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Decouvrir le blog
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #999; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">Diana - Le Coven de Diana</p>
      <p style="margin: 0; font-size: 12px;">
        Vous recevez cet email car vous vous etes inscrit a la newsletter.
      </p>
    </div>
  </div>
</body>
</html>
          `
        })
        console.log('Confirmation email sent to:', email)
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't fail the subscription if email fails
      }

      // Notify Diana of new subscriber
      try {
        await resend.emails.send({
          from: fromEmail,
          to: 'diana@covendediana.ch',
          subject: 'Nouvel abonne a la newsletter !',
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf9f6; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 24px;">
    <h2 style="color: #1a1a1a; margin: 0 0 16px 0;">Nouvel abonne !</h2>
    <p style="color: #666; margin: 0;">
      ${firstName ? `<strong>Prenom :</strong> ${firstName.trim()}<br>` : ''}
      <strong>Email :</strong> ${email}<br>
      <strong>Date :</strong> ${new Date().toLocaleString('fr-CH')}
    </p>
  </div>
</body>
</html>
          `
        })
      } catch (notifyError) {
        console.error('Error notifying Diana:', notifyError)
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Inscription reussie ! Verifiez votre boite mail.'
      })
    }

  } catch (err) {
    console.error('Newsletter subscription error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur' })
    }
  }
}
