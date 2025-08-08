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

// Define the upload structure
const uploadStructure = {
  'real': {
    localPath: 'public/paintings/real/All of Van Gogh',
    bucketPath: 'All of VanGogh',
    filePattern: /^image\d+\.jpg$/
  },
  'plagiarized': {
    localPath: 'public/paintings/plagiarized/Plagiarized',
    bucketPath: 'Plagiarized',
    filePattern: /^plagiarized_\d+\.jpg$/
  },
  'supereasy': {
    localPath: 'public/paintings/supereasy/supereasy',
    bucketPath: 'Supereasy',
    filePattern: /^\d{3}\.png$/
  },
  'easy': {
    localPath: 'public/paintings/easy/easy',
    bucketPath: 'Easy',
    filePattern: /^\d{3}\.png$/
  },
  'difficult': {
    localPath: 'public/paintings/difficult/difficult',
    bucketPath: 'Difficult',
    filePattern: /^\d{3}\.png$/
  }
};

async function uploadImages() {
  console.log('🚀 Starting image upload to Supabase...\n');

  for (const [bucketName, config] of Object.entries(uploadStructure)) {
    console.log(`📁 Processing bucket: ${bucketName}`);
    
    try {
      // Check if local directory exists
      if (!fs.existsSync(config.localPath)) {
        console.log(`❌ Local path not found: ${config.localPath}`);
        continue;
      }

      // Get all files in the directory
      const files = fs.readdirSync(config.localPath);
      const imageFiles = files.filter(file => config.filePattern.test(file));
      
      console.log(`📸 Found ${imageFiles.length} images to upload`);

      // Upload each file
      for (const file of imageFiles) {
        const filePath = path.join(config.localPath, file);
        const storagePath = `${config.bucketPath}/${file}`;
        
        try {
          const fileBuffer = fs.readFileSync(filePath);
          
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileBuffer, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (error) {
            console.log(`❌ Failed to upload ${file}: ${error.message}`);
          } else {
            console.log(`✅ Uploaded: ${file}`);
          }
        } catch (uploadError) {
          console.log(`❌ Error uploading ${file}: ${uploadError.message}`);
        }
      }
      
      console.log(`✅ Completed bucket: ${bucketName}\n`);
      
    } catch (error) {
      console.log(`❌ Error processing bucket ${bucketName}: ${error.message}\n`);
    }
  }
  
  console.log('🎉 Upload process completed!');
}

// Run the upload
uploadImages().catch(console.error); 