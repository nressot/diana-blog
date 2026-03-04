// Netlify Function - Notification de nouveau commentaire
// Envoie un email a Diana quand un nouveau commentaire est poste

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
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY')
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Email service not configured' })
    }
  }

  try {
    const {
      articleTitle,
      articleSlug,
      authorName,
      authorEmail,
      content,
      isReply = false,
      parentAuthor = null
    } = JSON.parse(event.body || '{}')

    // Validate required fields
    if (!articleTitle || !articleSlug || !authorName || !content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Champs requis manquants' })
      }
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Email destinataire (Diana)
    const recipientEmail = process.env.DIANA_EMAIL || 'diana@covendediana.ch'

    // URL de l'article
    const articleUrl = `https://covendediana.ch/article/${articleSlug}`

    // Construire le message
    const emailSubject = isReply
      ? `Nouvelle reponse sur "${articleTitle}"`
      : `Nouveau commentaire sur "${articleTitle}"`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4756b 0%, #c96a5d 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .comment-box { background: white; padding: 20px; border-left: 4px solid #d4756b; margin: 20px 0; border-radius: 4px; }
            .author { font-weight: bold; color: #d4756b; margin-bottom: 10px; }
            .email { color: #666; font-size: 14px; margin-bottom: 15px; }
            .comment-content { color: #333; line-height: 1.8; }
            .button { display: inline-block; background: #d4756b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">${emailSubject}</h1>
            </div>
            <div class="content">
              ${isReply ? `<p><strong>Reponse a un commentaire de ${parentAuthor}</strong></p>` : ''}
              <div class="comment-box">
                <div class="author">${authorName}</div>
                ${authorEmail ? `<div class="email">${authorEmail}</div>` : ''}
                <div class="comment-content">${content}</div>
              </div>
              <p>Article : <strong>${articleTitle}</strong></p>
              <a href="${articleUrl}" class="button">Voir le commentaire</a>
              <div class="footer">
                <p>Ceci est une notification automatique du blog Le Coven de Diana</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Diana <noreply@resend.dev>',
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Notification envoyee',
        emailId: data.id
      })
    }

  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur serveur',
        details: error.message
      })
    }
  }
}
