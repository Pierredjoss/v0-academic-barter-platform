# Guide d'Administration - Plateforme ɖyɔ̌

## Vue d'ensemble du système administrateur

Ce guide explique les nouvelles fonctionnalités administrateur ajoutées à la plateforme ɖyɔ̌.

## Table des matières

1. [Architecture Administrateur](#architecture-administrateur)
2. [Accès Administrateur](#accès-administrateur)
3. [Tableau de Bord Administrateur](#tableau-de-bord-administrateur)
4. [Gestion des Signalements](#gestion-des-signalements)
5. [Gestion des Demandes Admin](#gestion-des-demandes-admin)
6. [Configuration](#configuration)

## Architecture Administrateur

### Rôles d'Utilisateur

La plateforme supporte maintenant 3 rôles d'utilisateur:

- **user**: Utilisateur normal pouvant créer des annonces et échanger
- **admin**: Administrateur avec accès complet au tableau de bord
- **manager**: Gestionnaire pouvant examiner les demandes admin et modérer le contenu

### Nouvelles Tables de Données

#### admin_requests
Gère les demandes de création de compte administrateur.

```sql
- id: UUID (clé primaire)
- user_id: UUID (référence à profiles)
- email: TEXT
- full_name: TEXT
- university: TEXT
- reason: TEXT
- status: TEXT ('pending', 'approved', 'rejected')
- reviewed_by: UUID (admin qui a examiné)
- reviewed_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### reported_listings
Gère les signalements d'annonces problématiques.

```sql
- id: UUID (clé primaire)
- listing_id: UUID (référence à listings)
- reported_by: UUID (utilisateur qui a signalé)
- reason: TEXT ('inappropriate_content', 'fake_item', 'duplicate', 'spam', 'other')
- description: TEXT
- status: TEXT ('pending', 'reviewed', 'resolved', 'dismissed')
- admin_notes: TEXT
- reviewed_by: UUID (admin qui a examiné)
- reviewed_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Accès Administrateur

### 1. Authentification Admin (Login)

**Route**: `/auth/admin-login`

Les administrateurs peuvent se connecter avec:
- Email
- Mot de passe

Le système vérifie que le rôle de l'utilisateur est "admin" ou "manager".

**Fonctionnalités**:
- Validation d'email et mot de passe
- Vérification du rôle administrateur
- Redirection automatique au tableau de bord si accès valide
- Messages d'erreur clairs

### 2. Demande d'Accès Admin (Signup)

**Route**: `/auth/admin-signup`

Les utilisateurs peuvent demander un accès administrateur avec:
- Nom complet
- Email
- Université
- Ville
- Mot de passe (avec exigences de sécurité)
- Raison de la demande

**Processus**:
1. Création du compte utilisateur
2. Création du profil avec rôle "user"
3. Création de la demande admin avec statut "pending"
4. Envoi d'une notification au gestionnaire de la plateforme
5. Message de confirmation à l'utilisateur

**Exigences du mot de passe**:
- Au moins 8 caractères
- Contient un chiffre
- Contient une majuscule

## Tableau de Bord Administrateur

**Route**: `/admin/dashboard`

Le tableau de bord affiche:

### Statistiques Principales

- **Publications**: Nombre total d'annonces
- **Actives**: Nombre d'annonces en cours
- **Vues**: Total des vues sur les annonces
- **Utilisateurs**: Nombre d'utilisateurs inscrits
- **Signalées**: Nombre d'annonces signalées
- **Échanges**: Nombre d'échanges complétés

### Sections du Tableau de Bord

1. **Cartes de Statistiques**: Vue d'ensemble rapide avec tendances
2. **Signalements en Attente**: Liste des 5 derniers signalements non examinés
3. **Actions Rapides**: Liens vers les sections de gestion

### Navigation Administrateur

Barre latérale avec accès à:
- Tableau de bord
- Publications
- Signalements
- Utilisateurs
- Demandes Admin
- Déconnexion

## Gestion des Signalements

**Route**: `/admin/reports`

### Fonctionnalités

#### Affichage des Signalements
- Filtrage par statut (pending, reviewed, resolved, dismissed)
- Affichage de tous les signalements ou filtrage par statut
- Tri par date (plus récents en premier)

#### Informations Affichées
- Titre de l'annonce
- Raison du signalement
- Description du rapport
- Auteur de l'annonce
- Statut de l'annonce
- Date du signalement

#### Actions Administrateur

**Accepter & Archiver**:
- Marque le signalement comme "resolved"
- Archive automatiquement l'annonce
- Génère une notification (future)

**Rejeter**:
- Marque le signalement comme "dismissed"
- Conserve l'annonce active
- Utilisé si le signalement n'est pas valide

### Raisons de Signalement
- Contenu inapproprié
- Article frauduleux
- Doublon
- Spam
- Autre

### Statuts de Signalement
- **pending**: En attente d'examen
- **reviewed**: Examiné par un admin
- **resolved**: Résolu (annonce archivée)
- **dismissed**: Rejeté (signalement invalide)

## Gestion des Demandes Admin

**Route**: `/admin/requests`

### Fonctionnalités

#### Affichage des Demandes
- Filtrage par statut (pending, approved, rejected)
- Affichage de toutes les demandes ou filtrage par statut
- Tri par date (plus récentes en premier)

#### Informations Affichées
- Nom du demandeur
- Email
- Université
- Raison de la demande
- Statut de la demande
- Date de la demande

#### Actions Administrateur

**Approuver**:
- Met à jour le statut à "approved"
- Change le rôle de l'utilisateur à "admin"
- Envoie un email de confirmation au nouvel admin
- Marque comme examiné avec date et administrateur

**Rejeter**:
- Met à jour le statut à "rejected"
- Envoie un email de rejet à l'utilisateur
- Conserve le compte en tant qu'utilisateur normal
- Marque comme examiné avec date et administrateur

### Statuts de Demande
- **pending**: En attente d'examen
- **approved**: Approuvée (utilisateur devient admin)
- **rejected**: Rejetée (compte reste utilisateur normal)

## Configuration

### Variables d'Environnement Requises

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Manager Contact
MANAGER_EMAIL=admin@dyo.platform
```

### Déploiement des Functions Supabase

Les fonctions suivantes doivent être déployées:

1. **send-admin-request-notification**
   - Envoie une notification au gestionnaire quand une demande admin est créée
   - Fichier: `supabase/functions/send-admin-request-notification/index.ts`

2. **send-admin-approval-notification**
   - Envoie une notification de bienvenue au nouvel administrateur
   - Fichier: `supabase/functions/send-admin-approval-notification/index.ts`

3. **send-admin-rejection-notification**
   - Envoie une notification de rejet à l'utilisateur
   - Fichier: `supabase/functions/send-admin-rejection-notification/index.ts`

**Déploiement**:
```bash
supabase functions deploy send-admin-request-notification
supabase functions deploy send-admin-approval-notification
supabase functions deploy send-admin-rejection-notification
```

### Migration de Base de Données

Exécuter le script SQL: `add_admin_support.sql`

```bash
# Dans Supabase SQL Editor
-- Copier et exécuter le contenu de add_admin_support.sql
```

## API Endpoints

### Signaler une Annonce

**POST** `/api/listings/report`

**Paramètres**:
```json
{
  "listingId": "uuid",
  "reason": "inappropriate_content|fake_item|duplicate|spam|other",
  "description": "texte optionnel"
}
```

**Réponse**:
```json
{
  "success": true,
  "report": {
    "id": "uuid",
    "listing_id": "uuid",
    "reported_by": "uuid",
    "reason": "string",
    "description": "string",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Intégration dans l'UI

### Bouton de Signalement

Ajouter le composant `ReportListingDialog` dans les pages d'annonces:

```tsx
import { ReportListingDialog } from "@/components/listings/report-listing-dialog"

const [reportOpen, setReportOpen] = useState(false)

// Dans le JSX
<ReportListingDialog
  listingId={listing.id}
  isOpen={reportOpen}
  onOpenChange={setReportOpen}
/>

<Button onClick={() => setReportOpen(true)}>
  Signaler cette annonce
</Button>
```

## Sécurité

### Politiques RLS (Row Level Security)

- Seuls les administrateurs peuvent accéder au tableau de bord admin
- Les utilisateurs ne peuvent signaler une annonce qu'une fois
- Les administrateurs peuvent examiner tous les signalements
- Les utilisateurs ne peuvent voir que leurs propres demandes admin

### Protection des Routes

Toutes les routes `/admin/*` incluent:
- Vérification de l'authentification
- Vérification du rôle (admin ou manager)
- Redirection automatique si non autorisé

## Prochaines Étapes

1. Configurer les variables d'environnement
2. Exécuter la migration SQL
3. Déployer les Supabase Functions
4. Tester les flux de création de compte admin
5. Intégrer le bouton de signalement dans les pages d'annonces
6. Configurer les emails de notification

## Support

Pour des questions ou problèmes:
- Consulter la documentation Supabase: https://supabase.com/docs
- Vérifier les logs des functions: Supabase Dashboard > Functions
- Examiner les erreurs en console: Browser DevTools
