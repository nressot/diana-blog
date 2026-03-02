// Netlify Function - Send Newsletter for New Article
// Triggered by Supabase Database Webhook when article is published

const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  // Verify webhook secret (optional but recommended)
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET
  if (webhookSecret) {
    const authHeader = event.headers['authorization'] || event.headers['Authorization']
    if (authHeader !== `Bearer ${webhookSecret}`) {
      console.error('Invalid webhook secret')
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) }
    }
  }

  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.SUPABASE_URL || !supabaseKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database not configured' }) }
  }

  if (!process.env.RESEND_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Email not configured' }) }
  }

  try {
    const payload = JSON.parse(event.body || '{}')

    // Supabase webhook payload structure
    const { type, table, record, old_record } = payload

    // Only process article inserts/updates
    if (table !== 'articles') {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'Not an article' }) }
    }

    const article = record

    // Check if article is published and newsletter not yet sent
    if (article.status !== 'published') {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'Article not published' }) }
    }

    if (article.newsletter_sent === true) {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'Newsletter already sent' }) }
    }

    // For updates, only send if status just changed to published
    if (type === 'UPDATE' && old_record?.status === 'published') {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'Already was published' }) }
    }

    const supabase = createClient(process.env.SUPABASE_URL, supabaseKey)
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>'
    const siteUrl = process.env.URL || 'https://le-coven-de-diana.netlify.app'

    // Get all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active')

    if (subError) {
      console.error('Error fetching subscribers:', subError)
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch subscribers' }) }
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers')
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'No subscribers' }) }
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers for article: ${article.title}`)

    // Build article URL
    const articleUrl = `${siteUrl}/article/${article.slug}`
    const articleImage = article.image || `${siteUrl}/og-image.jpg`

    // Send emails in batches (Resend has rate limits)
    const batchSize = 50
    let sentCount = 0
    let errorCount = 0

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)

      const emailPromises = batch.map(subscriber =>
        resend.emails.send({
          from: fromEmail,
          to: subscriber.email,
          subject: `Nouvel article : ${article.title} - Le Coven de Diana`,
          html: generateEmailHtml(article, articleUrl, articleImage, siteUrl)
        }).catch(err => {
          console.error(`Failed to send to ${subscriber.email}:`, err.message)
          errorCount++
          return null
        })
      )

      await Promise.all(emailPromises)
      sentCount += batch.length - errorCount

      // Small delay between batches to respect rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Mark article as newsletter sent
    const { error: updateError } = await supabase
      .from('articles')
      .update({ newsletter_sent: true, newsletter_sent_at: new Date().toISOString() })
      .eq('id', article.id)

    if (updateError) {
      console.error('Error updating article:', updateError)
    }

    // Notify Diana
    try {
      await resend.emails.send({
        from: fromEmail,
        to: 'diana@covendediana.ch',
        subject: `Newsletter envoyee : ${article.title}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Newsletter envoyee !</h2>
            <p><strong>Article :</strong> ${article.title}</p>
            <p><strong>Envoye a :</strong> ${sentCount} abonnes</p>
            ${errorCount > 0 ? `<p><strong>Erreurs :</strong> ${errorCount}</p>` : ''}
            <p><a href="${articleUrl}">Voir l'article</a></p>
          </div>
        `
      })
    } catch (err) {
      console.error('Failed to notify Diana:', err)
    }

    console.log(`Newsletter sent: ${sentCount} success, ${errorCount} errors`)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errorCount,
        article: article.title
      })
    }

  } catch (err) {
    console.error('Newsletter error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}

function generateEmailHtml(article, articleUrl, articleImage, siteUrl) {
  const excerpt = article.excerpt || article.content?.substring(0, 200) + '...' || ''
  const readTime = article.read_time || '5 min'
  const category = article.category_name || ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf9f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #1a1a1a; font-size: 24px; margin: 0; font-family: Georgia, serif;">Le Coven de Diana</h1>
      <p style="color: #999; margin-top: 8px; font-size: 14px;">Nouvel article</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <!-- Article Image -->
      <div style="width: 100%; height: 240px; background-color: #f0f0f0;">
        <img src="${articleImage}" alt="${article.title}" style="width: 100%; height: 240px; object-fit: cover; display: block;">
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        ${category ? `<span style="display: inline-block; background: #d4a574; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 16px;">${category}</span>` : ''}

        <h2 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px 0; line-height: 1.3;">
          ${article.title}
        </h2>

        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          ${excerpt}
        </p>

        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
          <span style="color: #999; font-size: 14px;">${readTime} de lecture</span>
        </div>

        <!-- CTA Button -->
        <a href="${articleUrl}" style="display: inline-block; background: #d4a574; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Lire l'article
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #999; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">Diana - Le Coven de Diana</p>
      <p style="margin: 0; font-size: 12px;">
        <a href="${siteUrl}" style="color: #d4a574; text-decoration: none;">Visiter le site</a>
      </p>
      <p style="margin: 16px 0 0 0; font-size: 11px; color: #bbb;">
        Vous recevez cet email car vous etes inscrit a la newsletter.
      </p>
    </div>
  </div>
</body>
</html>
  `
}
