export default function DescriptionTab({ product }) {
  if (!product?.description) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400 italic">
        Aucune description disponible.
      </p>
    )
  }

  // Si description est un string (donnees statiques)
  if (typeof product.description === 'string') {
    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {product.description.split('\n\n').map((paragraph, index) => {
          // Detecter les listes
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n').filter(line => line.startsWith('- '))
            return (
              <ul key={index} className="list-disc list-inside space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-neutral-600 dark:text-neutral-400">
                    {item.replace('- ', '')}
                  </li>
                ))}
              </ul>
            )
          }

          // Paragraphe normal
          return (
            <p key={index} className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              {paragraph}
            </p>
          )
        })}
      </div>
    )
  }

  // Si description est un tableau (Portable Text de Sanity)
  // Pour l'instant on affiche un fallback simple
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-neutral-600 dark:text-neutral-400">
        {product.excerpt || 'Description non disponible.'}
      </p>
    </div>
  )
}
