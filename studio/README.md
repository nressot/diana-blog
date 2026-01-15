# Writer Blog - Sanity Studio

Interface d'administration pour creer et editer les articles du blog.

## Installation

### 1. Creer un projet Sanity

1. Va sur [sanity.io/manage](https://www.sanity.io/manage)
2. Connecte-toi ou cree un compte
3. Clique sur "Create new project"
4. Donne un nom au projet (ex: "writer-blog")
5. Selectionne "production" comme dataset
6. Note le **Project ID** (ex: `abc123xyz`)

### 2. Configurer le Studio

Remplace `YOUR_PROJECT_ID` dans les fichiers suivants :

**studio/sanity.config.js** (ligne 11):
```js
projectId: 'TON_PROJECT_ID_ICI',
```

**studio/sanity.cli.js** (ligne 5):
```js
projectId: 'TON_PROJECT_ID_ICI',
```

### 3. Configurer le Frontend

Cree un fichier `.env` a la racine du projet `writer-blog/`:

```bash
VITE_SANITY_PROJECT_ID=ton_project_id_ici
VITE_SANITY_DATASET=production
```

### 4. Installer et lancer

```bash
# Installer les dependances du studio
cd studio
npm install

# Lancer le studio
npm run dev
```

Le studio sera accessible sur http://localhost:3333

## Utilisation

### Creer du contenu

1. **Auteur** : Cree d'abord un auteur (onglet "Auteur")
2. **Categories** : Cree les categories (Fiction, Poesie, Reflexions, etc.)
3. **Articles** : Cree tes articles avec le riche editeur de texte

### Structure des articles

- **Titre** : Titre de l'article
- **Slug** : URL-friendly (genere automatiquement)
- **Extrait** : Resume affiche dans les listes
- **Contenu** : Editeur rich text avec :
  - Titres (H2, H3, H4)
  - Texte gras, italique, souligne
  - Listes a puces et numerotees
  - Citations (blockquote)
  - Liens
  - Images avec legendes
- **Image principale** : Image de couverture
- **Categorie** : Reference vers une categorie
- **Date de publication** : Date affichee
- **Temps de lecture** : Ex: "6 min"
- **Mis en avant** : Affiche en hero sur la page d'accueil

## Architecture

```
writer-blog/
├── src/
│   ├── lib/
│   │   ├── sanity.js          # Client Sanity
│   │   ├── queries.js         # Queries GROQ
│   │   ├── useArticles.js     # Hooks React
│   │   ├── dataAdapter.js     # Normalisation donnees
│   │   └── PortableTextComponents.jsx  # Rendu rich text
│   └── pages/
│       ├── Home.jsx           # Utilise useArticles()
│       ├── Blog.jsx           # Utilise useArticles()
│       └── Article.jsx        # Utilise useArticle(slug)
│
└── studio/                    # Sanity Studio
    ├── sanity.config.js       # Configuration
    ├── sanity.cli.js          # CLI config
    └── schemas/
        ├── article.js         # Schema article
        ├── author.js          # Schema auteur
        ├── category.js        # Schema categorie
        └── index.js           # Export schemas
```

## Mode Fallback

Si Sanity n'est pas configure (pas de `VITE_SANITY_PROJECT_ID`), le site utilise automatiquement les donnees statiques dans `src/data/articles.js`.

Cela permet de :
- Developper sans connexion Sanity
- Avoir un fallback si l'API Sanity est indisponible
- Tester les composants avec des donnees de demo

## Commandes

```bash
# Studio Sanity
cd studio
npm run dev      # Lance le studio en local
npm run build    # Build pour production
npm run deploy   # Deploie le studio sur Sanity

# Frontend
cd ..
npm run dev      # Lance le frontend
npm run build    # Build pour production
```

## Liens utiles

- [Documentation Sanity](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Portable Text](https://www.sanity.io/docs/portable-text)
- [Sanity Studio](https://www.sanity.io/studio)
