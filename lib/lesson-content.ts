export interface LessonContent {
  id: number
  title: string
  description: string
  duration: string
  points: number
  content: string[]
  keyTakeaways: string[]
  examples: string[]
}

export interface TechniqueContent {
  name: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  detailedExplanation: string
  visualCues: string[]
  commonMistakes: string[]
  practiceTips: string[]
  examples: string[]
}

export const lessonContent: LessonContent[] = [
  {
    id: 1,
    title: "Van Gogh's Life and Times",
    description: "Learn about the artist's journey from Netherlands to France",
    duration: "5 min read",
    points: 10,
    content: [
      "Vincent van Gogh was born in 1853 in the Netherlands and lived until 1890. His artistic career spanned only 10 years but produced over 2,000 artworks.",
      "Van Gogh's early work was influenced by Dutch Realism and featured dark, somber colors. His famous 'The Potato Eaters' (1885) represents this period.",
      "In 1886, Van Gogh moved to Paris where he discovered Impressionism and began using brighter colors. This marked a dramatic shift in his style.",
      "From 1888-1890, Van Gogh lived in Arles, France, where he created his most iconic works including 'Sunflowers' and 'The Bedroom'.",
      "His final period in Saint-Rémy-de-Provence (1889-1890) produced 'The Starry Night', characterized by swirling, emotional brushwork."
    ],
    keyTakeaways: [
      "Van Gogh's style evolved dramatically from dark realism to bright, expressive post-impressionism",
      "His most famous works were created in just 2 years (1888-1890)",
      "Geographic location significantly influenced his artistic development",
      "His mental health struggles coincided with his most creative period"
    ],
    examples: [
      "The Potato Eaters (1885) - Dark, realistic Dutch period",
      "Sunflowers (1888) - Bright, impressionist influence",
      "The Starry Night (1889) - Expressive, emotional style"
    ]
  },
  {
    id: 2,
    title: "Recognizing Brushstrokes",
    description: "Understand Van Gogh's distinctive painting technique",
    duration: "8 min read",
    points: 15,
    content: [
      "Van Gogh's brushwork is immediately recognizable by its thick, visible application of paint known as 'impasto'. He often applied paint directly from the tube.",
      "His brushstrokes are directional and purposeful - they follow the form of objects and create movement. In landscapes, strokes often flow with the terrain.",
      "Van Gogh used different brush sizes for different effects: large brushes for backgrounds, smaller ones for details. This creates varied texture throughout his works.",
      "His brushwork is never random - each stroke serves a purpose. In portraits, strokes follow facial contours; in landscapes, they follow natural forms.",
      "The thickness of paint varies dramatically: thin washes in backgrounds, thick impasto in foregrounds and important elements."
    ],
    keyTakeaways: [
      "Impasto technique creates visible, textured brushstrokes",
      "Brush direction always follows the form of objects",
      "Paint thickness varies purposefully throughout the composition",
      "Each brushstroke serves a specific compositional purpose"
    ],
    examples: [
      "The Starry Night - Swirling, directional brushwork in the sky",
      "Sunflowers - Thick impasto on flower petals, thin washes on background",
      "Self-Portrait with Bandaged Ear - Contour-following strokes on face"
    ]
  },
  {
    id: 3,
    title: "Color Theory in Van Gogh's Work",
    description: "Explore his revolutionary use of color and contrast",
    duration: "6 min read",
    points: 12,
    content: [
      "Van Gogh was a master of complementary colors - using opposite colors on the color wheel for maximum impact. His famous blue-yellow combinations exemplify this.",
      "He used color to express emotion rather than represent reality. Yellow represented joy and sunlight, blue represented sadness and night.",
      "Van Gogh's color palette evolved from earth tones (early Dutch period) to vibrant primaries and secondaries (French period).",
      "He often used color to create depth: warm colors advance, cool colors recede. This creates the illusion of three-dimensional space.",
      "His use of pure, unmixed colors was revolutionary. Instead of blending, he placed contrasting colors side by side for optical mixing."
    ],
    keyTakeaways: [
      "Complementary colors create maximum visual impact",
      "Colors express emotion, not just reality",
      "Warm colors advance, cool colors recede",
      "Pure colors placed side-by-side create optical mixing"
    ],
    examples: [
      "Sunflowers - Pure yellow against blue backgrounds",
      "The Starry Night - Blue sky with yellow stars and moon",
      "The Bedroom - Complementary red-green color scheme"
    ]
  },
  {
    id: 4,
    title: "Famous Paintings Deep Dive",
    description: "Analyze Starry Night, Sunflowers, and other masterpieces",
    duration: "10 min read",
    points: 20,
    content: [
      "The Starry Night (1889): Painted from memory in the asylum, this work shows Van Gogh's emotional state through swirling brushwork and intense colors. The cypress tree connects earth to sky.",
      "Sunflowers (1888): Part of a series painted to decorate his studio for Gauguin's visit. The thick impasto and pure yellow pigments demonstrate his mastery of texture and color.",
      "The Bedroom (1888): Shows his use of complementary colors and perspective. The furniture appears to 'float' due to his unique approach to spatial representation.",
      "Self-Portrait with Bandaged Ear (1889): Demonstrates his psychological insight and technical skill. The bandage and pipe suggest both his suffering and his artistic dedication.",
      "Wheatfield with Crows (1890): His final painting, showing his mastery of landscape and emotional expression through color and brushwork."
    ],
    keyTakeaways: [
      "Each masterpiece demonstrates multiple techniques working together",
      "Personal circumstances influenced his artistic choices",
      "His works show both technical skill and emotional depth",
      "He often worked in series to explore variations on themes"
    ],
    examples: [
      "The Starry Night - Emotional expression through brushwork",
      "Sunflowers - Technical mastery of impasto and color",
      "The Bedroom - Innovative use of perspective and color theory"
    ]
  },
  {
    id: 5,
    title: "Advanced Authentication Methods",
    description: "Master the final techniques for identifying authentic Van Gogh works",
    duration: "12 min read",
    points: 25,
    content: [
      "Canvas Analysis: Van Gogh used specific canvas types and preparation methods. His canvases often show characteristic weave patterns and sizing techniques.",
      "Pigment Analysis: He used specific paint brands and colors available in his time. Modern forgeries often use contemporary pigments that didn't exist in the 1880s.",
      "Brushwork Consistency: His brushwork shows consistent patterns across his career. Forgeries often lack the purposeful, directional quality of his strokes.",
      "Color Palette Evolution: His color choices followed a clear chronological progression. Works should match the palette of their supposed period.",
      "Compositional Elements: Van Gogh's compositions show specific recurring elements and spatial relationships that are difficult to replicate authentically."
    ],
    keyTakeaways: [
      "Multiple authentication methods should be used together",
      "Technical analysis can reveal inconsistencies",
      "Artistic style should match the claimed period",
      "Professional authentication is essential for valuable works"
    ],
    examples: [
      "Canvas weave patterns and preparation methods",
      "Pigment composition and availability",
      "Brushwork analysis and consistency checks"
    ]
  }
]

export const techniqueContent: TechniqueContent[] = [
  {
    name: "Impasto",
    description: "Thick application of paint that creates texture and dimension",
    difficulty: "Advanced",
    detailedExplanation: "Impasto is a technique where paint is applied in thick layers, often directly from the tube. Van Gogh used this to create dramatic texture and three-dimensional effects. His impasto is never random - it follows the form of objects and creates specific visual effects.",
    visualCues: [
      "Paint appears to 'stand up' from the canvas surface",
      "Visible brush or palette knife marks",
      "Light creates shadows and highlights on the textured surface",
      "Paint thickness varies purposefully throughout the work"
    ],
    commonMistakes: [
      "Applying impasto randomly without purpose",
      "Making all areas equally thick",
      "Not considering how light will interact with texture",
      "Using impasto to hide poor drawing skills"
    ],
    practiceTips: [
      "Start with small areas and build up gradually",
      "Use different tools: brushes, palette knives, even fingers",
      "Consider the direction of your strokes",
      "Practice on different surfaces to understand texture"
    ],
    examples: [
      "The Starry Night - Swirling impasto in the sky",
      "Sunflowers - Thick paint on flower petals",
      "Self-Portraits - Textured application on facial features"
    ]
  },
  {
    name: "Complementary Colors",
    description: "Using opposite colors on the color wheel for dramatic contrast",
    difficulty: "Intermediate",
    detailedExplanation: "Complementary colors are opposite each other on the color wheel (red-green, blue-orange, yellow-purple). Van Gogh used these combinations to create maximum visual impact and emotional intensity. He placed them side by side rather than mixing them.",
    visualCues: [
      "High contrast between adjacent colors",
      "Colors appear more vibrant when placed together",
      "Creates visual tension and excitement",
      "Used to draw attention to important elements"
    ],
    commonMistakes: [
      "Using complementary colors in equal amounts",
      "Placing them too close together without separation",
      "Not considering the emotional impact",
      "Using them randomly without purpose"
    ],
    practiceTips: [
      "Use one color as dominant, the other as accent",
      "Separate complementary colors with neutral tones",
      "Consider the emotional message of your color choices",
      "Practice with different complementary pairs"
    ],
    examples: [
      "Sunflowers - Yellow flowers against blue backgrounds",
      "The Starry Night - Blue sky with yellow stars",
      "The Bedroom - Red bed against green walls"
    ]
  },
  {
    name: "Dynamic Brushstrokes",
    description: "Energetic, visible brushwork that adds movement to paintings",
    difficulty: "Advanced",
    detailedExplanation: "Van Gogh's brushstrokes are never static - they create movement and energy throughout his compositions. Each stroke has direction and purpose, following the form of objects and creating visual flow. This technique requires both technical skill and artistic vision.",
    visualCues: [
      "Brushstrokes follow the form of objects",
      "Visible directional movement throughout the work",
      "Varied stroke lengths and thicknesses",
      "Creates a sense of energy and life"
    ],
    commonMistakes: [
      "Random brushwork without purpose",
      "All strokes going in the same direction",
      "Not considering the overall composition",
      "Using brushwork to hide poor drawing"
    ],
    practiceTips: [
      "Study the form of objects before painting",
      "Practice different stroke directions and lengths",
      "Consider how strokes guide the viewer's eye",
      "Use brushwork to enhance, not hide, your subject"
    ],
    examples: [
      "The Starry Night - Swirling strokes in the sky",
      "Wheatfield with Crows - Flowing strokes in the wheat",
      "Self-Portraits - Contour-following strokes on faces"
    ]
  }
] 