import { useBookSection } from '../lib/usePages'
import { PortableText } from '@portabletext/react'
import { urlFor } from '../lib/sanity'

// Description par defaut
const defaultDescription = [
  "Maxine, qui apres avoir neglige sa vie amoureuse a l'arrivee de sa fille, se lance dans une quete d'amour. Malgre les sites de rencontres, les soirees en boite de nuit et les rendez-vous arranges, elle ne trouve pas son prince charmant. Mais peut-etre n'a-t-elle pas regarde assez pres.",
  "Quant a Sasha et Jamie, ils se connaissent depuis leur enfance. Malheureusement, ils ont toujours rate le coche. Face aux difficultes que Jamie rencontre avec sa femme, oseront-ils passer la barriere entre l'amitie et l'amour ?",
  "L'histoire de deux femmes qui se soutiennent au quotidien, traversant des peripeties, de l'humour et surtout de l'amour."
]

// Verifier si c'est un format PortableText valide
function isValidPortableText(data) {
  if (!Array.isArray(data) || data.length === 0) return false
  // PortableText blocks doivent avoir _type defini
  return data.every(block => block && typeof block === 'object' && block._type)
}

export default function MonDernierLivre() {
  const { data: bookData } = useBookSection()

  const title = bookData?.title || 'Mon dernier livre'
  const description = bookData?.description
  const ctaText = bookData?.ctaText || 'Acheter'
  const ctaLink = bookData?.ctaLink || '#'

  // URLs des images - supporter les deux formats (URL directe ou reference Sanity)
  let bookCoverUrl = '/book-cover.png'
  let geometricShapeUrl = '/geometric-shape.png'

  // Verifier si c'est une URL directe ou une reference Sanity
  if (bookData?.bookCoverUrl) {
    // URL directe depuis Supabase
    bookCoverUrl = bookData.bookCoverUrl
  } else if (bookData?.bookCover) {
    // Reference Sanity (legacy)
    bookCoverUrl = urlFor(bookData.bookCover).width(280).url()
  }

  if (bookData?.geometricShapeUrl) {
    // URL directe depuis Supabase
    geometricShapeUrl = bookData.geometricShapeUrl
  } else if (bookData?.geometricShape) {
    // Reference Sanity (legacy)
    geometricShapeUrl = urlFor(bookData.geometricShape).width(330).url()
  }

  return (
    <section className="py-12 lg:py-20">
      <div className="container-custom">
        <div className="relative">
          {/* White container */}
          <div className="rounded-3xl p-7 lg:p-10 lg:pb-6 relative overflow-visible" style={{ backgroundColor: '#ffffff' }}>
            <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-center">
              {/* Left Content */}
              <div className="max-w-xl">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-5" style={{ color: '#000000' }}>
                  {title}
                </h2>

                <div className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-4 mb-6">
                  {description && isValidPortableText(description) ? (
                    <PortableText value={description} />
                  ) : description && Array.isArray(description) ? (
                    // Fallback pour les tableaux de strings (donnees statiques)
                    description.map((paragraph, index) => (
                      <p key={index}>{typeof paragraph === 'string' ? paragraph : ''}</p>
                    ))
                  ) : (
                    defaultDescription.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  )}
                </div>

                {/* CTA Button */}
                <a
                  href={ctaLink}
                  className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-primary-600/20"
                >
                  {ctaText}
                </a>
              </div>

              {/* Right - Empty space for images that overflow */}
              <div className="hidden lg:block" />
            </div>
          </div>

          {/* Images container - positioned to overflow */}
          <div className="hidden lg:block absolute right-8 xl:right-16 -top-10 w-[360px] h-[460px]">
            {/* Geometric shape - static, behind the book */}
            <img
              src={geometricShapeUrl}
              alt=""
              className="absolute top-12 left-0 w-[330px] rotate-[-3deg] z-0"
              aria-hidden="true"
            />

            {/* Book cover - floating animation, in front */}
            <img
              src={bookCoverUrl}
              alt={bookData?.bookTitle || title}
              className="absolute top-0 left-10 w-[280px] rotate-[4deg] z-10 animate-float"
            />
          </div>

          {/* Mobile image */}
          <div className="lg:hidden flex justify-center mt-8 relative">
            <div className="relative w-[220px] h-[320px]">
              <img
                src={geometricShapeUrl}
                alt=""
                className="absolute top-10 left-0 w-[200px] rotate-[-3deg] z-0"
                aria-hidden="true"
              />
              <img
                src={bookCoverUrl}
                alt={bookData?.bookTitle || title}
                className="absolute top-0 left-4 w-[180px] rotate-[4deg] z-10 animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
