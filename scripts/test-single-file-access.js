const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSingleFileAccess() {
  console.log('🧪 Testing single file access...\n');
  
  // Test a specific file from the real bucket
  const bucket = 'real';
  const filePath = 'All of VanGogh/image1.jpg';
  
  console.log(`📁 Testing bucket: ${bucket}`);
  console.log(`📄 Testing file: ${filePath}`);
  
  try {
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    if (urlData?.publicUrl) {
      console.log(`🔗 Public URL: ${urlData.publicUrl}`);
      
      // Test fetch with different methods
      console.log('\n📡 Testing HTTP access...');
      
      // Method 1: HEAD request
      try {
        const headResponse = await fetch(urlData.publicUrl, { 
          method: 'HEAD',
          headers: { 'Cache-Control': 'no-cache' }
        });
        console.log(`HEAD request: ${headResponse.status} ${headResponse.statusText}`);
        console.log(`Headers:`, Object.fromEntries(headResponse.headers.entries()));
      } catch (headError) {
        console.log(`HEAD request failed: ${headError.message}`);
      }
      
      // Method 2: GET request
      try {
        const getResponse = await fetch(urlData.publicUrl, { 
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        });
        console.log(`GET request: ${getResponse.status} ${getResponse.statusText}`);
        console.log(`Content-Type: ${getResponse.headers.get('content-type')}`);
        console.log(`Content-Length: ${getResponse.headers.get('content-length')}`);
      } catch (getError) {
        console.log(`GET request failed: ${getError.message}`);
      }
      
    } else {
      console.log('❌ Could not generate public URL');
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n🎉 Test completed!');
}

// Run the test
testSingleFileAccess().catch(console.error); 