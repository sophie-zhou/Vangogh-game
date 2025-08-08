const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testUpload() {
  console.log('🧪 Testing single file upload...\n');
  
  // Test with a single file
  const testFile = 'public/paintings/supereasy/supereasy/000.png';
  
  if (!fs.existsSync(testFile)) {
    console.log(`❌ Test file not found: ${testFile}`);
    return;
  }
  
  console.log(`📁 Testing upload to bucket: supereasy`);
  console.log(`📄 File: ${testFile}`);
  
  try {
    const fileBuffer = fs.readFileSync(testFile);
    
    console.log('📤 Attempting upload...');
    
    const { data, error } = await supabase.storage
      .from('supereasy')
      .upload('Supereasy/000.png', fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.log(`❌ Upload failed: ${error.message}`);
      console.log(`🔍 Error details:`, error);
    } else {
      console.log(`✅ Upload successful!`);
      console.log(`📎 File path: ${data.path}`);
    }
  } catch (uploadError) {
    console.log(`❌ Exception occurred: ${uploadError.message}`);
    console.log(`🔍 Full error:`, uploadError);
  }
}

// Run the test
testUpload().catch(console.error); 