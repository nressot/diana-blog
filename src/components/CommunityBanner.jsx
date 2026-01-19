import { Mail, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function CommunityBanner() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="relative py-20 lg:py-28 bg-primary-600 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-700 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-400 rounded-full blur-2xl opacity-30" />

      <div className="container-custom relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rejoignez la communaute
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Recevez mes derniers articles, reflexions et inspirations litteraires
            directement dans votre boite mail. Pas de spam, que des mots choisis.
          </p>

          {submitted ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg font-medium">
                Merci de votre inscription !
              </p>
              <p className="text-white/70 text-sm mt-2">
                Vous recevrez bientot des nouvelles de ma plume.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group"
              >
                S'inscrire
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          <p className="text-sm text-white/50 mt-6">
            En vous inscrivant, vous acceptez de recevoir des emails occasionnels.
            Desabonnement possible a tout moment.
          </p>
        </div>
      </div>
    </section>
  )
}
