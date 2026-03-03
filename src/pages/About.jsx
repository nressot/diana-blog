import { BookOpen, PenTool, Heart, Award, ArrowRight, Star, Lightbulb, Users, Globe } from 'lucide-react'
import AuthorCard from '../components/AuthorCard'
import SEO from '../components/SEO'
import { useAboutPage } from '../lib/usePages'
import { PortableText } from '@portabletext/react'

/* Floating Stars Component - adapted for light background */
function FloatingStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Etoiles cote gauche */}
      <svg className="absolute w-5 h-5 text-primary-400/40 animate-float-slow" style={{ top: '15%', left: '8%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      <svg className="absolute w-4 h-4 text-primary-400/45 animate-float-fast" style={{ top: '60%', left: '15%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      <svg className="absolute w-5 h-5 text-primary-400/35 animate-float-medium" style={{ top: '80%', left: '25%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      <svg className="absolute w-6 h-6 text-primary-500/35 animate-float-medium" style={{ top: '5%', left: '3%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-5 h-5 text-primary-500/30 animate-float-slow" style={{ top: '35%', left: '5%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-7 h-7 text-primary-500/25 animate-float-medium" style={{ top: '55%', left: '2%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-4 h-4 text-primary-500/40 animate-float-fast" style={{ top: '90%', left: '10%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-3 h-3 text-primary-600/50 animate-twinkle" style={{ top: '25%', left: '12%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      <svg className="absolute w-3 h-3 text-primary-600/45 animate-twinkle-delayed" style={{ top: '45%', left: '18%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      <svg className="absolute w-2 h-2 text-primary-500/55 animate-twinkle" style={{ top: '72%', left: '6%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      <svg className="absolute w-3 h-3 text-primary-400/50 animate-twinkle-delayed" style={{ top: '88%', left: '20%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>

      {/* Etoiles cote droit */}
      <svg className="absolute w-6 h-6 text-primary-500/30 animate-float-medium" style={{ top: '25%', right: '12%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-7 h-7 text-primary-500/25 animate-float-slow" style={{ top: '40%', right: '20%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-3 h-3 text-primary-600/50 animate-twinkle" style={{ top: '70%', right: '8%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      <svg className="absolute w-4 h-4 text-primary-500/40 animate-float-fast" style={{ top: '20%', left: '45%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-3 h-3 text-primary-400/45 animate-twinkle-delayed" style={{ top: '50%', left: '60%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>

      {/* Croissants de lune */}
      <svg className="absolute w-10 h-10 text-primary-500/40 animate-float-slow" style={{ top: '8%', right: '10%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="absolute w-9 h-9 text-primary-500/40 animate-float-medium" style={{ top: '15%', right: '25%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </div>
  )
}

// Map des icones pour les valeurs
const iconMap = {
  PenTool,
  BookOpen,
  Heart,
  Award,
  Star,
  Lightbulb,
  Users,
  Globe
}

// Valeurs par defaut (fallback)
const defaultMilestones = [
  { year: '2019', title: 'Premiers pas', description: 'Publication de mes premiers textes sur mon blog personnel.' },
  { year: '2020', title: 'Premier recueil', description: 'Sortie de "Murmures", mon premier recueil de poesie.' },
  { year: '2022', title: 'Reconnaissance', description: 'Prix de la nouvelle au concours litteraire de Geneve.' },
  { year: '2024', title: 'Nouveau depart', description: 'Lancement de ce nouveau site et travail sur mon premier roman.' }
]

const defaultValues = [
  { icon: 'PenTool', title: 'Authenticite', description: 'Chaque mot que j\'ecris vient du coeur. Je crois en une ecriture sincere qui touche l\'ame.' },
  { icon: 'BookOpen', title: 'Partage', description: 'La litterature prend vie quand elle est partagee. Ce blog est un espace d\'echange.' },
  { icon: 'Heart', title: 'Passion', description: 'Ecrire n\'est pas un metier pour moi, c\'est une vocation, une necessite vitale.' },
  { icon: 'Award', title: 'Excellence', description: 'Je travaille chaque texte jusqu\'a ce qu\'il atteigne sa forme la plus aboutie.' }
]

export default function About() {
  const { data: pageContent } = useAboutPage()

  // Extraire le contenu avec fallback
  const hero = pageContent?.hero || { title: 'A propos de moi', subtitle: 'Decouvrez mon parcours, ma passion pour l\'ecriture et ce qui m\'inspire au quotidien.' }
  const story = pageContent?.story || { title: 'Mon histoire', paragraphs: null }
  const valuesSection = pageContent?.valuesSection || { title: 'Mes valeurs', values: defaultValues }
  const milestonesSection = pageContent?.milestonesSection || { title: 'Mon parcours', milestones: defaultMilestones }
  const cta = pageContent?.cta || { title: 'Envie d\'echanger ?', description: 'Je suis toujours heureuse de recevoir vos retours, vos questions ou simplement d\'echanger sur notre passion commune pour les mots.', buttonText: 'Me contacter', buttonLink: '/contact' }

  const values = valuesSection.values || defaultValues
  const milestones = milestonesSection.milestones || defaultMilestones

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SEO
        title="A propos"
        description="Decouvrez Diana, ecrivaine et blogueuse passionnee. Son parcours, ses valeurs et sa passion pour les mots et la litterature."
        url="/about"
      />
      <FloatingStars />
      {/* Hero Section */}
      <section className="py-10 lg:py-14 bg-gradient-to-b from-cream-200 to-transparent dark:from-neutral-900/50 dark:to-transparent">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-semibold text-center mb-6">
              {hero.title}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
            <AuthorCard />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-8 lg:py-10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-center">
              {story.title}
            </h2>
            <div className="prose-content text-lg mx-auto">
              {story.paragraphs && Array.isArray(story.paragraphs) && story.paragraphs.length > 0 ? (
                typeof story.paragraphs[0] === 'string' ? (
                  story.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <PortableText value={story.paragraphs} />
                )
              ) : (
                <>
                  <p>
                    Depuis mon enfance, les mots ont été mes compagnons les plus fidèles. Je me souviens encore de ces après-midi passés à la bibliothèque municipale, perdue dans des mondes imaginaires, rêvant déjà d'en créer les miens.
                  </p>
                  <p>
                    Après des études de lettres modernes à l'université, j'ai d'abord travaillé dans l'édition, ce qui m'a permis de découvrir les coulisses de la création littéraire. Mais l'appel de l'écriture était trop fort.
                  </p>
                  <p>
                    En 2019, j'ai fait le grand saut : j'ai quitté mon emploi pour me consacrer pleinement à ma passion. Ce blog est né de cette décision, comme un espace de liberté où je peux explorer toutes les facettes de l'écriture.
                  </p>
                  <p>
                    Aujourd'hui, je partage mon temps entre l'écriture de fiction, la poésie et ces réflexions que je vous livre ici. Chaque texte est une invitation au voyage, une porte ouverte sur l'imaginaire.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 lg:py-10 bg-cream-200 dark:bg-neutral-900/50">
        <div className="container-custom">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-12 text-center">
            {valuesSection.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = iconMap[value.icon] || PenTool
              return (
                <div
                  key={index}
                  className="bg-cream-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-primary-600 dark:text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-8 lg:py-10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-12 text-center">
              {milestonesSection.title}
            </h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="shrink-0 w-20 text-right">
                    <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                  </div>
                  <div className="relative pb-8 border-l-2 border-neutral-200 dark:border-neutral-700 pl-6">
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-primary-600 -translate-x-[7px]" />
                    <h3 className="font-semibold text-lg mb-1">{milestone.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 lg:py-10 bg-cream-200 dark:bg-neutral-900/50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
              {cta.title}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              {cta.description}
            </p>
            <a
              href={cta.buttonLink || '/contact'}
              className="btn-outline-arrow inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-medium border hover:bg-cream-200 transition-colors"
              style={{ borderColor: '#1c1a17' }}
            >
              {cta.buttonText}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
