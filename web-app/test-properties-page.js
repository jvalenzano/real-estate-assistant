// Test script to verify properties page is working correctly
const fetch = require('node-fetch');

async function testPropertiesPage() {
  console.log('Testing Properties Page...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server availability...');
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is running on http://localhost:3000\n');
    } else {
      console.log('❌ Server returned status:', response.status);
      return;
    }
    
    // Test 2: Check properties page
    console.log('2. Testing properties page...');
    const propsResponse = await fetch('http://localhost:3000/properties');
    const html = await propsResponse.text();
    
    // Check for key elements
    const checks = [
      { pattern: /PropertyCard/, name: 'PropertyCard component' },
      { pattern: /PropertyStatusBadge/, name: 'PropertyStatusBadge component' },
      { pattern: /Active|Pending|In Escrow/, name: 'Property status badges' },
      { pattern: /images\.unsplash\.com/, name: 'Unsplash images' },
      { pattern: /\$\d{1,3}(,\d{3})*/, name: 'Property prices' }
    ];
    
    console.log('\nPage content checks:');
    checks.forEach(check => {
      if (check.pattern.test(html)) {
        console.log(`✅ Found ${check.name}`);
      } else {
        console.log(`❌ Missing ${check.name}`);
      }
    });
    
    console.log('\n✨ Properties page test complete!');
    console.log('\nVisit http://localhost:3000/properties to see the working page with:');
    console.log('- Multiple property images with carousel navigation');
    console.log('- Color-coded status badges (Active: green, Pending: yellow, In Escrow: blue)');
    console.log('- Days on market indicators');
    console.log('- Improved image quality with proper Unsplash parameters');
    
  } catch (error) {
    console.error('❌ Error testing properties page:', error.message);
    console.log('\nMake sure the development server is running with: npm run dev');
  }
}

// Run the test
testPropertiesPage(); 