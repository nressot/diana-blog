import { Link } from 'react-router-dom'

export default function Legal() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-cream-200 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Mentions legales</h1>
          <p className="text-neutral-600 max-w-2xl">
            Informations legales concernant ce site web.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-neutral max-w-none">

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Editeur du site</h2>
            <p className="text-neutral-600 mb-4">
              Ce site est edite par Diana Pereira, ecrivaine independante.
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li>Nom : Diana Pereira</li>
              <li>Localisation : Geneve, Suisse</li>
              <li>Email : diana@covendediana.ch</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Hebergement</h2>
            <p className="text-neutral-600 mb-6">
              Ce site est heberge par Netlify, Inc.<br />
              Adresse : 2325 3rd Street, Suite 296, San Francisco, California 94107, USA<br />
              Site web : <a href="https://www.netlify.com" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.netlify.com</a>
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Propriete intellectuelle</h2>
            <p className="text-neutral-600 mb-6">
              L'ensemble du contenu de ce site (textes, images, illustrations, photographies)
              est protege par le droit d'auteur. Toute reproduction, meme partielle, est
              interdite sans autorisation prealable de l'auteure.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Donnees personnelles</h2>
            <p className="text-neutral-600 mb-6">
              Les informations collectees via les formulaires de contact sont utilisees
              uniquement pour repondre a vos demandes. Elles ne sont jamais transmises
              a des tiers. Pour plus d'informations, consultez notre{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">
                politique de confidentialite
              </Link>.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Cookies</h2>
            <p className="text-neutral-600 mb-6">
              Ce site utilise des cookies techniques necessaires a son bon fonctionnement.
              Aucun cookie publicitaire ou de tracking n'est utilise.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Responsabilite</h2>
            <p className="text-neutral-600 mb-6">
              L'auteure s'efforce d'assurer l'exactitude des informations diffusees sur ce site,
              mais ne peut garantir leur exhaustivite. Elle decline toute responsabilite en cas
              d'erreur ou d'omission.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact</h2>
            <p className="text-neutral-600 mb-6">
              Pour toute question concernant ces mentions legales, vous pouvez nous contacter via
              la page <Link to="/contact" className="text-primary-600 hover:underline">Contact</Link>.
            </p>

          </div>
        </div>
      </section>
    </div>
  )
}
