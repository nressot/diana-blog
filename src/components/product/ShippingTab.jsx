import { Truck, Package, RotateCcw, MapPin, Clock, Shield } from 'lucide-react'

function ShippingOption({ icon: Icon, title, description, detail }) {
  return (
    <div className="flex gap-4 p-4 bg-cream-50 rounded-xl border border-cream-200">
      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <h4 className="font-medium text-neutral-900 mb-1">
          {title}
        </h4>
        <p className="text-sm text-neutral-700">
          {description}
        </p>
        {detail && (
          <p className="text-xs text-neutral-600 mt-1">
            {detail}
          </p>
        )}
      </div>
    </div>
  )
}

export default function ShippingTab() {
  return (
    <div className="space-y-8">
      {/* Options de livraison */}
      <section>
        <h3 className="font-semibold text-lg mb-4 text-neutral-900">
          Options de livraison
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <ShippingOption
            icon={Truck}
            title="Livraison standard"
            description="5-7 jours ouvrables"
            detail="Gratuite des CHF 35 d'achat"
          />
          <ShippingOption
            icon={Package}
            title="Livraison express"
            description="2-3 jours ouvrables"
            detail="CHF 4,90"
          />
        </div>
      </section>

      {/* Zones de livraison */}
      <section>
        <h3 className="font-semibold text-lg mb-4 text-neutral-900">
          Zones de livraison
        </h3>

        <div className="p-4 bg-cream-50 rounded-xl border border-cream-200">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-700 mb-3">
                Nous livrons actuellement dans les pays suivants :
              </p>
              <div className="flex flex-wrap gap-2">
                {['France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco'].map((country) => (
                  <span
                    key={country}
                    className="px-3 py-1 bg-cream-200 text-neutral-800 rounded-full text-xs font-medium"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ebooks */}
      <section>
        <h3 className="font-semibold text-lg mb-4 text-neutral-900">
          Pour les ebooks
        </h3>

        <ShippingOption
          icon={Clock}
          title="Livraison instantanee"
          description="Telechargement immediat apres achat"
          detail="Formats EPUB et PDF inclus"
        />
      </section>

      {/* Retours */}
      <section>
        <h3 className="font-semibold text-lg mb-4 text-neutral-900">
          Retours et remboursements
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <ShippingOption
            icon={RotateCcw}
            title="Retour sous 14 jours"
            description="Pour les livres papier non ouverts"
            detail="Frais de retour a la charge du client"
          />
          <ShippingOption
            icon={Shield}
            title="Garantie satisfaction"
            description="Contactez-nous en cas de probleme"
            detail="Reponse sous 48h"
          />
        </div>
      </section>

      {/* Note */}
      <div className="p-4 border border-amber-300 bg-amber-50 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Note :</strong> Les delais peuvent varier en periode de forte activite
          (fetes, soldes). Vous recevrez un email de confirmation avec le numero de suivi
          des l'expedition de votre commande.
        </p>
      </div>
    </div>
  )
}
