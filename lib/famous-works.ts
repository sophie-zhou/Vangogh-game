export interface FamousWork {
  id: string
  title: string
  year: string
  location: string
  description: string
  techniques: string[]
  significance: string
  imageName: string
  imageUrl: string
}

export const famousWorks: FamousWork[] = [
  {
    id: 'starry-night',
    title: 'The Starry Night',
    year: '1889',
    location: 'Saint-Rémy-de-Provence, France',
    description: 'One of Van Gogh\'s most iconic works, painted from memory during his stay at the Saint-Paul-de-Mausole asylum. The swirling, turbulent sky reflects his emotional state while the cypress tree connects earth to heaven.',
    techniques: ['Impasto', 'Swirling brushwork', 'Complementary colors', 'Emotional expression'],
    significance: 'This painting represents Van Gogh\'s mastery of post-impressionist techniques and his ability to convey emotion through color and brushwork. It\'s considered one of the most recognizable paintings in Western art.',
    imageName: 'starrynight.jpg',
    imageUrl: ''
  },
  {
    id: 'sunflowers',
    title: 'Sunflowers',
    year: '1888',
    location: 'Arles, France',
    description: 'Part of Van Gogh\'s famous sunflower series, painted to decorate his studio for Gauguin\'s visit. The thick impasto and pure yellow pigments demonstrate his mastery of texture and color.',
    techniques: ['Impasto', 'Pure color application', 'Textural variety', 'Series painting'],
    significance: 'The Sunflowers series represents Van Gogh\'s technical mastery and his innovative use of color. These works influenced generations of artists and remain among his most beloved paintings.',
    imageName: 'sunflower.jpg',
    imageUrl: ''
  },
  {
    id: 'irises',
    title: 'Irises',
    year: '1889',
    location: 'Saint-Rémy-de-Provence, France',
    description: 'Painted during Van Gogh\'s stay at the asylum, this work shows his fascination with nature and his ability to find beauty in simple subjects. The vibrant colors and flowing forms demonstrate his artistic evolution.',
    techniques: ['Flowing brushwork', 'Vibrant color palette', 'Natural forms', 'Rhythmic composition'],
    significance: 'This painting shows Van Gogh\'s continued artistic growth even during difficult periods. It demonstrates his ability to find inspiration in nature and his mastery of organic forms.',
    imageName: 'iris.jpg',
    imageUrl: ''
  },
  {
    id: 'wheatfield-crows',
    title: 'Wheatfield with Crows',
    year: '1890',
    location: 'Auvers-sur-Oise, France',
    description: 'One of Van Gogh\'s final paintings, completed just weeks before his death. The turbulent sky and ominous crows suggest his emotional turmoil, while the golden wheat represents hope and life.',
    techniques: ['Dynamic brushwork', 'Emotional color', 'Atmospheric perspective', 'Symbolic imagery'],
    significance: 'As one of his last works, this painting provides insight into Van Gogh\'s final artistic vision. It shows his continued mastery of expressive techniques despite his personal struggles.',
    imageName: 'wheatfield.jpg',
    imageUrl: ''
  },
  {
    id: 'bedroom',
    title: 'The Bedroom',
    year: '1888',
    location: 'Arles, France',
    description: 'A depiction of Van Gogh\'s simple bedroom in the Yellow House, showing his innovative approach to perspective and his use of complementary colors to create visual harmony.',
    techniques: ['Perspective distortion', 'Complementary colors', 'Flat composition', 'Personal space'],
    significance: 'This painting demonstrates Van Gogh\'s willingness to break traditional rules of perspective to achieve emotional impact. It shows his innovative approach to composition and color theory.',
    imageName: 'bedroom.jpg',
    imageUrl: ''
  },
  {
    id: 'bandaged-ear',
    title: 'Self-Portrait with Bandaged Ear',
    year: '1889',
    location: 'Arles, France',
    description: 'Painted after Van Gogh famously cut off part of his ear, this self-portrait shows his resilience and dedication to art despite personal struggles. The bandage and pipe symbolize both his suffering and his artistic commitment.',
    techniques: ['Self-portraiture', 'Contour brushwork', 'Earthy color palette', 'Psychological depth'],
    significance: 'This painting demonstrates Van Gogh\'s psychological insight and his ability to turn personal trauma into powerful art. It shows his mastery of self-portraiture and emotional expression.',
    imageName: 'bandage.jpg',
    imageUrl: ''
  },
  {
    id: 'peasant-woman',
    title: 'Peasant Woman Against a Background of Wheat',
    year: '1890',
    location: 'Auvers-sur-Oise, France',
    description: 'One of Van Gogh\'s final works, this painting shows a peasant woman standing against a golden wheat field. It demonstrates his continued interest in rural life and his mastery of figure painting.',
    techniques: ['Figure painting', 'Landscape integration', 'Color harmony', 'Rural subject matter'],
    significance: 'This work shows Van Gogh\'s continued artistic development and his deep connection to rural life and peasant subjects, themes that were important throughout his career.',
    imageName: 'peasantwoman.jpg',
    imageUrl: ''
  }
]

// Function to get image URL for a famous work
export function getFamousWorkImageUrl(imageName: string): string {
  // This will be populated with actual Supabase URLs
  return `https://mxmiemrnoemqieyacdhz.supabase.co/storage/v1/object/public/famous/${encodeURIComponent(imageName)}`
}

// Update all image URLs
export const famousWorksWithUrls = famousWorks.map(work => ({
  ...work,
  imageUrl: getFamousWorkImageUrl(work.imageName)
})) 