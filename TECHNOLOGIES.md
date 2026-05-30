# Technologies utilisées dans ɖyɔ̌

## 🎨 FRONTEND

### Framework Principal
| Technologie | Version | Rôle |
|------------|---------|------|
| **Next.js** | 16.2.0 | Framework React avec App Router, SSR/SSG, API Routes |
| **React** | 19.2.4 | Librairie UI pour composants interactifs |
| **React DOM** | 19.2.4 | Rendu React pour le navigateur |
| **TypeScript** | 5.7.3 | Typage statique pour JavaScript |

### Styling & UI
| Technologie | Version | Rôle |
|------------|---------|------|
| **Tailwind CSS** | 4.2.0 | Framework CSS utilitaire pour le design |
| **@tailwindcss/postcss** | 4.2.0 | Intégration PostCSS pour Tailwind v4 |
| **tw-animate-css** | 1.3.3 | Animations CSS pour Tailwind |
| **class-variance-authority** | 0.7.1 | Gestion des variantes de composants |
| **clsx** | 2.1.1 | Utilitaire pour classes CSS conditionnelles |
| **tailwind-merge** | 3.3.1 | Fusion des classes Tailwind sans conflits |

### Composants UI (Radix UI)
| Technologie | Rôle |
|------------|------|
| **@radix-ui/react-*" | Composants headless accessibles (dialog, dropdown, tabs, etc.) |

### Animations
| Technologie | Version | Rôle |
|------------|---------|------|
| **framer-motion** | 12.38.0 | Animations fluides et transitions React |

### Formulaires
| Technologie | Version | Rôle |
|------------|---------|------|
| **react-hook-form** | 7.54.1 | Gestion des formulaires avec validation |
| **@hookform/resolvers** | 3.9.1 | Résolveurs de validation (Zod, Yup, etc.) |
| **zod** | 3.24.1 | Validation de schémas TypeScript |

### Cartographie
| Technologie | Version | Rôle |
|------------|---------|------|
| **leaflet** | 1.9.4 | Bibliothèque cartographique open-source |
| **react-leaflet** | 5.0.0 | Composants React pour Leaflet |
| **@types/leaflet** | 1.9.8 | Types TypeScript pour Leaflet |

### Icônes & Fonts
| Technologie | Version | Rôle |
|------------|---------|------|
| **lucide-react** | 0.564.0 | Icônes modernes et cohérentes |
| **Space_Grotesk** (Google Fonts) | - | Police principale (sans-serif) |
| **JetBrains_Mono** (Google Fonts) | - | Police monospace pour code |

### Thèmes
| Technologie | Version | Rôle |
|------------|---------|------|
| **next-themes** | 0.4.6 | Gestion des thèmes clair/sombre |

### Notifications Toast
| Technologie | Version | Rôle |
|------------|---------|------|
| **sonner** | 1.7.1 | Notifications toast modernes |
| **@radix-ui/react-toast** | 1.2.15 | Composant toast accessible (alternative) |

### Utilitaires
| Technologie | Version | Rôle |
|------------|---------|------|
| **cmdk** | 1.1.1 | Command palette / search |
| **date-fns** | 4.1.0 | Manipulation des dates |
| **react-resizable-panels** | 2.1.7 | Panels redimensionnables |
| **vaul** | 1.1.2 | Drawer mobile (basé sur Radix) |

---

## ⚙️ BACKEND

### Base de données & Auth
| Technologie | Version | Rôle |
|------------|---------|------|
| **Supabase** | ^2.102.1 | Base de données PostgreSQL + Auth + Realtime |
| **@supabase/supabase-js** | ^2.102.1 | Client JavaScript Supabase |
| **@supabase/ssr** | 0.10.0 | Support SSR pour Supabase Auth |

### Tables Supabase principales
- `profiles` - Profils utilisateurs
- `listings` - Annonces (avec géolocalisation lat/lng)
- `categories` - Catégories d'annonces
- `favorites` - Favoris utilisateurs
- `conversations` - Conversations entre utilisateurs
- `conversation_participants` - Participants aux conversations
- `messages` - Messages privés
- `exchanges` - Échanges proposés
- `notifications` - Notifications utilisateurs
- `payments` - Paiements des microtaxes

### Storage
- **Supabase Storage** - Stockage des images d'annonces (bucket: `listing-images`)

### Realtime
- **Supabase Realtime** - Mises à jour en temps réel pour:
  - Messages (nouveaux messages)
  - Notifications (nouvelles notifications)
  - Échanges (statut des échanges)

---

## 🛠️ OUTILS & CONFIGURATION

### Build & Dev
| Technologie | Version | Rôle |
|------------|---------|------|
| **PostCSS** | ^8.5 | Transformateur CSS |
| **@tailwindcss/postcss** | 4.2.0 | Plugin PostCSS pour Tailwind |
| **autoprefixer** | 10.4.20 | Préfixes CSS automatiques |

### Analytics
| Technologie | Version | Rôle |
|------------|---------|------|
| **@vercel/analytics** | 1.6.1 | Analytics Vercel pour le trafic |

---

## 🏗️ ARCHITECTURE

### Structure des dossiers
```
app/                    # Next.js App Router
  (dashboard)/          # Routes protégées (authentifiées)
    conversations/        # Messagerie
    explore/              # Exploration des annonces
    notifications/        # Centre de notifications
    profile/              # Profil utilisateur
    publish/              # Publication d'annonces
    settings/             # Paramètres
  (landing)/             # Pages publiques (landing, about)
  api/                    # API Routes (si nécessaire)
  auth/                   # Routes d'authentification

components/             # Composants React
  conversations/         # Composants de messagerie
  dashboard/             # Composants du tableau de bord
  explore/               # Composants d'exploration (filtres, grille)
  landing/               # Composants de la landing page
  listings/              # Composants d'annonces
  notifications/         # Composants de notifications
  profile/               # Composants de profil
  publish/               # Composants de publication
  settings/              # Composants de paramètres
  ui/                    # Composants UI réutilisables (shadcn)

hooks/                  # Hooks React personnalisés
  use-geolocation.ts     # Hook de géolocalisation

lib/                    # Utilitaires
  supabase/              # Clients Supabase (server/client)
  utils.ts               # Fonctions utilitaires
  geocoding.ts           # Géocodage des villes

styles/                 # Styles globaux
  globals.css            # CSS global + variables Tailwind
```

### Flux de données
1. **Authentification** : Supabase Auth (email/password)
2. **Publication** : Formulaire → Création annonce (pending_payment) → Paiement 50FCFA → Activation
3. **Exploration** : Filtres (catégorie, ville, distance, recherche) → Grille d'annonces
4. **Messagerie** : Contact → Création conversation → Messages temps réel
5. **Échanges** : Proposition → Notification → Acceptation/Refus

### Sécurité
- **RLS (Row Level Security)** : Toutes les tables protégées par politiques Supabase
- **Middleware** : Vérification d'authentification pour routes protégées
- **Stockage** : Images accessibles uniquement par propriétaire ou publiquement

---

## 📱 FONCTIONNALITÉS CLÉS

### Géolocalisation
- Détection automatique avec permission utilisateur
- Filtre par ville ou rayon de 50km
- Coordonnées GPS stockées dans listings (latitude, longitude)

### Paiement (Microtaxe)
- Paiement 50 FCFA par annonce via Mobile Money ou Carte
- Statut `pending_payment` → `active` après confirmation
- Table `payments` pour historique

### Messagerie temps réel
- Conversations liées aux annonces
- Messages instantanés (Supabase Realtime)
- Notifications de nouveaux messages

### Recherche & Filtres
- Recherche textuelle avec debounce (400ms)
- Filtres par catégorie, état, localisation
- Tri par date, popularité

---

Dernière mise à jour : Mai 2026
