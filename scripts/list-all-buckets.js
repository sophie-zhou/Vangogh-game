const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listAllBuckets() {
  console.log('📋 Listing all available buckets...\n');
  
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log(`❌ Error listing buckets: ${error.message}`);
      return;
    }
    
    if (!buckets || buckets.length === 0) {
      console.log('📭 No buckets found');
      return;
    }
    
    console.log(`📁 Found ${buckets.length} buckets:`);
    
    for (const bucket of buckets) {
      console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      
      // Try to list files in this bucket
      try {
        const { data: files, error: listError } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 5 });
        
        if (listError) {
          console.log(`    ❌ Error listing files: ${listError.message}`);
        } else {
          console.log(`    📄 Files: ${files?.length || 0}`);
          if (files && files.length > 0) {
            files.slice(0, 3).forEach(file => {
              console.log(`      - ${file.name}`);
            });
            if (files.length > 3) {
              console.log(`      ... and ${files.length - 3} more`);
            }
          }
        }
      } catch (listError) {
        console.log(`    ❌ Exception listing files: ${listError.message}`);
      }
      
      console.log(''); // Empty line for readability
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('🎉 Bucket listing completed!');
}

// Run the script
listAllBuckets().catch(console.error); 