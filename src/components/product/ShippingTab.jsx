import { Truck, Package, RotateCcw, MapPin, Clock, Shield } from 'lucide-react'

function ShippingOption({ icon: Icon, title, description, detail }) {
  return (
    <div className="flex gap-4 p-4 bg-cream-50 dark:bg-neutral-800/50 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
        {detail && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
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
        <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
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
        <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
          Zones de livraison
        </h3>

        <div className="p-4 bg-cream-50 dark:bg-neutral-800/50 rounded-xl">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Nous livrons actuellement dans les pays suivants :
              </p>
              <div className="flex flex-wrap gap-2">
                {['France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco'].map((country) => (
                  <span
                    key={country}
                    className="px-2 py-1 bg-cream-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs"
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
        <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
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
        <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
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
      <div className="p-4 border border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Note :</strong> Les delais peuvent varier en periode de forte activite
          (fetes, soldes). Vous recevrez un email de confirmation avec le numero de suivi
          des l'expedition de votre commande.
        </p>
      </div>
    </div>
  )
}
