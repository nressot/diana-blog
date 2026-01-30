/**
 * Utilitaires pour la conversion de contenu entre Markdown et HTML
 * Utilises par l'editeur d'articles et l'affichage public
 */

/**
 * Convertit le Markdown basique en HTML pour TipTap
 * @param {string} markdown - Contenu en format Markdown
 * @returns {string} - Contenu en format HTML
 */
export function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') return ''

  // Si le contenu commence par une balise HTML, c'est probablement deja du HTML
  if (markdown.trim().startsWith('<')) {
    return markdown
  }

  let html = markdown

  // Convertir les titres (## Titre -> <h2>Titre</h2>)
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Convertir les separateurs
  html = html.replace(/^---$/gm, '<hr>')
  html = html.replace(/^\*\*\*$/gm, '<hr>')

  // Convertir les citations (> texte -> <blockquote>texte</blockquote>)
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

  // Convertir le gras (**texte** -> <strong>texte</strong>)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Convertir l'italique (*texte* -> <em>texte</em>)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Convertir les liens [texte](url) -> <a href="url">texte</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Convertir les listes non ordonnees
  // Trouver les blocs de listes et les convertir
  const lines = html.split('\n')
  const result = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isListItem = line.match(/^- (.+)$/)

    if (isListItem) {
      if (!inList) {
        result.push('<ul>')
        inList = true
      }
      result.push(`<li>${isListItem[1]}</li>`)
    } else {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      // Convertir les paragraphes (lignes non vides qui ne sont pas deja des balises)
      if (line.trim() && !line.trim().startsWith('<')) {
        result.push(`<p>${line}</p>`)
      } else if (line.trim()) {
        result.push(line)
      }
    }
  }

  if (inList) {
    result.push('</ul>')
  }

  // Nettoyer les paragraphes vides
  html = result.join('\n')
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>\s*<\/p>/g, '')

  // Fusionner les blockquotes consecutifs
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>')

  return html
}

/**
 * Detecte si le contenu est en format Markdown ou HTML
 * @param {string} content - Contenu a analyser
 * @returns {boolean} - true si c'est du Markdown
 */
export function isMarkdown(content) {
  if (!content || typeof content !== 'string') return false

  // Si ca commence par une balise HTML, c'est du HTML
  if (content.trim().startsWith('<')) return false

  // Indicateurs Markdown
  const markdownPatterns = [
    /^#{1,4} /m,        // Titres
    /^> /m,             // Citations
    /^- /m,             // Listes
    /\*\*[^*]+\*\*/,    // Gras
    /\*[^*]+\*/,        // Italique
    /\[.+\]\(.+\)/,     // Liens
    /^---$/m,           // Separateurs
  ]

  return markdownPatterns.some(pattern => pattern.test(content))
}

/**
 * Prepare le contenu pour l'editeur TipTap
 * Convertit automatiquement le Markdown en HTML si necessaire
 * @param {string} content - Contenu brut
 * @returns {string} - Contenu HTML pour TipTap
 */
export function prepareForEditor(content) {
  if (!content) return ''

  if (isMarkdown(content)) {
    return markdownToHtml(content)
  }

  return content
}
