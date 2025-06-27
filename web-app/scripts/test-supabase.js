#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('📋 Testing Supabase connection...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('\n1️⃣ Testing basic connection...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Failed to list buckets:', bucketsError);
    } else {
      console.log('✅ Connected to Supabase Storage');
      console.log(`📦 Found ${buckets?.length || 0} buckets:`, buckets?.map(b => b.name).join(', ') || 'none');
    }

    // Test 2: Check if documents bucket exists
    console.log('\n2️⃣ Checking for documents bucket...');
    const documentsBucket = buckets?.find(b => b.name === 'documents');
    
    if (documentsBucket) {
      console.log('✅ Documents bucket exists');
    } else {
      console.log('⚠️  Documents bucket not found - run the SQL setup script to create it');
    }

    // Test 3: Try to upload a test file
    if (documentsBucket) {
      console.log('\n3️⃣ Testing file upload...');
      const testContent = 'Test document content';
      const testFile = new Blob([testContent], { type: 'text/plain' });
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload('test/test-file.txt', testFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('❌ Upload test failed:', uploadError);
      } else {
        console.log('✅ Upload test successful:', uploadData.path);
        
        // Clean up test file
        await supabase.storage.from('documents').remove(['test/test-file.txt']);
        console.log('🧹 Cleaned up test file');
      }
    }

    // Test 4: Check database tables
    console.log('\n4️⃣ Checking database tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('document_templates')
      .select('id')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Database tables not accessible:', tablesError);
      console.log('⚠️  Run the database setup SQL to create required tables');
    } else {
      console.log('✅ Database tables accessible');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection().then(() => {
  console.log('\n✨ Test complete');
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});