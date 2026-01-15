export default function MonDernierLivre() {
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
                  Mon dernier livre
                </h2>

                <div className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-4 mb-6">
                  <p>
                    Maxine, qui après avoir négligé sa vie amoureuse à l'arrivée de sa fille, se lance dans une quête d'amour. Malgré les sites de rencontres, les soirées en boîte de nuit et les rendez-vous arrangés, elle ne trouve pas son prince charmant. Mais peut-être n'a-t-elle pas regardé assez près.
                  </p>
                  <p>
                    Quant à Sasha et Jamie, ils se connaissent depuis leur enfance. Malheureusement, ils ont toujours raté le coche. Face aux difficultés que Jamie rencontre avec sa femme, oseront-ils passer la barrière entre l'amitié et l'amour ?
                  </p>
                  <p>
                    L'histoire de deux femmes qui se soutiennent au quotidien, traversant des péripéties, de l'humour et surtout de l'amour.
                  </p>
                </div>

                {/* CTA Button */}
                <button className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-primary-600/20">
                  Acheter
                </button>
              </div>

              {/* Right - Empty space for images that overflow */}
              <div className="hidden lg:block" />
            </div>
          </div>

          {/* Images container - positioned to overflow */}
          <div className="hidden lg:block absolute right-8 xl:right-16 -top-10 w-[360px] h-[460px]">
            {/* Geometric shape - static, behind the book */}
            <img
              src="/geometric-shape.png"
              alt=""
              className="absolute top-12 left-0 w-[330px] rotate-[-3deg] z-0"
              aria-hidden="true"
            />

            {/* Book cover - floating animation, in front */}
            <img
              src="/book-cover.png"
              alt="Prochain arrêt L'amour - Alma Rose"
              className="absolute top-0 left-10 w-[280px] rotate-[4deg] z-10 animate-float"
            />
          </div>

          {/* Mobile image */}
          <div className="lg:hidden flex justify-center mt-8 relative">
            <div className="relative w-[220px] h-[320px]">
              <img
                src="/geometric-shape.png"
                alt=""
                className="absolute top-10 left-0 w-[200px] rotate-[-3deg] z-0"
                aria-hidden="true"
              />
              <img
                src="/book-cover.png"
                alt="Prochain arrêt L'amour - Alma Rose"
                className="absolute top-0 left-4 w-[180px] rotate-[4deg] z-10 animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
