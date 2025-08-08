const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAnonAccess() {
  console.log('🔍 Testing anon user access to storage buckets...\n');
  
  const buckets = ['real', 'plagiarized', 'supereasy', 'easy', 'difficult'];
  
  for (const bucket of buckets) {
    console.log(`📁 Testing bucket: ${bucket}`);
    
    try {
      // Test 1: List files
      const { data: listData, error: listError } = await supabase.storage
        .from(bucket)
        .list('', { limit: 5 });
      
      if (listError) {
        console.log(`❌ List error: ${listError.message}`);
        continue;
      }
      
      console.log(`✅ Bucket accessible, found ${listData?.length || 0} files`);
      
      if (listData && listData.length > 0) {
        // Find JPG files
        const jpgFiles = listData.filter(file => 
          file.name.toLowerCase().endsWith('.jpg') || 
          file.name.toLowerCase().endsWith('.jpeg')
        );
        
        if (jpgFiles.length > 0) {
          console.log(`📸 Found ${jpgFiles.length} JPG files`);
          
          // Test first JPG file
          const testFile = jpgFiles[0];
          console.log(`🧪 Testing file: ${testFile.name}`);
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(testFile.name);
          
          if (urlData?.publicUrl) {
            console.log(`🔗 Public URL generated: ${urlData.publicUrl.substring(0, 80)}...`);
            
            // Test actual fetch
            try {
              const response = await fetch(urlData.publicUrl, { 
                method: 'HEAD',
                headers: { 'Cache-Control': 'no-cache' }
              });
              
              if (response.ok) {
                console.log(`✅ File accessible via HTTP (${response.status})`);
              } else {
                console.log(`❌ File not accessible: HTTP ${response.status}`);
              }
            } catch (fetchError) {
              console.log(`❌ Fetch error: ${fetchError.message}`);
            }
          } else {
            console.log(`❌ Could not generate public URL`);
          }
        } else {
          console.log(`⚠️  No JPG files found in bucket`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error testing bucket ${bucket}: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('🎉 Anon access test completed!');
}

// Run the test
testAnonAccess().catch(console.error); 