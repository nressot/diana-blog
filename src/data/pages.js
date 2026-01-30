/**
 * Données statiques pour les pages singleton
 * Utilisées comme fallback si Sanity n'est pas configuré
 */

export const homePage = {
  hero: {
    titleLine1: 'Des mots qui',
    titleLine2: 'voyagent,',
    titleLine3: 'des histoires qui',
    typewriterWords: ['restent', 'inspirent', 'touchent', 'marquent', 'résonnent'],
    subtitle: 'Bienvenue dans mon univers littéraire. Je suis Diana, et ici je partage mes réflexions, mes récits et mes découvertes au fil de la plume.',
    primaryCta: {
      text: 'Lire mes articles',
      link: '/blog'
    },
    secondaryCta: {
      text: 'Qui suis-je ?',
      link: '/about'
    }
  },
  sections: {
    featured: {
      title: 'À la une',
      subtitle: 'Ma dernière pensée'
    },
    categories: {
      title: 'Catégories',
      subtitle: 'Explorez par thème'
    },
    latestArticles: {
      title: 'Derniers articles',
      subtitle: 'Mes écrits les plus récents'
    },
    author: {
      title: 'Qui je suis',
      subtitle: 'Quelques mots sur moi'
    }
  },
  newsletter: {
    title: 'Restez connecté à mes écrits',
    description: 'Une newsletter mensuelle avec mes réflexions, nouveaux textes et découvertes littéraires. Pas de spam, promis.',
    placeholder: 'votre@email.com',
    buttonText: 'S\'abonner'
  }
}

export const aboutPage = {
  hero: {
    title: 'À propos de moi',
    subtitle: 'Découvrez mon parcours, ma passion pour l\'écriture et ce qui m\'inspire au quotidien.'
  },
  story: {
    title: 'Mon histoire',
    paragraphs: [
      'Depuis mon enfance, les mots ont été mes compagnons les plus fidèles. Je me souviens encore de ces après-midi passés à la bibliothèque municipale, perdue dans des mondes imaginaires, rêvant déjà d\'en créer les miens.',
      'Après des études de lettres modernes à l\'université, j\'ai d\'abord travaillé dans l\'édition, ce qui m\'a permis de découvrir les coulisses de la création littéraire. Mais l\'appel de l\'écriture était trop fort.',
      'En 2019, j\'ai fait le grand saut : j\'ai quitté mon emploi pour me consacrer pleinement à ma passion. Ce blog est né de cette décision, comme un espace de liberté où je peux explorer toutes les facettes de l\'écriture.',
      'Aujourd\'hui, je partage mon temps entre l\'écriture de fiction, la poésie et ces réflexions que je vous livre ici. Chaque texte est une invitation au voyage, une porte ouverte sur l\'imaginaire.'
    ]
  },
  valuesSection: {
    title: 'Mes valeurs',
    values: [
      {
        icon: 'PenTool',
        title: 'Authenticité',
        description: 'Chaque mot que j\'écris vient du cœur. Je crois en une écriture sincère qui touche l\'âme.'
      },
      {
        icon: 'BookOpen',
        title: 'Partage',
        description: 'La littérature prend vie quand elle est partagée. Ce blog est un espace d\'échange.'
      },
      {
        icon: 'Heart',
        title: 'Passion',
        description: 'Écrire n\'est pas un métier pour moi, c\'est une vocation, une nécessité vitale.'
      },
      {
        icon: 'Award',
        title: 'Excellence',
        description: 'Je travaille chaque texte jusqu\'à ce qu\'il atteigne sa forme la plus aboutie.'
      }
    ]
  },
  milestonesSection: {
    title: 'Mon parcours',
    milestones: [
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
  },
  cta: {
    title: 'Envie d\'échanger ?',
    description: 'Je suis toujours heureuse de recevoir vos retours, vos questions ou simplement d\'échanger sur notre passion commune pour les mots.',
    buttonText: 'Me contacter',
    buttonLink: '/contact'
  }
}

export const contactPage = {
  hero: {
    title: 'Contactez-moi',
    subtitle: 'Une question, une collaboration, ou simplement envie d\'échanger ? N\'hésitez pas à me laisser un message.'
  },
  contactInfo: [
    {
      icon: 'Mail',
      title: 'Email',
      value: 'diana@covendediana.ch',
      href: 'mailto:diana@covendediana.ch'
    },
    {
      icon: 'MapPin',
      title: 'Localisation',
      value: 'Genève, Suisse',
      href: null
    },
    {
      icon: 'Clock',
      title: 'Délai de réponse',
      value: 'Sous 48h',
      href: null
    }
  ],
  socialSection: {
    title: 'Retrouvez-moi sur',
    links: [
      {
        platform: 'Instagram',
        url: 'https://instagram.com/neelagram',
        handle: '@neelagram'
      }
    ]
  },
  form: {
    title: 'Envoyez-moi un message',
    nameLabel: 'Nom complet',
    emailLabel: 'Email',
    subjectLabel: 'Sujet',
    messageLabel: 'Message',
    submitText: 'Envoyer le message',
    successMessage: 'Message envoyé ! Je vous répondrai dans les plus brefs délais.'
  },
  faqSection: {
    title: 'Questions fréquentes',
    items: [
      {
        question: 'Acceptez-vous les collaborations ?',
        answer: 'Oui, je suis ouverte aux collaborations éditoriales, aux interviews et aux projets créatifs. N\'hésitez pas à me présenter votre projet.'
      },
      {
        question: 'Puis-je republier vos textes ?',
        answer: 'Mes textes sont protégés par le droit d\'auteur. Pour toute republication, merci de me contacter au préalable pour obtenir une autorisation.'
      },
      {
        question: 'Donnez-vous des conseils d\'écriture ?',
        answer: 'Je partage régulièrement des conseils sur mon blog. Pour un accompagnement personnalisé, contactez-moi pour discuter de vos besoins.'
      }
    ]
  }
}

export const bookSection = {
  title: 'Mon dernier livre',
  bookTitle: 'Échos du silence',
  description: [
    'Dans ce recueil de nouvelles, je vous invite à explorer les recoins les plus intimes de l\'âme humaine. Chaque histoire est une fenêtre ouverte sur des vies ordinaires transformées par des moments extraordinaires.',
    'De la mélancolie d\'un café parisien aux rivages lumineux de la Méditerranée, ces récits tissent ensemble les fils invisibles qui nous relient tous.',
    'Un voyage littéraire au cœur de nos émotions les plus profondes.'
  ],
  ctaText: 'Acheter',
  ctaLink: '/boutique'
}
