import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jllzzkqlqaoiotluyexb.supabase.co', // <-- replace this
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbHp6a3FscWFvaW90bHV5ZXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjYyMzAsImV4cCI6MjA2NzEwMjIzMH0.r9UQmqAx93DrXxFroDu_Bb07BioJWMga7CRa0O1td04' // <-- replace this
);

const testEmail = 'jolene_fletcher@hotmail.com'; // <-- use your email
const testPassword = 'Test1234!';

async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (error) {
    console.error('❌ Signup error:', error.message);
  } else {
    console.log('✅ Signup successful — check your email!');
  }
}

run();
