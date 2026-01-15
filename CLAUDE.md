# Diana - Blog Litteraire

## Vue d'ensemble

Blog/portfolio pour Diana, ecrivaine francaise. Site moderne avec gestion de contenu via Sanity CMS et fallback statique.

## Stack Technique

| Couche | Technologies |
|--------|--------------|
| Frontend | React 19, Vite 7, React Router 7 |
| Styling | Tailwind CSS 4, Framer Motion |
| CMS | Sanity 3 (studio dans `/studio`) |
| Icons | Lucide React |
| Font | Be Vietnam Pro |

## Structure Projet

```
src/
  components/     # Composants reutilisables (ArticleCard, Header, Footer...)
  pages/          # Pages (Home, Blog, Article, About, Contact)
  lib/            # Utilitaires et hooks Sanity
    sanity.js     # Config client Sanity
    queries.js    # Requetes GROQ
    useArticles.js # Hooks avec fallback
    dataAdapter.js # Normalisation donnees
  data/           # Donnees statiques fallback
  hooks/          # Hooks custom
  assets/         # Images statiques
studio/           # Sanity Studio (CMS)
  schemas/        # Schemas: article, author, category
```

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, articles en vedette, categories |
| `/blog` | Blog | Liste articles avec recherche/filtres |
| `/article/:slug` | Article | Detail article + articles lies |
| `/about` | About | Biographie auteur |
| `/contact` | Contact | Formulaire contact |

## Schemas Sanity

### Article
- title, slug, author (ref), category (ref)
- image, excerpt, content (portable text)
- publishedAt, readTime, featured

### Author
- name, slug, role, avatar, bio
- stats (articles, readers, years)
- social (twitter, instagram, linkedin)

### Category
- name, slug, color (classe Tailwind), description

## Variables d'Environnement

```env
VITE_SANITY_PROJECT_ID=xxx
VITE_SANITY_DATASET=production
```

Si non configure -> utilise `src/data/articles.js` comme fallback.

## Commandes

```bash
npm run dev      # Dev server (port 5173)
npm run build    # Build production
npm run lint     # ESLint
npm run preview  # Preview build
```

## Conventions

### Composants
- Variantes via prop `variant`: `featured`, `default`, `horizontal`
- Dark mode via classe `.dark` sur `documentElement`
- Animations Framer Motion pour transitions

### Styling
- Couleurs custom: `primary-*` (terracotta), `cream-*`, `neutral-*`
- Classes utilitaires: `.container-custom`, `.card-hover`, `.img-zoom`
- Mobile-first responsive

### Data Flow
```
Sanity CMS -> useSanityWithFallback -> dataAdapter -> Components
                    |
                    v (si erreur)
              Static Data (articles.js)
```

## Requetes GROQ Principales

- `articlesQuery` - Tous les articles
- `articleBySlugQuery` - Article par slug avec contenu complet
- `featuredArticlesQuery` - Articles en vedette
- `recentArticlesQuery` - N derniers articles
- `articlesByCategoryQuery` - Par categorie
- `relatedArticlesQuery` - Articles lies (meme categorie, max 3)
- `categoriesQuery` - Categories avec compte
- `authorQuery` - Donnees auteur

## Regles Importantes

1. **Ports fixes**: Dev server sur 5173, API sur 4000
2. **Pas de mocks temporaires** sur les blocs produits/prix
3. **Pas d'emoji** dans le code (casse l'encodage)
4. **Langue**: Interface et contenu en francais

## Categories Existantes

1. Fiction (bg-rose-400)
2. Poesie (bg-violet-400)
3. Reflexions (bg-amber-400)
4. Voyages (bg-emerald-400)
5. Inspiration (bg-sky-400)
6. Ecriture (bg-fuchsia-400)

## Dark Mode

- Stocke dans localStorage
- Fallback sur preference systeme
- Toggle dans Header via `toggleDarkMode`
- Classes Tailwind `dark:*` partout

## Images

- Builder URL Sanity pour resize dynamique
- Lazy loading actif
- Hook `useImageBrightness` pour contraste texte overlay

## Dependances Cles

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "@sanity/client": "^7.13.2",
  "@portabletext/react": "^6.0.2",
  "framer-motion": "^12.23.27",
  "tailwindcss": "^4.1.18",
  "lucide-react": "^0.562.0"
}
```
