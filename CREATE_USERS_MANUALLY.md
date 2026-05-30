# Créer les utilisateurs béninois (Méthode manuelle)

## Méthode 1: Via l'interface Supabase (Recommandé)

1. Va dans **Supabase Dashboard** → **Authentication** → **Users**
2. Clique sur **"Add user"** (bouton vert en haut à droite)
3. Crée ces 3 utilisateurs un par un :

### Utilisateur 1: Koffi
- **Email**: `koffi@uac.bj`
- **Password**: `Password123!`
- **User Metadata**:
```json
{
  "full_name": "Koffi Mensah",
  "university": "Universite d'Abomey-Calavi (UAC)",
  "city": "Abomey-Calavi"
}
```

### Utilisateur 2: Aminata
- **Email**: `aminata@epac.bj`
- **Password**: `Password123!`
- **User Metadata**:
```json
{
  "full_name": "Aminata Bakary",
  "university": "Ecole Polytechnique d'Abomey-Calavi (EPAC)",
  "city": "Cotonou"
}
```

### Utilisateur 3: Papa
- **Email**: `papa@up.bj`
- **Password**: `Password123!`
- **User Metadata**:
```json
{
  "full_name": "Papa Ali",
  "university": "Universite de Parakou (UP)",
  "city": "Parakou"
}
```

## Méthode 2: Via le script Node.js

1. Assure-toi que `@supabase/supabase-js` est installé:
```bash
npm install @supabase/supabase-js
```

2. Exécute le script:
```bash
node create_benin_users.js
```

3. Vérifie dans Supabase Dashboard → Authentication → Users que les 3 utilisateurs apparaissent

## Méthode 3: Via l'application web

1. Démarre l'application:
```bash
npm run dev
```

2. Va sur `http://localhost:3000/auth/sign-up`

3. Crée les 3 comptes manuellement avec les informations ci-dessus

## Après création des utilisateurs

Une fois les utilisateurs créés, exécute ce SQL dans **Supabase Dashboard → SQL Editor** pour créer leurs annonces:

```sql
-- Annonce 1: Koffi (Abomey-Calavi)
INSERT INTO listings (id, user_id, title, description, category_id, condition, exchange_type, city, status, views, created_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440001',
    id,
    'Manuel de Mathematiques L1-L2 - Analyse et Algebre',
    'Livre complet pour les cours de mathematiques a l''UAC. Tres bon etat, quelques annotations au crayon. Ideal pour les etudiants en licence scientifique. Disponible sur le campus d''Abomey-Calavi.',
    cat.id,
    'good',
    'in_person',
    'Abomey-Calavi',
    'active',
    15,
    NOW()
FROM auth.users u
CROSS JOIN (SELECT id FROM categories WHERE name = 'books') cat
WHERE u.email = 'koffi@uac.bj'
ON CONFLICT (id) DO NOTHING;

-- Annonce 2: Aminata (Cotonou)
INSERT INTO listings (id, user_id, title, description, category_id, condition, exchange_type, city, status, views, created_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440002',
    id,
    'Notes EPAC - Genie Civil et Construction',
    'Notes completes des 3 annees de genie civil a l''EPAC. Inclus les TD corriges, examens passes et resumes de cours. Format PDF + version imprimee disponible. Quartier Ganhi, Cotonou.',
    cat.id,
    'like_new',
    'both',
    'Cotonou',
    'active',
    12,
    NOW()
FROM auth.users u
CROSS JOIN (SELECT id FROM categories WHERE name = 'notes') cat
WHERE u.email = 'aminata@epac.bj'
ON CONFLICT (id) DO NOTHING;

-- Annonce 3: Papa (Parakou)
INSERT INTO listings (id, user_id, title, description, category_id, condition, exchange_type, city, status, views, created_at)
SELECT 
    '660e8400-e29b-41d4-a716-446655440003',
    id,
    'Kit Laboratoire Biologie Chimie',
    'Materiel complet pour les TP de biologie et chimie : microscope, tubes a essai, pipettes, lames et lamelles. Achete pour licence mais peu utilise. Universite de Parakou, campus UP.',
    cat.id,
    'like_new',
    'in_person',
    'Parakou',
    'active',
    8,
    NOW()
FROM auth.users u
CROSS JOIN (SELECT id FROM categories WHERE name = 'lab-equipment') cat
WHERE u.email = 'papa@up.bj'
ON CONFLICT (id) DO NOTHING;
```

## Test de connexion

Une fois tout créé, teste avec:
- **Email**: `koffi@uac.bj`
- **Password**: `Password123!`
