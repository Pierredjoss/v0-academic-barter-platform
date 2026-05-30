// =====================================================
// SCRIPT NODE.JS - Créer les 3 utilisateurs béninois
// =====================================================
// À exécuter avec: node create_benin_users.js
// =====================================================

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const SUPABASE_URL = 'https://hvuanbavdwskskrsjnvi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dWFuYmF2ZHdza3NrcnNqbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODI0MDUsImV4cCI6MjA1OTc1ODQwNX0.F84R6PgiXs4j9lCy4UvgOF2d2xMd5BJ71pPyNZiWqQU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const users = [
  {
    email: 'koffi@uac.bj',
    password: 'Password123!',
    full_name: 'Koffi Mensah',
    university: 'Universite d\'Abomey-Calavi (UAC)',
    city: 'Abomey-Calavi'
  },
  {
    email: 'aminata@epac.bj',
    password: 'Password123!',
    full_name: 'Aminata Bakary',
    university: 'Ecole Polytechnique d\'Abomey-Calavi (EPAC)',
    city: 'Cotonou'
  },
  {
    email: 'papa@up.bj',
    password: 'Password123!',
    full_name: 'Papa Ali',
    university: 'Universite de Parakou (UP)',
    city: 'Parakou'
  }
];

async function createUsers() {
  console.log('Creating Benin users...\n');

  for (const user of users) {
    try {
      // 1. Créer l'utilisateur dans auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.full_name,
            university: user.university,
            city: user.city
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          console.log(`✓ ${user.email} - Already exists`);
        } else {
          console.error(`✗ ${user.email} - Error: ${signUpError.message}`);
        }
        continue;
      }

      if (signUpData.user) {
        console.log(`✓ ${user.email} - Created successfully`);
        console.log(`  ID: ${signUpData.user.id}`);
        console.log(`  Name: ${user.full_name}`);
        console.log(`  University: ${user.university}`);
        console.log(`  City: ${user.city}\n`);
      }
    } catch (error) {
      console.error(`✗ ${user.email} - Unexpected error: ${error.message}`);
    }
  }

  console.log('\n========================================');
  console.log('Users created! You can now login with:');
  console.log('========================================');
  console.log('Email: koffi@uac.bj');
  console.log('Password: Password123!');
  console.log('');
  console.log('Email: aminata@epac.bj');
  console.log('Password: Password123!');
  console.log('');
  console.log('Email: papa@up.bj');
  console.log('Password: Password123!');
  console.log('========================================');
}

createUsers();
