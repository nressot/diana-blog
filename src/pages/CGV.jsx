import { Link } from 'react-router-dom'

export default function CGV() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-cream-200 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Conditions Generales de Vente</h1>
          <p className="text-neutral-600 max-w-2xl">
            Conditions applicables aux achats effectues sur ce site.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-neutral max-w-none">

            <p className="text-neutral-600 mb-6">
              Derniere mise a jour : Mars 2026
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Identification du vendeur</h2>
            <p className="text-neutral-600 mb-4">
              Les presentes conditions generales de vente s'appliquent a toutes les ventes
              conclues sur le site Le Coven de Diana.
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li><strong>Vendeur :</strong> Diana Pereira</li>
              <li><strong>Forme juridique :</strong> Entreprise individuelle</li>
              <li><strong>Adresse :</strong> Rue du Rhone 42, 1204 Geneve, Suisse</li>
              <li><strong>Email :</strong> diana@covendediana.ch</li>
              <li><strong>Telephone :</strong> +41 22 000 00 00</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Objet</h2>
            <p className="text-neutral-600 mb-6">
              Les presentes CGV regissent les ventes de produits (livres, ebooks, et autres
              produits derives) proposes sur le site le-coven-de-diana.netlify.app.
              Toute commande implique l'acceptation sans reserve des presentes conditions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Produits</h2>
            <p className="text-neutral-600 mb-6">
              Les produits proposes sont decrits avec la plus grande exactitude possible.
              Les photographies illustrant les produits n'entrent pas dans le champ contractuel.
              En cas d'erreur manifeste entre les caracteristiques du produit et sa representation,
              le vendeur ne saurait voir sa responsabilite engagee.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Prix</h2>
            <p className="text-neutral-600 mb-4">
              Les prix sont indiques en francs suisses (CHF), toutes taxes comprises.
              Le vendeur se reserve le droit de modifier ses prix a tout moment.
              Les produits sont factures sur la base des tarifs en vigueur au moment de la commande.
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li>Devise : CHF (Franc suisse)</li>
              <li>TVA incluse dans les prix affiches</li>
              <li>Frais de livraison indiques lors de la commande</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Commande</h2>
            <p className="text-neutral-600 mb-6">
              L'acheteur peut passer commande sur le site internet. La commande n'est definitive
              qu'apres confirmation du paiement. Un email de confirmation est envoye a l'acheteur
              des reception du paiement.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Paiement</h2>
            <p className="text-neutral-600 mb-4">
              Le paiement s'effectue en ligne de maniere securisee via notre prestataire Stripe.
              Les moyens de paiement acceptes sont :
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li>Cartes bancaires (Visa, Mastercard, American Express)</li>
              <li>TWINT</li>
            </ul>
            <p className="text-neutral-600 mb-6">
              Le paiement est exigible immediatement a la commande. Les donnees de paiement
              sont transmises de maniere cryptee et ne sont pas stockees sur nos serveurs.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Livraison</h2>
            <p className="text-neutral-600 mb-4">
              Les produits sont livres a l'adresse indiquee par l'acheteur lors de la commande.
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li><strong>Produits physiques :</strong> Livraison sous 3 a 7 jours ouvrables</li>
              <li><strong>Produits numeriques (ebooks) :</strong> Telechargement immediat apres paiement</li>
              <li><strong>Zones de livraison :</strong> Suisse, France, Belgique, Luxembourg, Monaco</li>
              <li><strong>Livraison gratuite :</strong> Des CHF 35 d'achat pour la Suisse</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Droit de retractation</h2>
            <p className="text-neutral-600 mb-4">
              Conformement au droit suisse et europeen, l'acheteur dispose d'un delai de 14 jours
              a compter de la reception du produit pour exercer son droit de retractation,
              sans avoir a justifier de motifs.
            </p>
            <p className="text-neutral-600 mb-4">
              <strong>Exceptions :</strong> Le droit de retractation ne s'applique pas aux :
            </p>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li>Contenus numeriques (ebooks) des lors que le telechargement a commence</li>
              <li>Produits personnalises ou confectionnes sur mesure</li>
              <li>Produits descelles apres livraison</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Retours et remboursements</h2>
            <p className="text-neutral-600 mb-6">
              En cas de retractation, les produits doivent etre retournes dans leur etat d'origine,
              non utilises et dans leur emballage d'origine. Les frais de retour sont a la charge
              de l'acheteur. Le remboursement intervient dans les 14 jours suivant la reception
              du produit retourne, par le meme moyen de paiement que celui utilise pour la commande.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Garantie</h2>
            <p className="text-neutral-600 mb-6">
              Les produits beneficient de la garantie legale de conformite et de la garantie
              contre les vices caches. En cas de defaut de conformite, l'acheteur peut demander
              le remplacement ou le remboursement du produit dans un delai de 2 ans a compter
              de la livraison.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">11. Propriete intellectuelle</h2>
            <p className="text-neutral-600 mb-6">
              L'ensemble des contenus (textes, images, illustrations) proposes a la vente sont
              proteges par le droit d'auteur. L'achat d'un produit confere un droit d'usage
              personnel et non commercial. Toute reproduction, distribution ou revente est
              strictement interdite.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">12. Donnees personnelles</h2>
            <p className="text-neutral-600 mb-6">
              Les donnees collectees lors de la commande sont necessaires au traitement de celle-ci.
              Elles sont traitees conformement a notre{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">
                politique de confidentialite
              </Link>.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">13. Responsabilite</h2>
            <p className="text-neutral-600 mb-6">
              Le vendeur ne saurait etre tenu responsable de l'inexecution du contrat en cas
              de force majeure, de perturbation ou greve des services postaux, ou de tout
              evenement independant de sa volonte.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">14. Litiges</h2>
            <p className="text-neutral-600 mb-6">
              Les presentes CGV sont soumises au droit suisse. En cas de litige, une solution
              amiable sera recherchee avant toute action judiciaire. A defaut d'accord amiable,
              les tribunaux de Geneve seront seuls competents.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">15. Contact</h2>
            <p className="text-neutral-600 mb-6">
              Pour toute question concernant ces conditions generales de vente, vous pouvez
              nous contacter via la page{' '}
              <Link to="/contact" className="text-primary-600 hover:underline">Contact</Link>{' '}
              ou par email a diana@covendediana.ch.
            </p>

          </div>
        </div>
      </section>
    </div>
  )
}
