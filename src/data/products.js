export const productCategories = [
  { id: 1, name: 'Livres', slug: 'livres', count: 3, color: 'bg-amber-400' },
  { id: 2, name: 'E-books', slug: 'ebooks', count: 2, color: 'bg-purple-400' },
  { id: 3, name: 'Goodies', slug: 'goodies', count: 1, color: 'bg-rose-400' },
]

export const products = [
  {
    id: 1,
    title: 'Les Murmures du Soir',
    slug: 'les-murmures-du-soir',
    excerpt: 'Un recueil de nouvelles intimistes explorant les moments de quietude et de reflexion que nous offre la tombee de la nuit.',
    description: `"Les Murmures du Soir" est mon premier recueil de nouvelles, fruit de plusieurs annees d'ecriture nocturne.

Chaque histoire est une fenetre ouverte sur l'intime, une invitation a ralentir et a ecouter les pensees qui emergent quand le monde s'endort.

Ce recueil contient 12 nouvelles, dont :
- "La Bibliotheque de Minuit"
- "Le Dernier Train"
- "Lettres a l'Aube"
- "Le Jardin des Ombres"`,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop',
    ],
    category: 'Livres',
    categoryColor: 'bg-amber-400',
    price: 1990,
    originalPrice: null,
    featured: true,
    inStock: true,
    createdAt: '2024-09-15',
    // Champs librairie
    productType: 'book',
    bookMeta: {
      isbn: '978-2-1234-5678-9',
      pages: 180,
      format: '14x21cm, broche',
      publisher: 'Editions du Crepuscule',
      publicationDate: '2024-09-15',
      language: 'Francais',
      readingTime: 240,
      genres: ['Nouvelles', 'Fiction litteraire', 'Intimiste'],
    },
    series: null,
    excerpt_text: 'La lune se levait doucement sur les toits de Paris, nimbant les cheminees d\'une lueur argentee. Marie avait toujours aime cette heure, celle ou le jour s\'efface sans bruit, ou les pensees prennent le pas sur les obligations...',
    formats: [
      { id: 'paperback', label: 'Papier', formatType: 'paperback', price: 1990, originalPrice: null, inStock: true },
      { id: 'ebook', label: 'Numerique', formatType: 'ebook', price: 890, originalPrice: null, inStock: true },
    ],
  },
  {
    id: 2,
    title: 'Encre et Saisons',
    slug: 'encre-et-saisons',
    excerpt: 'Un recueil de poesie celebrant le cycle des saisons et les emotions qu\'elles eveillent en nous.',
    description: `"Encre et Saisons" rassemble plus de 50 poemes ecrits au fil des annees, organises en quatre parties correspondant aux quatre saisons.

De la renaissance printaniere a la contemplation hivernale, chaque poeme capture un instant, une emotion, un fragment de vie.

Contenu :
- Printemps : 14 poemes sur le renouveau
- Ete : 12 poemes sur la plenitude
- Automne : 13 poemes sur la transformation
- Hiver : 15 poemes sur l'introspection`,
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=800&fit=crop',
    ],
    category: 'Livres',
    categoryColor: 'bg-amber-400',
    price: 2490,
    originalPrice: null,
    featured: true,
    inStock: true,
    createdAt: '2024-11-01',
    productType: 'book',
    bookMeta: {
      isbn: '978-2-1234-5679-6',
      pages: 120,
      format: '14x21cm, relie',
      publisher: 'Editions du Crepuscule',
      publicationDate: '2024-11-01',
      language: 'Francais',
      readingTime: 90,
      genres: ['Poesie', 'Contemplation', 'Nature'],
    },
    series: null,
    excerpt_text: 'Sous le cerisier en fleurs\nje compte les petales tombes\ncomme autant de jours passes\na attendre le printemps...',
    formats: [
      { id: 'hardcover', label: 'Relie', formatType: 'hardcover', price: 2490, originalPrice: null, inStock: true },
      { id: 'ebook', label: 'Numerique', formatType: 'ebook', price: 990, originalPrice: null, inStock: true },
    ],
  },
  {
    id: 3,
    title: 'Le Gardien des Mots Oublies',
    slug: 'le-gardien-des-mots-oublies',
    excerpt: 'Mon premier roman, une aventure fantastique au coeur d\'une bibliotheque magique ou les mots prennent vie.',
    description: `"Le Gardien des Mots Oublies" est un roman fantastique pour adultes et jeunes adultes.

Dans une bibliotheque cachee au coeur de Paris, un vieil homme veille sur les livres que plus personne ne lit. Quand Margot, une jeune libraire, decouvre cet endroit par hasard, elle apprend qu'elle est destinee a sauver les mots de l'oubli.

Un conte moderne sur le pouvoir des histoires et l'importance de la memoire.`,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=800&fit=crop',
    ],
    category: 'Livres',
    categoryColor: 'bg-amber-400',
    price: 2290,
    originalPrice: 2490,
    featured: false,
    inStock: true,
    createdAt: '2024-06-20',
    productType: 'book',
    bookMeta: {
      isbn: '978-2-1234-5680-2',
      pages: 320,
      format: '14x21cm, broche',
      publisher: 'Editions du Crepuscule',
      publicationDate: '2024-06-20',
      language: 'Francais',
      readingTime: 420,
      genres: ['Roman', 'Fantastique', 'Jeune adulte'],
    },
    series: {
      name: 'Les Gardiens',
      volume: 1,
    },
    excerpt_text: 'La porte etait la depuis toujours, Margot en etait certaine. Et pourtant, jamais elle ne l\'avait remarquee. Coincee entre la boulangerie et le pressing, a peine plus large qu\'un homme, elle semblait avoir pousse dans la nuit comme un champignon apres la pluie...',
    formats: [
      { id: 'paperback', label: 'Papier', formatType: 'paperback', price: 2290, originalPrice: 2490, inStock: true },
      { id: 'ebook', label: 'Numerique', formatType: 'ebook', price: 990, originalPrice: 1290, inStock: true },
    ],
  },
  {
    id: 4,
    title: 'Guide de l\'Ecriture Creative',
    slug: 'guide-ecriture-creative',
    excerpt: 'Un guide pratique pour developper votre creativite et trouver votre voix d\'ecrivain.',
    description: `Ce guide numerique est le fruit de mes annees d'experience en ecriture creative.

Au programme :
- Trouver l'inspiration au quotidien
- Developper votre style personnel
- Surmonter le syndrome de la page blanche
- Construire des personnages memorables
- Maitriser l'art du dialogue
- Editer et polir vos textes

Inclus : 20 exercices pratiques et des exemples commentes.`,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=800&fit=crop',
    ],
    category: 'E-books',
    categoryColor: 'bg-purple-400',
    price: 990,
    originalPrice: 1490,
    featured: false,
    inStock: true,
    createdAt: '2024-03-10',
    productType: 'ebook',
    bookMeta: {
      isbn: null,
      pages: 85,
      format: 'PDF interactif',
      publisher: 'Auto-edition',
      publicationDate: '2024-03-10',
      language: 'Francais',
      readingTime: 180,
      genres: ['Guide pratique', 'Ecriture', 'Creativite'],
    },
    series: null,
    excerpt_text: null,
    formats: [
      { id: 'ebook', label: 'PDF + EPUB', formatType: 'ebook', price: 990, originalPrice: 1490, inStock: true },
    ],
  },
  {
    id: 5,
    title: 'Les Murmures du Soir - Edition Numerique',
    slug: 'les-murmures-du-soir-ebook',
    excerpt: 'La version numerique de mon recueil de nouvelles, a emporter partout avec vous.',
    description: `Version numerique de "Les Murmures du Soir".

Contenu identique a la version papier, avec en bonus :
- Une nouvelle inedite : "L'Heure Bleue"
- Notes de l'autrice sur chaque nouvelle
- Guide de lecture pour groupes de discussion`,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop',
    ],
    category: 'E-books',
    categoryColor: 'bg-purple-400',
    price: 890,
    originalPrice: null,
    featured: false,
    inStock: true,
    createdAt: '2024-10-01',
    productType: 'ebook',
    bookMeta: {
      isbn: null,
      pages: 200,
      format: 'EPUB + PDF',
      publisher: 'Editions du Crepuscule',
      publicationDate: '2024-10-01',
      language: 'Francais',
      readingTime: 260,
      genres: ['Nouvelles', 'Fiction litteraire', 'Intimiste'],
    },
    series: null,
    excerpt_text: 'La lune se levait doucement sur les toits de Paris...',
    formats: [
      { id: 'ebook', label: 'EPUB + PDF', formatType: 'ebook', price: 890, originalPrice: null, inStock: true },
    ],
  },
  {
    id: 6,
    title: 'Carnet "Mots et Pensees"',
    slug: 'carnet-mots-pensees',
    excerpt: 'Un carnet elegant pour capturer vos idees et inspirations, avec des citations choisies.',
    description: `Ce carnet de 160 pages est concu pour les ecrivains et reveurs.

Caracteristiques :
- Papier ivoire 100g, ideal pour l'ecriture
- Couverture rigide avec finition soft-touch
- Reliure cousue pour une ouverture a plat
- Marque-page ruban integre
- Citations inspirantes toutes les 10 pages

Dimensions : 14 x 21 cm (format A5)
Pages : 160 pages lignees`,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=800&fit=crop',
    ],
    category: 'Goodies',
    categoryColor: 'bg-rose-400',
    price: 1490,
    originalPrice: null,
    featured: false,
    inStock: true,
    createdAt: '2024-12-01',
    productType: 'goodie',
    bookMeta: null,
    series: null,
    excerpt_text: null,
    formats: [
      { id: 'default', label: 'Carnet A5', formatType: 'paperback', price: 1490, originalPrice: null, inStock: true },
    ],
  },
]

// Donnees auteur pour la section auteur sur les pages produit
export const authorData = {
  id: 1,
  name: 'Diana',
  role: 'Autrice',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  shortBio: 'Ecrivaine francaise passionnee par les mots et les histoires qui nous relient. Autrice de nouvelles, de poesie et de romans fantastiques.',
  bio: 'Diana est une ecrivaine francaise qui explore les territoires de l\'intime et du merveilleux. Ses ecrits, qu\'il s\'agisse de nouvelles, de poemes ou de romans, invitent le lecteur a ralentir et a redouuvrr le pouvoir des mots.',
}

export const featuredProducts = products.filter((p) => p.featured)
export const recentProducts = products.slice().sort((a, b) =>
  new Date(b.createdAt) - new Date(a.createdAt)
)
