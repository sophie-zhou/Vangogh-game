const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testGameImages() {
  console.log('🎮 Testing game image fetching logic...\n');
  
  try {
    // Test the same logic as the game
    console.log('📁 Fetching images from buckets...');
    
    // Real
    const { data: realData, error: realError } = await supabase.storage
      .from('real').list('All of VanGogh', { limit: 1000 });
    
    if (realError) {
      console.log(`❌ Real bucket error: ${realError.message}`);
    } else {
      console.log(`✅ Real bucket: ${realData?.length || 0} files`);
    }
    
    // Plagiarized
    const { data: plagData, error: plagError } = await supabase.storage
      .from('plagiarized').list('Plagiarized', { limit: 1000 });
    
    if (plagError) {
      console.log(`❌ Plagiarized bucket error: ${plagError.message}`);
    } else {
      console.log(`✅ Plagiarized bucket: ${plagData?.length || 0} files`);
    }
    
    // Supereasy
    const { data: supereasyData, error: supereasyError } = await supabase.storage
      .from('supereasy').list('Supereasy', { limit: 1000 });
    
    if (supereasyError) {
      console.log(`❌ Supereasy bucket error: ${supereasyError.message}`);
    } else {
      console.log(`✅ Supereasy bucket: ${supereasyData?.length || 0} files`);
    }
    
    // Easy
    const { data: easyData, error: easyError } = await supabase.storage
      .from('easy').list('Easy', { limit: 1000 });
    
    if (easyError) {
      console.log(`❌ Easy bucket error: ${easyError.message}`);
    } else {
      console.log(`✅ Easy bucket: ${easyData?.length || 0} files`);
    }
    
    // Difficult
    const { data: difficultData, error: difficultError } = await supabase.storage
      .from('difficult').list('Difficult', { limit: 1000 });
    
    if (difficultError) {
      console.log(`❌ Difficult bucket error: ${difficultError.message}`);
    } else {
      console.log(`✅ Difficult bucket: ${difficultData?.length || 0} files`);
    }
    
    // Test creating image pairs
    console.log('\n🖼️  Creating image pairs...');
    const pairs = [];
    
    // Real vs Plagiarized
    if (realData && plagData) {
      const minLen = Math.min(realData.length, plagData.length);
      console.log(`📊 Real vs Plagiarized: ${minLen} pairs`);
      
      for (let i = 0; i < Math.min(minLen, 3); i++) {
        const realUrl = supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realData[i].name}`).data.publicUrl;
        const fakeUrl = supabase.storage.from('plagiarized').getPublicUrl(`Plagiarized/${plagData[i].name}`).data.publicUrl;
        
        console.log(`  Pair ${i + 1}:`);
        console.log(`    Real: ${realData[i].name} -> ${realUrl.substring(0, 80)}...`);
        console.log(`    Fake: ${plagData[i].name} -> ${fakeUrl.substring(0, 80)}...`);
        
        pairs.push({
          id: `real-plagiarized-${i}`,
          realImage: realUrl,
          fakeImage: fakeUrl,
          difficulty: 'Plagiarized',
          points: 10,
          title: realData[i].name,
          year: '',
        });
      }
    }
    
    // Real vs Super Easy
    if (realData && supereasyData) {
      const minLen = Math.min(realData.length, supereasyData.length);
      console.log(`📊 Real vs Super Easy: ${minLen} pairs`);
      
      for (let i = 0; i < Math.min(minLen, 3); i++) {
        const realUrl = supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realData[i].name}`).data.publicUrl;
        const fakeUrl = supabase.storage.from('supereasy').getPublicUrl(`Supereasy/${supereasyData[i].name}`).data.publicUrl;
        
        console.log(`  Pair ${i + 1}:`);
        console.log(`    Real: ${realData[i].name} -> ${realUrl.substring(0, 80)}...`);
        console.log(`    Fake: ${supereasyData[i].name} -> ${fakeUrl.substring(0, 80)}...`);
        
        pairs.push({
          id: `real-super-easy-${i}`,
          realImage: realUrl,
          fakeImage: fakeUrl,
          difficulty: 'Super Easy',
          points: 10,
          title: realData[i].name,
          year: '',
        });
      }
    }
    
    console.log(`\n🎉 Total pairs created: ${pairs.length}`);
    
    // Test accessing a few images
    if (pairs.length > 0) {
      console.log('\n🧪 Testing image access...');
      const testPair = pairs[0];
      
      try {
        const realResponse = await fetch(testPair.realImage, { method: 'HEAD' });
        console.log(`Real image: ${realResponse.status} ${realResponse.statusText}`);
        
        const fakeResponse = await fetch(testPair.fakeImage, { method: 'HEAD' });
        console.log(`Fake image: ${fakeResponse.status} ${fakeResponse.statusText}`);
      } catch (error) {
        console.log(`❌ Image fetch error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n🎮 Game image test completed!');
}

// Run the test
testGameImages().catch(console.error); 