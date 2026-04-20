

# Plan — Site SAMAYOO FLOWERS 🌸

Création d'un site vitrine élégant et romantique pour votre fleuristerie, avec panier d'achat (style Amazon), galerie défilante, et navigation interactive.

## 1. Identité visuelle

- **Palette élégante & romantique** : rose poudré, blush, ivoire, doré, vert sauge
- **Typographie** : Playfair Display (titres serif raffinés) + Inter (texte)
- **Ambiance** : photos grand format, espaces aérés, micro-animations douces

## 2. Structure des pages (routes séparées pour SEO)

```text
/              → Accueil (hero + carrousel + bouquets phares)
/boutique      → Catalogue de bouquets/compositions
/galerie       → Portfolio des créations
/a-propos      → Histoire de SAMAYOO FLOWERS
/contact       → Formulaire contact / commande sur demande
/panier        → Récapitulatif du panier + finalisation
```

## 3. Fonctionnalités demandées

### 🛒 Panier d'achat (style Amazon)
- Bouton **« Ajouter au panier »** sur chaque bouquet
- **Icône panier** dans le header avec compteur (badge rouge)
- Page `/panier` : liste des articles, quantités modifiables, suppression, total
- Bouton **« Valider la commande »** → déclenche le message de remerciement
- Persistance via `localStorage` (le panier reste après rafraîchissement)

### 💌 Message de remerciement après achat
- Modal/page de confirmation après validation
- Animation florale, message personnalisé : *« Merci pour votre commande chez SAMAYOO FLOWERS 🌸 »*
- Numéro de commande généré + récap

### 🖼️ Photos qui défilent (carrousel)
- **Carrousel automatique** sur la page d'accueil (hero)
- Défilement toutes les 4s, transitions fade élégantes
- Indicateurs cliquables + flèches navigation
- Utilisation du composant `carousel.tsx` déjà présent

### 🎯 Onglet actif entouré dans le menu
- Page courante : encadré doré + fond rose poudré
- Utilisation de `activeProps` de TanStack Router (`<Link activeProps={{className: "..."}}/>`)

### ✨ Effet au survol des onglets
- Soulignement animé qui se déploie de gauche à droite (effet `story-link`)
- Légère élévation + changement de couleur vers le doré
- Transition fluide 300ms

## 4. Composants à créer

| Fichier | Rôle |
|---|---|
| `src/routes/__root.tsx` | Header avec nav + icône panier + Footer |
| `src/routes/index.tsx` | Hero carrousel + bouquets vedettes |
| `src/routes/boutique.tsx` | Grille de bouquets avec bouton ajouter |
| `src/routes/galerie.tsx` | Mosaïque de photos |
| `src/routes/a-propos.tsx` | Histoire & valeurs |
| `src/routes/contact.tsx` | Formulaire (nom, email, message, type d'événement) |
| `src/routes/panier.tsx` | Récap panier + validation |
| `src/components/Header.tsx` | Navigation + logo + compteur panier |
| `src/components/Footer.tsx` | Coordonnées + réseaux sociaux |
| `src/components/BouquetCard.tsx` | Carte produit réutilisable |
| `src/components/HeroCarousel.tsx` | Carrousel photos automatique |
| `src/components/ThankYouModal.tsx` | Modal de remerciement |
| `src/context/CartContext.tsx` | État global du panier (Context + localStorage) |
| `src/data/bouquets.ts` | Données des bouquets (nom, prix, image, description) |

## 5. Concernant votre fichier C.rar

Je l'extrairai en mode implémentation et **récupérerai vos textes, images et infos de contact** pour les intégrer. Si certains éléments ne sont pas dans une stack compatible (ex: PHP, WordPress), je migrerai uniquement le contenu (textes/images), pas le code.

## 6. Détails techniques

- **Stack** : TanStack Start (déjà en place) + Tailwind CSS + shadcn/ui
- **Routes séparées** (pas d'ancres `#`) → meilleur SEO + meta tags par page
- **Panier** : React Context + persistance `localStorage`
- **Carrousel** : composant `carousel.tsx` (Embla) déjà disponible
- **Animations** : classes Tailwind `animate-fade-in`, `hover-scale`, `story-link`
- **Toast de confirmation** : via `sonner` (déjà installé)
- **Images placeholder** : générées via Lovable AI puis remplaçables par les vôtres

## 7. Étapes d'implémentation

1. Extraction du C.rar + récupération du contenu utilisable
2. Mise en place du thème (couleurs, polices, tokens dans `styles.css`)
3. Création du Header avec navigation animée + état actif
4. Création des 6 routes principales avec meta tags SEO
5. Implémentation du CartContext + page panier + modal remerciement
6. Carrousel d'accueil + galerie photos
7. Formulaire de contact stylisé
8. Tests responsive (mobile/desktop) + animations

