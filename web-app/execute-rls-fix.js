/**
 * Execute RLS Security Fix Script
 * This script applies the database security policies needed for document generation
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function executeRLSFix() {
  console.log('🔧 Executing RLS Security Fix...');
  
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Read the SQL file
  const sqlPath = path.join(__dirname, '..', 'supabase', 'fix-rls-security.sql');
  
  try {
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('📄 Loaded SQL file:', sqlPath);
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🎯 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\n${i + 1}. Executing: ${statement.substring(0, 80)}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          query: statement 
        });
        
        if (error) {
          console.log(`⚠️  Statement ${i + 1} result:`, error.message);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} error:`, err.message);
      }
    }
    
    console.log('\n🎉 RLS Security Fix execution completed!');
    console.log('\n🧪 Now test document generation to verify the fix...');
    
  } catch (error) {
    console.error('❌ Error executing RLS fix:', error.message);
    process.exit(1);
  }
}

// Execute the fix
executeRLSFix().catch(console.error);