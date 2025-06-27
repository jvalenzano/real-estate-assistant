/**
 * Advanced RLS Fix Automation Attempt
 * Try multiple methods to execute the SQL
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function attemptRLSFix() {
  console.log('🔥 ATTEMPTING AGGRESSIVE RLS FIX AUTOMATION...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Try with anon key first (might work for some operations)
  const supabase = createClient(supabaseUrl, anonKey);
  
  // Read SQL file
  const sqlContent = fs.readFileSync('../supabase/fix-rls-security.sql', 'utf8');
  
  // Method 1: Try individual simple statements
  console.log('\n🎯 Method 1: Simple policy creation...');
  
  try {
    // Try creating a simple policy directly
    const { data, error } = await supabase
      .from('documents')
      .select('count')
      .limit(1);
    
    console.log('Database connection test:', error ? 'FAILED' : 'SUCCESS');
    
    if (!error) {
      console.log('✅ Basic database access working');
    }
  } catch (err) {
    console.log('❌ Database connection failed:', err.message);
  }
  
  // Method 2: Try REST API approach
  console.log('\n🎯 Method 2: REST API policy creation...');
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    console.log('REST API status:', response.status);
    
    if (response.ok) {
      const data = await response.text();
      console.log('REST API response:', data.substring(0, 100) + '...');
    }
  } catch (err) {
    console.log('❌ REST API failed:', err.message);
  }
  
  // Method 3: Check if we can modify policies via JS client
  console.log('\n🎯 Method 3: Client-side policy check...');
  
  try {
    // Try to understand current RLS status
    const { data, error } = await supabase
      .from('documents')
      .insert({
        id: '00000000-0000-4000-8000-000000000000',
        template_id: null,
        transaction_id: '00000000-0000-4000-8000-000000000001',
        property_id: 'test',
        user_id: '00000000-0000-4000-8000-000000000002',
        title: 'RLS Test',
        status: 'completed',
        visibility: 'private',
        file_url: 'test.pdf',
        field_data: {},
        metadata: {}
      });
    
    if (error) {
      console.log('RLS Policy Error Details:', error);
      if (error.code === '42501') {
        console.log('✅ CONFIRMED: RLS blocking insert (as expected)');
        console.log('🎯 RLS policies need to be updated via dashboard');
      }
    } else {
      console.log('🎉 UNEXPECTED: Insert succeeded! RLS might be fixed already');
    }
  } catch (err) {
    console.log('❌ RLS test failed:', err.message);
  }
  
  console.log('\n📋 CONCLUSION: Manual RLS fix via Supabase Dashboard required');
  console.log('📍 SQL file location: /Users/jasonvalenzano/realeagent-prototype/supabase/fix-rls-security.sql');
}

attemptRLSFix().catch(console.error);