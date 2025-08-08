const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listBucketContents() {
  console.log('📋 Listing contents of all storage buckets...\n');
  
  const buckets = ['real', 'plagiarized', 'supereasy', 'easy', 'difficult'];
  
  for (const bucket of buckets) {
    console.log(`📁 Bucket: ${bucket}`);
    
    try {
      // List all files in bucket
      const { data: listData, error: listError } = await supabase.storage
        .from(bucket)
        .list('', { limit: 100 });
      
      if (listError) {
        console.log(`❌ Error: ${listError.message}`);
        continue;
      }
      
      if (!listData || listData.length === 0) {
        console.log(`📭 Bucket is empty`);
      } else {
        console.log(`📄 Found ${listData.length} files:`);
        
        // Group files by extension
        const fileTypes = {};
        listData.forEach(file => {
          const ext = file.name.split('.').pop()?.toLowerCase() || 'no-extension';
          if (!fileTypes[ext]) fileTypes[ext] = [];
          fileTypes[ext].push(file.name);
        });
        
        // Display files by type
        Object.entries(fileTypes).forEach(([ext, files]) => {
          console.log(`  ${ext.toUpperCase()}: ${files.length} files`);
          if (files.length <= 5) {
            files.forEach(file => console.log(`    - ${file}`));
          } else {
            console.log(`    - ${files.slice(0, 3).join(', ')}... and ${files.length - 3} more`);
          }
        });
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('🎉 Bucket listing completed!');
}

// Run the script
listBucketContents().catch(console.error); 