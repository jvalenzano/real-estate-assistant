#!/usr/bin/env node
/**
 * Test script to debug document generation flow with UUID validation
 * Run with: node test-document-generation.js
 */

const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

// UUID validation function
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const BASE_URL = 'http://localhost:3000';

async function testDocumentGeneration() {
  console.log('🧪 Testing Document Generation Flow with UUID validation...\n');
  
  try {
    // Generate proper UUID for transaction
    const transactionId = uuidv4();
    console.log(`Generated transaction ID: ${transactionId}`);
    console.log(`Transaction ID is valid UUID: ${isValidUUID(transactionId)}\n`);
    
    // 1. Test document generation
    console.log('1️⃣ Testing document generation...');
    
    const generateResponse = await fetch(`${BASE_URL}/api/v1/documents/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateCode: 'CA_RPA',
        formData: {
          propertyAddress: '123 Test Street, San Diego, CA',
          buyerName: 'Test Buyer',
          offerPrice: 750000,
          propertyId: 'ML81234567'
        },
        transactionId: transactionId
      })
    });
    
    const generateResult = await generateResponse.json();
    console.log('Generation Response:', JSON.stringify(generateResult, null, 2));
    
    if (!generateResult.success) {
      console.error('❌ Document generation failed');
      return;
    }
    
    const documentId = generateResult.data.documentId;
    console.log(`✅ Document generated with ID: ${documentId}`);
    console.log(`Document ID is valid UUID: ${isValidUUID(documentId)}\n`);
    
    // 2. Test document retrieval
    console.log('2️⃣ Testing document retrieval...');
    
    const retrieveResponse = await fetch(`${BASE_URL}/api/v1/documents/${documentId}`);
    const retrieveResult = await retrieveResponse.json();
    console.log('Retrieval Response:', JSON.stringify(retrieveResult, null, 2));
    
    if (retrieveResult.success) {
      console.log('✅ Document retrieved successfully\n');
    } else {
      console.log('❌ Document retrieval failed\n');
    }
    
    // 3. Test debug endpoint
    console.log('3️⃣ Testing debug endpoint...');
    
    const debugResponse = await fetch(`${BASE_URL}/api/debug/documents`);
    const debugResult = await debugResponse.json();
    console.log('Debug Response:', JSON.stringify(debugResult, null, 2));
    
    console.log('\n🔍 Analysis:');
    console.log(`- Generated Transaction ID: ${transactionId} (Valid: ${isValidUUID(transactionId)})`);
    console.log(`- Generated Document ID: ${documentId} (Valid: ${isValidUUID(documentId)})`);
    console.log(`- Documents in DB: ${debugResult.debug?.database?.documents?.count || 0}`);
    console.log(`- Files in Storage: ${debugResult.debug?.storage?.files?.count || 0}`);
    console.log(`- Database Save Success: ${generateResult.data?.debug?.databaseSave?.success || 'unknown'}`);
    if (generateResult.data?.debug?.databaseSave?.error) {
      console.log(`- Database Error: ${JSON.stringify(generateResult.data.debug.databaseSave.error, null, 2)}`);
    }
    console.log(`- Generation Debug: ${JSON.stringify(generateResult.data.debug, null, 2)}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

if (require.main === module) {
  testDocumentGeneration();
}

module.exports = { testDocumentGeneration };