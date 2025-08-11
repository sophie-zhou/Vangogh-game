// Test script to check famous bucket images
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testFamousImages() {
  console.log('🎨 Testing famous bucket images...\n');
  
  try {
    // List all files in the famous bucket
    const { data: files, error } = await supabase.storage
      .from('famous')
      .list('', { limit: 100 });
    
    if (error) {
      console.log(`❌ Error listing famous bucket: ${error.message}`);
      return;
    }
    
    if (!files || files.length === 0) {
      console.log('❌ No files found in famous bucket');
      return;
    }
    
    console.log(`📁 Found ${files.length} files in famous bucket:\n`);
    
    // Test each image URL
    for (const file of files) {
      const imageUrl = `https://mxmiemrnoemqieyacdhz.supabase.co/storage/v1/object/public/famous/${encodeURIComponent(file.name)}`;
      console.log(`🖼️  ${file.name}`);
      console.log(`🔗 URL: ${imageUrl}`);
      
      // Test if the image is accessible
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log(`✅ Status: ${response.status} - Accessible`);
        } else {
          console.log(`❌ Status: ${response.status} - Not accessible`);
        }
      } catch (fetchError) {
        console.log(`❌ Fetch error: ${fetchError.message}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error testing images:', error);
  }
}

// Run the test
testFamousImages(); 