import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-cream-200 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Politique de confidentialite</h1>
          <p className="text-neutral-600 max-w-2xl">
            Comment nous collectons, utilisons et protegeons vos donnees personnelles.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-neutral max-w-none">

            <p className="text-neutral-600 mb-6">
              Derniere mise a jour : Janvier 2026
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p className="text-neutral-600 mb-6">
              La protection de vos donnees personnelles est importante pour nous. Cette politique
              de confidentialite explique quelles informations nous collectons, comment nous les
              utilisons et quels sont vos droits, conformement a la nouvelle Loi federale suisse
              sur la protection des donnees (nLPD) et au Reglement general sur la protection des
              donnees (RGPD) pour les visiteurs de l'Union europeenne.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Responsable du traitement</h2>
            <p className="text-neutral-600 mb-6">
              Le responsable du traitement des donnees est :<br />
              Diana Pereira (Entreprise individuelle)<br />
              Place du Traite-de-Turin 3, 1226 Thonex, Suisse<br />
              Email : diana@covendediana.ch
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Donnees collectees</h2>
            <p className="text-neutral-600 mb-4">
              Nous collectons uniquement les donnees que vous nous fournissez volontairement :
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li>Nom et prenom (formulaire de contact)</li>
              <li>Adresse email (formulaire de contact, newsletter)</li>
              <li>Message (formulaire de contact)</li>
              <li>Informations de paiement (lors d'un achat, traitees par Stripe)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Utilisation des donnees</h2>
            <p className="text-neutral-600 mb-4">
              Vos donnees sont utilisees pour :
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li>Repondre a vos messages et demandes</li>
              <li>Vous envoyer la newsletter (si vous y etes inscrit)</li>
              <li>Traiter vos commandes et paiements</li>
              <li>Ameliorer notre site et nos services</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Partage des donnees</h2>
            <p className="text-neutral-600 mb-6">
              Nous ne vendons jamais vos donnees. Elles peuvent etre partagees avec :
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li><strong>Stripe</strong> : pour le traitement securise des paiements</li>
              <li><strong>Netlify</strong> : pour l'hebergement du site</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies</h2>
            <p className="text-neutral-600 mb-6">
              Notre site utilise des cookies techniques essentiels au fonctionnement du site.
              Nous n'utilisons pas de cookies publicitaires ou de suivi comportemental.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Securite</h2>
            <p className="text-neutral-600 mb-6">
              Nous mettons en oeuvre des mesures de securite appropriees pour proteger vos
              donnees contre tout acces non autorise, modification ou destruction.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Vos droits</h2>
            <p className="text-neutral-600 mb-4">
              Conformement a la nLPD suisse et au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li>Droit d'acces a vos donnees</li>
              <li>Droit de rectification</li>
              <li>Droit a l'effacement</li>
              <li>Droit a la portabilite</li>
              <li>Droit d'opposition</li>
              <li>Droit de retirer votre consentement a tout moment</li>
            </ul>
            <p className="text-neutral-600 mb-6">
              Pour exercer ces droits, contactez-nous via la page{' '}
              <Link to="/contact" className="text-primary-600 hover:underline">Contact</Link>{' '}
              ou par email a diana@covendediana.ch.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Conservation des donnees</h2>
            <p className="text-neutral-600 mb-6">
              Vos donnees sont conservees pendant la duree necessaire aux finalites pour
              lesquelles elles ont ete collectees, ou conformement aux obligations legales.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact</h2>
            <p className="text-neutral-600 mb-6">
              Pour toute question concernant cette politique de confidentialite,
              contactez-nous a : diana@covendediana.ch
            </p>

          </div>
        </div>
      </section>
    </div>
  )
}
