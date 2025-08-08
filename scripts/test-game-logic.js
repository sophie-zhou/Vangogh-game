const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testGameLogic() {
  console.log('🎮 Testing game logic...\n');
  
  try {
    console.log('🔄 Starting to fetch images...');
    
    // Real
    const { data: realData, error: realError } = await supabase.storage
      .from('real').list('All of VanGogh', { limit: 1000 });
    
    if (realError) {
      console.log(`❌ Real bucket error: ${realError.message}`);
      return;
    }
    
    // Plagiarized
    const { data: plagData, error: plagError } = await supabase.storage
      .from('plagiarized').list('Plagiarized', { limit: 1000 });
    
    if (plagError) {
      console.log(`❌ Plagiarized bucket error: ${plagError.message}`);
      return;
    }
    
    // Supereasy
    const { data: supereasyData, error: supereasyError } = await supabase.storage
      .from('supereasy').list('Supereasy', { limit: 1000 });
    
    if (supereasyError) {
      console.log(`❌ Supereasy bucket error: ${supereasyError.message}`);
      return;
    }
    
    // Easy
    const { data: easyData, error: easyError } = await supabase.storage
      .from('easy').list('Easy', { limit: 1000 });
    
    if (easyError) {
      console.log(`❌ Easy bucket error: ${easyError.message}`);
      return;
    }
    
    // Difficult
    const { data: difficultData, error: difficultError } = await supabase.storage
      .from('difficult').list('Difficult', { limit: 1000 });
    
    if (difficultError) {
      console.log(`❌ Difficult bucket error: ${difficultError.message}`);
      return;
    }
    
    console.log('✅ All buckets fetched successfully');
    
    // Filter out non-image files
    const filterImageFiles = (files) => {
      return files.filter(file => 
        file.name.toLowerCase().endsWith('.jpg') || 
        file.name.toLowerCase().endsWith('.jpeg') || 
        file.name.toLowerCase().endsWith('.png') ||
        file.name.toLowerCase().endsWith('.gif') ||
        file.name.toLowerCase().endsWith('.webp')
      )
    }
    
    const realImages = filterImageFiles(realData || [])
    const plagImages = filterImageFiles(plagData || [])
    const supereasyImages = filterImageFiles(supereasyData || [])
    const easyImages = filterImageFiles(easyData || [])
    const difficultImages = filterImageFiles(difficultData || [])
    
    console.log(`📸 Filtered images: Real=${realImages.length}, Plagiarized=${plagImages.length}, Supereasy=${supereasyImages.length}, Easy=${easyImages.length}, Difficult=${difficultImages.length}`)
    
    // Compose pairs
    const pairs = []
    
    // Real vs Plagiarized
    if (realImages.length > 0 && plagImages.length > 0) {
      const minLen = Math.min(realImages.length, plagImages.length)
      for (let i = 0; i < minLen; i++) {
        pairs.push({
          id: `real-plagiarized-${i}`,
          realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
          fakeImage: supabase.storage.from('plagiarized').getPublicUrl(`Plagiarized/${plagImages[i].name}`).data.publicUrl,
          difficulty: 'Plagiarized',
          points: 10,
          title: realImages[i].name,
          year: '',
        })
      }
    }
    
    // Real vs Super Easy
    if (realImages.length > 0 && supereasyImages.length > 0) {
      const minLen = Math.min(realImages.length, supereasyImages.length)
      for (let i = 0; i < minLen; i++) {
        pairs.push({
          id: `real-super-easy-${i}`,
          realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
          fakeImage: supabase.storage.from('supereasy').getPublicUrl(`Supereasy/${supereasyImages[i].name}`).data.publicUrl,
          difficulty: 'Super Easy',
          points: 10,
          title: realImages[i].name,
          year: '',
        })
      }
    }
    
    // Real vs Easy
    if (realImages.length > 0 && easyImages.length > 0) {
      const minLen = Math.min(realImages.length, easyImages.length)
      for (let i = 0; i < minLen; i++) {
        pairs.push({
          id: `real-easy-${i}`,
          realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
          fakeImage: supabase.storage.from('easy').getPublicUrl(`Easy/${easyImages[i].name}`).data.publicUrl,
          difficulty: 'Easy',
          points: 10,
          title: realImages[i].name,
          year: '',
        })
      }
    }
    
    // Real vs Difficult
    if (realImages.length > 0 && difficultImages.length > 0) {
      const minLen = Math.min(realImages.length, difficultImages.length)
      for (let i = 0; i < minLen; i++) {
        pairs.push({
          id: `real-difficult-${i}`,
          realImage: supabase.storage.from('real').getPublicUrl(`All of VanGogh/${realImages[i].name}`).data.publicUrl,
          fakeImage: supabase.storage.from('difficult').getPublicUrl(`Difficult/${difficultImages[i].name}`).data.publicUrl,
          difficulty: 'Difficult',
          points: 10,
          title: realImages[i].name,
          year: '',
        })
      }
    }
    
    console.log(`📊 Found ${pairs.length} image pairs`)
    
    // Shuffle pairs
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
    }
    
    console.log('✅ Images loaded successfully!')
    console.log(`🎮 Game ready with ${pairs.length} questions`)
    
    // Test first question
    if (pairs.length > 0) {
      const firstQuestion = pairs[0]
      console.log('\n🧪 Testing first question:')
      console.log(`  ID: ${firstQuestion.id}`)
      console.log(`  Difficulty: ${firstQuestion.difficulty}`)
      console.log(`  Points: ${firstQuestion.points}`)
      console.log(`  Title: ${firstQuestion.title}`)
      console.log(`  Real Image: ${firstQuestion.realImage.substring(0, 80)}...`)
      console.log(`  Fake Image: ${firstQuestion.fakeImage.substring(0, 80)}...`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
  
  console.log('\n🎮 Game logic test completed!')
}

// Run the test
testGameLogic().catch(console.error); 