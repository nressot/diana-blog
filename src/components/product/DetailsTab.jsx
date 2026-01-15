import { Book, Calendar, FileText, Globe, Clock, Building2 } from 'lucide-react'

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null

  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <Icon className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <dt className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-0.5">
          {label}
        </dt>
        <dd className="text-sm text-neutral-900 dark:text-neutral-100">
          {value}
        </dd>
      </div>
    </div>
  )
}

function formatDate(dateString) {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

function formatReadingTime(minutes) {
  if (!minutes) return null
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

export default function DetailsTab({ product }) {
  const { bookMeta, series, productType } = product || {}

  // Si pas de metadonnees livre
  if (!bookMeta && productType !== 'book' && productType !== 'ebook') {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500 dark:text-neutral-400">
          Aucun detail supplementaire disponible pour ce produit.
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Colonne gauche: Specs */}
      <div>
        <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
          Caracteristiques
        </h3>

        <dl>
          <DetailRow
            icon={FileText}
            label="ISBN"
            value={bookMeta?.isbn}
          />
          <DetailRow
            icon={Book}
            label="Pages"
            value={bookMeta?.pages ? `${bookMeta.pages} pages` : null}
          />
          <DetailRow
            icon={Book}
            label="Format"
            value={bookMeta?.format}
          />
          <DetailRow
            icon={Building2}
            label="Editeur"
            value={bookMeta?.publisher}
          />
          <DetailRow
            icon={Calendar}
            label="Date de publication"
            value={formatDate(bookMeta?.publicationDate)}
          />
          <DetailRow
            icon={Globe}
            label="Langue"
            value={bookMeta?.language}
          />
          <DetailRow
            icon={Clock}
            label="Temps de lecture"
            value={formatReadingTime(bookMeta?.readingTime)}
          />
        </dl>
      </div>

      {/* Colonne droite: Genres et serie */}
      <div className="space-y-6">
        {/* Genres */}
        {bookMeta?.genres?.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 text-neutral-900 dark:text-white">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {bookMeta.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1.5 bg-cream-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Serie */}
        {series && series.name && (
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30">
            <p className="text-xs uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
              Fait partie de la serie
            </p>
            <p className="font-semibold text-neutral-900 dark:text-white">
              {series.name}
            </p>
            {series.volume && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Tome {series.volume}
              </p>
            )}
          </div>
        )}

        {/* Type de produit */}
        <div className="p-4 bg-cream-100 dark:bg-neutral-800 rounded-xl">
          <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Type de produit
          </p>
          <p className="font-medium text-neutral-900 dark:text-white capitalize">
            {productType === 'book' && 'Livre papier'}
            {productType === 'ebook' && 'Livre numerique'}
            {productType === 'goodie' && 'Goodie / Accessoire'}
            {productType === 'bundle' && 'Pack / Bundle'}
            {!productType && 'Non specifie'}
          </p>
        </div>
      </div>
    </div>
  )
}
