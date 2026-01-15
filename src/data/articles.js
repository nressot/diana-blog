export const categories = [
  { id: 1, name: 'Fiction', slug: 'fiction', count: 12, color: 'bg-rose-300' },
  { id: 2, name: 'Poésie', slug: 'poesie', count: 8, color: 'bg-purple-300' },
  { id: 3, name: 'Réflexions', slug: 'reflexions', count: 15, color: 'bg-amber-300' },
  { id: 4, name: 'Voyages', slug: 'voyages', count: 6, color: 'bg-teal-300' },
  { id: 5, name: 'Inspiration', slug: 'inspiration', count: 10, color: 'bg-orange-300' },
  { id: 6, name: 'Écriture', slug: 'ecriture', count: 9, color: 'bg-stone-400' },
]

export const author = {
  name: 'Diana',
  role: 'Écrivaine & Blogueuse',
  bio: 'Passionnée par les mots depuis toujours, je partage ici mes réflexions, mes récits et mes découvertes littéraires. Chaque texte est une invitation au voyage intérieur.',
  avatar: '/author-avatar.jpg',
  stats: {
    articles: 52,
    readers: '12.5k',
    years: 5
  },
  social: {
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  }
}

export const articles = [
  {
    id: 1,
    title: 'Les murmures du soir : quand la nuit inspire les mots',
    slug: 'murmures-du-soir',
    excerpt: 'Il y a dans le crepuscule une magie particuliere qui delie les pensees et libere imagination. Ce soir-la, assise pres de la fenetre, les mots sont venus naturellement...',
    content: `Il y a dans le crepuscule une magie particuliere qui delie les pensees et libere imagination. Ce soir-la, assise pres de la fenetre, les mots sont venus naturellement.

La lumiere declinante du jour offre un espace suspendu entre deux mondes. C'est dans cet entre-deux que naissent les plus belles histoires, celles qui osent explorer les recoins de notre ame.

## L'art de capturer l'instant

Ecrire au crepuscule, c'est accepter de se laisser guider par l'ombre qui avance. Les contours s'estompent, les certitudes vacillent, et c'est precisement la que la creation trouve sa source.

> "La nuit n'efface pas le monde, elle le revele autrement." - Une pensee du soir

## Rituels d'ecriture nocturne

J'ai developpe au fil des annees quelques rituels simples :
- Une tasse de the fumante
- Une bougie a la cire d'abeille
- Mon carnet prefere aux pages ivoire
- Le silence, ou parfois, une musique douce

Ces elements creent un cocon propice a l'introspection et a l'ecriture.`,
    image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=600&fit=crop',
    category: 'Réflexions',
    categoryColor: 'bg-amber-300',
    date: '15 Dec 2024',
    readTime: '6 min',
    views: 1240,
    comments: 23,
    featured: true
  },
  {
    id: 2,
    title: 'Carnets de voyage : Lisbonne et ses azulejos',
    slug: 'carnets-lisbonne-azulejos',
    excerpt: 'Lisbonne m\'a accueillie avec ses ruelles escarpees et ses facades de ceramique bleue. Chaque coin de rue raconte une histoire centenaire...',
    content: `Lisbonne m'a accueillie avec ses ruelles escarpees et ses facades de ceramique bleue. Chaque coin de rue raconte une histoire centenaire.

## Les couleurs de Alfama

Le quartier d'Alfama est un labyrinthe poetique. Les azulejos, ces carreaux de faience peints, ornent les murs comme des pages d'un livre ancien. Bleu cobalt, blanc creme, parfois un eclat de jaune - chaque motif est une oeuvre d'art.

## Ecrire face au Tage

J'ai trouve un cafe surplombant le fleuve. La, entre deux gorgees de cafe, j'ai rempli des pages entieres de mon carnet. L'inspiration coulait comme l'eau du Tage vers l'ocean.`,
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
    category: 'Voyages',
    categoryColor: 'bg-teal-300',
    date: '8 Dec 2024',
    readTime: '8 min',
    views: 890,
    comments: 15
  },
  {
    id: 3,
    title: 'L\'art de la nouvelle : condenser l\'emotion',
    slug: 'art-de-la-nouvelle',
    excerpt: 'La nouvelle est un exercice d\'equilibriste. En quelques pages, il faut creer un monde, faire naitre des personnages et toucher le coeur du lecteur...',
    content: `La nouvelle est un exercice d'equilibriste. En quelques pages, il faut creer un monde, faire naitre des personnages et toucher le coeur du lecteur.

## L'economie des mots

Contrairement au roman qui peut se permettre des detours, la nouvelle exige une precision chirurgicale. Chaque mot compte, chaque phrase doit porter le recit vers sa conclusion.

## Mes nouvelles preferees

Quelques maitres du genre m'ont particulierement inspiree :
- Anton Tchekhov et ses fins ouvertes
- Alice Munro et sa psychologie fine
- Raymond Carver et son minimalisme`,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
    category: 'Écriture',
    categoryColor: 'bg-stone-400',
    date: '1 Dec 2024',
    readTime: '5 min',
    views: 1560,
    comments: 31
  },
  {
    id: 4,
    title: 'Poeme : Les saisons de l\'ame',
    slug: 'poeme-saisons-ame',
    excerpt: 'Un poeme ne sur un matin d\'automne, quand les feuilles tombent comme des pensees qu\'on laisse aller...',
    content: `Un poeme ne sur un matin d'automne, quand les feuilles tombent comme des pensees qu'on laisse aller.

---

**Les saisons de l'ame**

*Au printemps de mes jours,*
*J'ai seme des reves legers*
*Comme des graines d'espoir*
*Dans le terreau du possible.*

*L'ete venu, j'ai couru*
*Sous le soleil des certitudes,*
*Croyant tenir le monde*
*Dans le creux de ma main.*

*Puis l'automne a souffle*
*Sur mes illusions dorees,*
*Et j'ai appris la beaute*
*De ce qui tombe et se transforme.*

*L'hiver, je l'attends sereine,*
*Comme une page blanche*
*Ou s'ecriront demain*
*De nouveaux commencements.*

---

Ce poeme fait partie de mon recueil en preparation, "Encre et Saisons".`,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    category: 'Poésie',
    categoryColor: 'bg-purple-300',
    date: '25 Nov 2024',
    readTime: '3 min',
    views: 2100,
    comments: 45
  },
  {
    id: 5,
    title: 'Fiction : Le gardien des mots oublies',
    slug: 'gardien-mots-oublies',
    excerpt: 'Dans une bibliotheque cachee au coeur de la ville, un vieil homme veille sur les livres que plus personne ne lit. Jusqu\'au jour ou...',
    content: `Dans une bibliotheque cachee au coeur de la ville, un vieil homme veille sur les livres que plus personne ne lit.

## Chapitre 1 : La decouverte

Margot n'aurait jamais trouve cet endroit si elle n'avait pas suivi le chat roux. La ruelle etroite ne figurait sur aucun plan, et pourtant, au bout, une porte de bois sculpte l'attendait.

"Entrez, dit une voix venue de l'interieur. Les mots vous attendaient."

Le vieil homme etait assis derriere un bureau croule sous les manuscrits. Ses yeux, d'un bleu delave par les annees de lecture, la scrutaient avec bienveillance.

"Je suis le Gardien, dit-il simplement. Et vous, vous etes celle qui peut les sauver."

*A suivre...*`,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    category: 'Fiction',
    categoryColor: 'bg-rose-300',
    date: '18 Nov 2024',
    readTime: '10 min',
    views: 3200,
    comments: 67,
    featured: true
  },
  {
    id: 6,
    title: '10 livres qui ont change ma vision de l\'ecriture',
    slug: 'livres-change-vision-ecriture',
    excerpt: 'Certains livres ne se contentent pas de nous divertir, ils transforment notre facon de penser et d\'ecrire. Voici ceux qui m\'ont marquee...',
    content: `Certains livres ne se contentent pas de nous divertir, ils transforment notre facon de penser et d'ecrire.

## Ma liste personnelle

1. **"L'ecriture" de Marguerite Duras** - La voix interieure
2. **"Si par une nuit d'hiver un voyageur" de Calvino** - La metafiction
3. **"Mrs Dalloway" de Virginia Woolf** - Le flux de conscience
4. **"Cent ans de solitude" de Garcia Marquez** - Le realisme magique
5. **"L'etranger" de Camus** - L'economie narrative

Chacun de ces ouvrages m'a appris quelque chose de precieux sur l'art d'ecrire.`,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
    category: 'Inspiration',
    categoryColor: 'bg-orange-300',
    date: '10 Nov 2024',
    readTime: '7 min',
    views: 1890,
    comments: 28
  }
]

export const featuredArticles = articles.filter(a => a.featured)
export const recentArticles = articles.slice(0, 4)
