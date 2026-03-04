# Nouvelles Fonctionnalites - Systeme de Commentaires

## Resume

Le systeme de commentaires a ete ameliore avec deux nouvelles fonctionnalites majeures :

1. **Notifications par email** : Diana recoit un email automatique a chaque nouveau commentaire ou reponse
2. **Reponses aux commentaires** : Les utilisateurs authentifies peuvent repondre aux commentaires existants

## 1. Notifications par Email

### Fonctionnement

Lorsqu'un utilisateur poste un commentaire ou une reponse, un email est automatiquement envoye a Diana avec :
- Le nom de l'auteur du commentaire
- L'email de l'auteur (si fourni)
- Le contenu du commentaire
- Le titre de l'article
- Un lien direct vers l'article

### Configuration requise

Dans les variables d'environnement Netlify, ajouter :

```
DIANA_EMAIL=diana@covendediana.ch
```

Cette variable definit l'adresse email ou les notifications seront envoyees.

### Fonction Netlify

La fonction `notify-new-comment.js` gere l'envoi des emails via Resend.

### Format de l'email

Les emails sont au format HTML avec un design professionnel incluant :
- En-tete avec le titre
- Badge "Reponse a..." pour les reponses
- Nom et email de l'auteur
- Contenu du commentaire
- Bouton CTA vers l'article
- Footer avec le nom du site

## 2. Reponses aux Commentaires

### Fonctionnement

Les utilisateurs **authentifies** peuvent repondre aux commentaires via un bouton "Repondre".

#### Interface utilisateur

1. Chaque commentaire parent affiche un bouton "Repondre" (icone + texte)
2. En cliquant sur "Repondre" :
   - Le formulaire de commentaire est mis en contexte de reponse
   - Un texte "Repondre a [Nom]" apparait
   - Un bouton X permet d'annuler la reponse
3. Les reponses sont affichees en retrait sous le commentaire parent

#### Hierarchie

- **Commentaires parents** : Affiches normalement avec possibilite de repondre
- **Reponses** : Affichees avec un retrait de 8 unites (classe `ml-8`)
- **Limitation** : 1 niveau de reponse uniquement (pas de reponses aux reponses)

## 3. Migration Base de Donnees

### Colonnes ajoutees

La table `comments` a ete modifiee pour supporter :

```sql
- parent_id UUID : Reference vers le commentaire parent (pour les reponses)
- user_id UUID : ID de l'utilisateur authentifie
- author_avatar TEXT : URL de l'avatar (deja utilisee mais manquante dans le schema)
```

### Execution de la migration

**Option 1 : Via le script de verification**
```bash
node run-comment-replies-migration.mjs
```

Le script verifie si les colonnes existent et affiche les instructions.

**Option 2 : Manuellement dans Supabase**

1. Aller sur https://supabase.com/dashboard/project/jxdzlhybtrudrauwnizi/sql
2. Copier le contenu du fichier `add-comment-replies.sql`
3. Coller dans l'editeur SQL
4. Cliquer sur "Run"

### Index ajoutes

Un index a ete cree sur `parent_id` pour optimiser les requetes de recuperation des reponses :

```sql
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
```

## 4. Modifications du Code

### Fichiers modifies

| Fichier | Modifications |
|---------|--------------|
| `src/lib/useSupabaseComments.js` | - Hook `useComments` recupere les reponses<br>- Hook `useSubmitComment` supporte les reponses<br>- Envoi de notification email |
| `src/components/CommentCard.jsx` | - Affichage hierarchique des reponses<br>- Bouton "Repondre" pour utilisateurs authentifies<br>- Props `onReply` et `isAuthenticated` |
| `src/components/CommentSection.jsx` | - Gestion de l'etat de reponse<br>- Formulaire contextuel (commentaire vs reponse)<br>- Props `articleTitle` et `articleSlug` |
| `src/pages/Article.jsx` | - Passage de `articleTitle` et `articleSlug` a `CommentSection` |
| `netlify/functions/notify-new-comment.js` | - Nouvelle fonction pour notifications email |

### Fichiers crees

| Fichier | Description |
|---------|-------------|
| `add-comment-replies.sql` | Script SQL de migration |
| `run-comment-replies-migration.mjs` | Script de verification et instructions |
| `NOUVELLES_FONCTIONNALITES_COMMENTAIRES.md` | Cette documentation |

## 5. Tests Recommandes

### Test de la notification email

1. Poster un nouveau commentaire sur un article
2. Verifier que Diana recoit un email de notification
3. Cliquer sur le lien dans l'email pour verifier qu'il redirige vers l'article

### Test des reponses

1. Se connecter avec un compte utilisateur
2. Aller sur un article avec des commentaires
3. Cliquer sur "Repondre" sous un commentaire
4. Verifier que le formulaire affiche "Repondre a [Nom]"
5. Soumettre la reponse
6. Verifier que la reponse apparait en retrait sous le commentaire parent
7. Verifier que Diana recoit un email indiquant qu'il s'agit d'une reponse

### Test de l'affichage

1. Verifier l'affichage des commentaires avec et sans reponses
2. Tester sur mobile (responsive)
3. Tester en mode sombre (dark mode)

## 6. Configuration Production

### Variables d'environnement Netlify

Verifier que ces variables sont definies :

```
RESEND_API_KEY=xxx
FROM_EMAIL=Diana <noreply@resend.dev>
DIANA_EMAIL=diana@covendediana.ch
SUPABASE_URL=xxx
SUPABASE_SERVICE_KEY=xxx
```

### Deploiement

1. Executer la migration SQL dans Supabase
2. Verifier les variables d'environnement Netlify
3. Deployer le code sur Netlify
4. Tester les fonctionnalites en production

## 7. Limitations et Ameliorations Futures

### Limitations actuelles

- Pas de reponses aux reponses (1 niveau uniquement)
- Tous les commentaires sont approuves automatiquement
- Pas de moderation par email (il faut se connecter au dashboard)

### Ameliorations possibles

- Ajouter un bouton "Repondre" dans l'email de notification
- Permettre de moderer (approuver/rejeter) depuis l'email
- Ajouter des notifications pour l'auteur du commentaire parent lors d'une reponse
- Supporter plusieurs niveaux de reponses
- Ajouter une option pour desactiver les notifications par article

## 8. Support

Pour toute question ou probleme :

1. Verifier la console du navigateur pour les erreurs
2. Verifier les logs Netlify Functions
3. Verifier les logs Supabase
4. Contacter le developpeur si necessaire
