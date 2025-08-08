const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugErrorResponse() {
  console.log('🔍 Debugging error response...\n');
  
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
      
      // Test GET request and get the error response
      try {
        const response = await fetch(urlData.publicUrl, { 
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);
        
        // Get the error response body
        const errorBody = await response.text();
        console.log(`Error Response: ${errorBody}`);
        
        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(errorBody);
          console.log(`Parsed Error:`, errorJson);
        } catch (parseError) {
          console.log(`Could not parse as JSON: ${parseError.message}`);
        }
        
      } catch (fetchError) {
        console.log(`Fetch error: ${fetchError.message}`);
      }
      
    } else {
      console.log('❌ Could not generate public URL');
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n🎉 Debug completed!');
}

// Run the debug
debugErrorResponse().catch(console.error); 