const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Supabase client configuration...\n');

// Check environment variables
console.log('Environment variables:');
console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}`);
console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (length: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ')' : 'NOT SET'}`);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('✅ Supabase client initialized');

async function testClient() {
  try {
    console.log('\n🧪 Testing basic connection...');
    
    // Test listing buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log(`❌ Buckets error: ${bucketsError.message}`);
      return;
    }
    
    console.log(`✅ Found ${buckets.length} buckets`);
    
    // Test listing files in real bucket
    console.log('\n🧪 Testing file listing...');
    const { data: files, error: filesError } = await supabase.storage
      .from('real')
      .list('All of VanGogh', { limit: 5 });
    
    if (filesError) {
      console.log(`❌ Files error: ${filesError.message}`);
      return;
    }
    
    console.log(`✅ Found ${files.length} files in real bucket`);
    
    if (files && files.length > 0) {
      console.log('📄 Sample files:');
      files.slice(0, 3).forEach(file => {
        console.log(`  - ${file.name}`);
      });
    }
    
    // Test getting public URL
    if (files && files.length > 0) {
      const testFile = files.find(f => f.name.endsWith('.jpg'))
      if (testFile) {
        console.log('\n🧪 Testing public URL generation...');
        const { data: urlData } = supabase.storage
          .from('real')
          .getPublicUrl(`All of VanGogh/${testFile.name}`);
        
        if (urlData?.publicUrl) {
          console.log(`✅ Public URL generated: ${urlData.publicUrl.substring(0, 80)}...`);
          
          // Test fetching the URL
          try {
            const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
            console.log(`✅ Image accessible: ${response.status} ${response.statusText}`);
          } catch (fetchError) {
            console.log(`❌ Image fetch error: ${fetchError.message}`);
          }
        } else {
          console.log('❌ Could not generate public URL');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testClient().then(() => {
  console.log('\n🎉 Supabase client test completed!');
}).catch(console.error); 