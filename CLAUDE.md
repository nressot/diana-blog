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

## Deploiement

**Domaine principal** : https://covendediana.ch

**Netlify** : https://le-coven-de-diana.netlify.app/ (redirige vers covendediana.ch)

**Webhook Stripe** : https://covendediana.ch/.netlify/functions/stripe-webhook

## SEO

### Fichiers SEO

| Fichier | Description |
|---------|-------------|
| `public/robots.txt` | Regles de crawl pour Google |
| `public/sitemap.xml` | Sitemap genere au build |
| `scripts/generate-sitemap.mjs` | Script generation sitemap |
| `src/components/SEO.jsx` | Meta tags dynamiques |
| `src/components/StructuredData.jsx` | Donnees structurees JSON-LD |

### Meta Tags (react-helmet-async)

Chaque page a des meta tags uniques:
- `<title>` dynamique
- `<meta name="description">`
- Open Graph (og:title, og:description, og:image)
- Twitter Cards

### Donnees Structurees JSON-LD

| Page | Schemas |
|------|---------|
| Home | WebSite, Person, ItemList |
| Blog | ItemList (articles) |
| Article | BlogPosting, BreadcrumbList |
| Boutique | ItemList (produits) |
| Product | Product/Book, BreadcrumbList |
| Contact | FAQPage |

### Sitemap Dynamique

Le sitemap est regenere a chaque build avec les articles et produits depuis Supabase:
```bash
npm run generate:sitemap  # Execute automatiquement avant build
```

### Google Search Console

Soumettre le sitemap: https://covendediana.ch/sitemap.xml

## Variables d'Environnement Netlify

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Cle secrete Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe (whsec_...) |
| `SUPABASE_URL` | URL projet Supabase |
| `SUPABASE_SERVICE_KEY` | Cle service role Supabase |
| `RESEND_API_KEY` | Cle API Resend pour emails |
| `FROM_EMAIL` | Expediteur emails (Diana <noreply@resend.dev>) |
| `DIANA_EMAIL` | Email de Diana pour les notifications de commentaires |

## Variables d'Environnement Local

```env
VITE_SANITY_PROJECT_ID=xxx
VITE_SANITY_DATASET=production
```

Si non configure -> utilise `src/data/articles.js` comme fallback.

## Supabase

**Project ref**: `jxdzlhybtrudrauwnizi`
**Dashboard**: https://supabase.com/dashboard/project/jxdzlhybtrudrauwnizi

### Acces Claude

Claude a acces en lecture/ecriture via les credentials dans `.env`:
- `VITE_SUPABASE_URL` - URL du projet
- `VITE_SUPABASE_ANON_KEY` - Cle publique (lecture)
- `SUPABASE_SERVICE_ROLE_KEY` - Cle service (lecture/ecriture, bypass RLS)

### Tables Supabase

| Table | Description |
|-------|-------------|
| `articles` | Articles du blog (avec `views` et `comments` pour les compteurs) |
| `categories` | Categories d'articles |
| `authors` | Auteurs |
| `comments` | Commentaires des articles |
| `products` | Produits de la boutique |
| `orders` | Commandes Stripe |
| `subscribers` | Abonnes newsletter |
| `pages` | Contenu des pages (Home, About, etc.) |

#### Colonnes articles

La table `articles` contient les colonnes suivantes pour les compteurs:
- `views` (INTEGER): Nombre de vues de l'article (par defaut 0)
- `comments` (INTEGER): Nombre de commentaires approuves (mis a jour automatiquement via trigger)

**Trigger automatique**: Le compteur `comments` est mis a jour automatiquement via la fonction `update_article_comments_count()` qui s'execute a chaque INSERT/UPDATE/DELETE sur la table `comments` avec status='approved'.

### Execution SQL (DDL)

Pour CREATE TABLE, ALTER TABLE, etc., utiliser le **SQL Editor**:
1. https://supabase.com/dashboard/project/jxdzlhybtrudrauwnizi/sql
2. Coller le SQL et cliquer **Run**

### Cle Service Role

Pour les operations d'ecriture cote serveur (bypass RLS):
```javascript
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY)
```

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

## Verification Obligatoire (CRITIQUE)

> "Give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result." - Boris Cherny, createur Claude Code

**AVANT de marquer une tache comme terminee, TOUJOURS verifier:**

| Type de changement | Verification requise |
|--------------------|---------------------|
| Code TypeScript/JS | `npm run build` ou `tsc --noEmit` (zero erreurs) |
| API Route | `curl` ou test avec reponse attendue |
| Composant UI | Verifier dans browser + responsive + dark mode |
| Hook/Service | Test unitaire ou script de validation |
| Base de donnees | Query pour confirmer donnees persistees |
| Style/CSS | Inspection visuelle light + dark mode |
| Config/Env | Redemarrer serveur et verifier comportement |

### Workflow Verification

1. **Implementer** le changement
2. **Executer** la commande de verification appropriee
3. **Confirmer** le resultat attendu (pas d'erreur, output correct)
4. **Documenter** la verification effectuee dans la reponse

### Commandes de Verification

```bash
npm run build              # Build complet
npm run lint               # Linting
npm run test               # Tests unitaires
curl -X GET/POST localhost:PORT/api/...  # Test API
```

Ne JAMAIS marquer termine sans avoir:

- Execute la commande de verification
- Confirme zero erreurs ou resultat attendu
- Mentionne la verification dans la reponse

Adapte le port (5173 pour dev, 4000 pour API) selon le contexte.
