const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listFolderContents() {
  console.log('📋 Listing contents of folders within buckets...\n');
  
  const bucketFolders = {
    'real': 'All of VanGogh',
    'plagiarized': 'Plagiarized', 
    'supereasy': 'Supereasy',
    'easy': 'Easy',
    'difficult': 'Difficult'
  };
  
  for (const [bucket, folder] of Object.entries(bucketFolders)) {
    console.log(`📁 Bucket: ${bucket} | Folder: ${folder}`);
    
    try {
      // List files in the specific folder
      const { data: listData, error: listError } = await supabase.storage
        .from(bucket)
        .list(folder, { limit: 20 });
      
      if (listError) {
        console.log(`❌ Error: ${listError.message}`);
        continue;
      }
      
      if (!listData || listData.length === 0) {
        console.log(`📭 Folder is empty`);
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
        
        // Test access to first JPG file
        const jpgFiles = listData.filter(file => 
          file.name.toLowerCase().endsWith('.jpg') || 
          file.name.toLowerCase().endsWith('.jpeg')
        );
        
        if (jpgFiles.length > 0) {
          const testFile = jpgFiles[0];
          console.log(`🧪 Testing access to: ${testFile.name}`);
          
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(`${folder}/${testFile.name}`);
          
          if (urlData?.publicUrl) {
            console.log(`🔗 Public URL: ${urlData.publicUrl.substring(0, 80)}...`);
            
            // Test fetch
            try {
              const response = await fetch(urlData.publicUrl, { 
                method: 'HEAD',
                headers: { 'Cache-Control': 'no-cache' }
              });
              
              if (response.ok) {
                console.log(`✅ File accessible (HTTP ${response.status})`);
              } else {
                console.log(`❌ File not accessible (HTTP ${response.status})`);
              }
            } catch (fetchError) {
              console.log(`❌ Fetch error: ${fetchError.message}`);
            }
          }
        }
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('🎉 Folder listing completed!');
}

// Run the script
listFolderContents().catch(console.error); 