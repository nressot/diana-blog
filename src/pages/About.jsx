import { BookOpen, PenTool, Heart, Award } from 'lucide-react'
import AuthorCard from '../components/AuthorCard'
import { author } from '../data/articles'

export default function About() {
  const milestones = [
    {
      year: '2019',
      title: 'Premiers pas',
      description: 'Publication de mes premiers textes sur mon blog personnel.'
    },
    {
      year: '2020',
      title: 'Premier recueil',
      description: 'Sortie de "Murmures", mon premier recueil de poésie.'
    },
    {
      year: '2022',
      title: 'Reconnaissance',
      description: 'Prix de la nouvelle au concours littéraire de Genève.'
    },
    {
      year: '2024',
      title: 'Nouveau départ',
      description: 'Lancement de ce nouveau site et travail sur mon premier roman.'
    }
  ]

  const values = [
    {
      icon: PenTool,
      title: 'Authenticité',
      description: 'Chaque mot que j\'écris vient du cœur. Je crois en une écriture sincère qui touche l\'âme.'
    },
    {
      icon: BookOpen,
      title: 'Partage',
      description: 'La littérature prend vie quand elle est partagée. Ce blog est un espace d\'échange.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Écrire n\'est pas un métier pour moi, c\'est une vocation, une nécessité vitale.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Je travaille chaque texte jusqu\'a ce qu\'il atteigne sa forme la plus aboutie.'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-10 lg:py-14 bg-gradient-to-b from-cream-200 to-transparent dark:from-neutral-900/50 dark:to-transparent">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-semibold text-center mb-6">
              À propos de moi
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
              Découvrez mon parcours, ma passion pour l'écriture et ce qui m'inspire au quotidien.
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
              Mon histoire
            </h2>
            <div className="prose-content text-lg mx-auto">
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
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 lg:py-10 bg-cream-200 dark:bg-neutral-900/50">
        <div className="container-custom">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-12 text-center">
            Mes valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-cream-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600 dark:text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-8 lg:py-10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-12 text-center">
              Mon parcours
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
              Envie d'échanger ?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Je suis toujours heureuse de recevoir vos retours, vos questions ou simplement d'échanger sur notre passion commune pour les mots.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              Me contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
