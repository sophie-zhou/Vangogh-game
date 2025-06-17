"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Zap, Database, Code, Globe } from "lucide-react"

export default function FreeTierSetupPage() {
  const [selectedApproach, setSelectedApproach] = useState<string>("")

  const approaches = [
    {
      id: "github-pages",
      title: "GitHub Pages + GitHub Storage",
      cost: "100% Free",
      storage: "Unlimited (via Git LFS)",
      bandwidth: "100GB/month",
      difficulty: "Easy",
      icon: Code,
      pros: [
        "Completely free forever",
        "No storage limits with Git LFS",
        "Version control for your images",
        "Easy to deploy and update",
        "Works with your existing workflow",
      ],
      cons: [
        "Images load from GitHub (slightly slower)",
        "Need to commit images to repo",
        "100MB file size limit per image",
      ],
      setup: [
        "Enable Git LFS for image files",
        "Commit images to your repo",
        "Deploy to GitHub Pages",
        "Images served directly from GitHub",
      ],
    },
    {
      id: "vercel-optimized",
      title: "Vercel Free + Optimized Images",
      cost: "Free (with limits)",
      storage: "100GB bandwidth/month",
      bandwidth: "100GB/month",
      difficulty: "Easy",
      icon: Globe,
      pros: ["Fast global CDN", "Automatic image optimization", "Easy deployment", "Great performance"],
      cons: ["100GB bandwidth limit", "Need to optimize images first", "May hit limits with 500+ images"],
      setup: [
        "Compress images to <100KB each",
        "Use Next.js Image optimization",
        "Deploy to Vercel",
        "Monitor bandwidth usage",
      ],
    },
    {
      id: "hybrid-approach",
      title: "Hybrid: Vercel + External Storage",
      cost: "Free + $1-2/month",
      storage: "Unlimited",
      bandwidth: "Unlimited",
      difficulty: "Medium",
      icon: Database,
      pros: ["Best performance", "Unlimited storage", "Professional setup", "Scalable"],
      cons: ["Small monthly cost", "Slightly more complex setup"],
      setup: [
        "Use Cloudinary free tier (25GB)",
        "Or use Imgur API (free)",
        "Store image URLs in your code",
        "Deploy app to Vercel",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Free Tier Setup Guide</h1>
          <p className="text-blue-200">Build your Van Gogh game without spending a penny</p>
        </div>

        {/* Approach Comparison */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {approaches.map((approach) => (
            <Card
              key={approach.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedApproach === approach.id
                  ? "bg-yellow-600/20 border-yellow-400 scale-105"
                  : "bg-black/40 border-white/30 hover:border-yellow-400/50"
              } backdrop-blur-sm`}
              onClick={() => setSelectedApproach(approach.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <approach.icon className="w-8 h-8 text-yellow-400" />
                  <Badge className="bg-green-600">{approach.cost}</Badge>
                </div>
                <CardTitle className="text-white">{approach.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-200">Storage:</span>
                    <div className="text-white font-medium">{approach.storage}</div>
                  </div>
                  <div>
                    <span className="text-blue-200">Bandwidth:</span>
                    <div className="text-white font-medium">{approach.bandwidth}</div>
                  </div>
                </div>

                <div>
                  <span className="text-blue-200 text-sm">Difficulty:</span>
                  <Badge
                    className={`ml-2 ${
                      approach.difficulty === "Easy"
                        ? "bg-green-600"
                        : approach.difficulty === "Medium"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }`}
                  >
                    {approach.difficulty}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-green-400 text-sm font-medium">Pros:</div>
                  <ul className="text-xs text-green-200 space-y-1">
                    {approach.pros.slice(0, 3).map((pro, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Setup for Selected Approach */}
        {selectedApproach && (
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                Setup Guide: {approaches.find((a) => a.id === selectedApproach)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/30">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="setup">Setup Steps</TabsTrigger>
                  <TabsTrigger value="code">Code Changes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  {selectedApproach === "github-pages" && (
                    <div className="space-y-4">
                      <Alert className="bg-blue-600/20 border-blue-400">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-blue-200">
                          <strong>Best for:</strong> Completely free hosting with unlimited storage using Git LFS
                        </AlertDescription>
                      </Alert>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-2">What you get:</h3>
                          <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Free hosting on GitHub Pages</li>
                            <li>• Unlimited image storage with Git LFS</li>
                            <li>• Version control for your dataset</li>
                            <li>• Custom domain support</li>
                            <li>• Automatic deployments</li>
                          </ul>
                        </div>
                        <div className="bg-black/20 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-2">Requirements:</h3>
                          <ul className="text-blue-200 text-sm space-y-1">
                            <li>• GitHub account (free)</li>
                            <li>• Git LFS enabled</li>
                            <li>• Images under 100MB each</li>
                            <li>• Static site build</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApproach === "vercel-optimized" && (
                    <div className="space-y-4">
                      <Alert className="bg-green-600/20 border-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-200">
                          <strong>Best for:</strong> Fast performance with automatic optimizations
                        </AlertDescription>
                      </Alert>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-2">Optimization strategy:</h3>
                          <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Compress images to 50-100KB each</li>
                            <li>• Use WebP format</li>
                            <li>• Lazy loading</li>
                            <li>• Progressive loading</li>
                            <li>• Smart caching</li>
                          </ul>
                        </div>
                        <div className="bg-black/20 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-2">Bandwidth calculation:</h3>
                          <ul className="text-blue-200 text-sm space-y-1">
                            <li>• 500 images × 75KB = 37.5MB</li>
                            <li>• 100GB ÷ 37.5MB = 2,666 full loads</li>
                            <li>• ~89 users per day</li>
                            <li>• Perfect for testing & demos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApproach === "hybrid-approach" && (
                    <div className="space-y-4">
                      <Alert className="bg-purple-600/20 border-purple-400">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-purple-200">
                          <strong>Best for:</strong> Professional setup with minimal cost
                        </AlertDescription>
                      </Alert>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-2">Free services to use:</h3>
                          <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Cloudinary: 25GB free</li>
                            <li>• Imgur: Unlimited free</li>
                            <li>• ImageKit: 20GB free</li>
                            <li>• Vercel: App hosting</li>
                          </ul>
                        </div>
                        <div className="bg-black/20 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-2">Cost breakdown:</h3>
                          <ul className="text-blue-200 text-sm space-y-1">
                            <li>• App hosting: Free (Vercel)</li>
                            <li>• Image storage: Free (25GB)</li>
                            <li>• CDN delivery: Free</li>
                            <li>• Total: $0/month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="setup">
                  <div className="space-y-4">
                    {approaches
                      .find((a) => a.id === selectedApproach)
                      ?.setup.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Badge className="bg-yellow-600 min-w-[24px] h-6 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <p className="text-blue-200">{step}</p>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="code">
                  {selectedApproach === "github-pages" && (
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-2">1. Enable Git LFS</h3>
                        <pre className="bg-black/40 rounded p-2 text-green-400 text-sm overflow-x-auto">
                          {`# Install Git LFS
git lfs install

# Track image files
git lfs track "*.jpg" "*.png" "*.jpeg" "*.webp"
git add .gitattributes

# Add your images
git add public/paintings/
git commit -m "Add Van Gogh dataset with LFS"
git push`}
                        </pre>
                      </div>

                      <div className="bg-black/20 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-2">2. GitHub Pages Setup</h3>
                        <pre className="bg-black/40 rounded p-2 text-green-400 text-sm overflow-x-auto">
                          {`# In package.json, add:
"scripts": {
  "export": "next build && next export",
  "deploy": "npm run export && gh-pages -d out"
}

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {selectedApproach === "vercel-optimized" && (
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-2">1. Image Optimization Script</h3>
                        <pre className="bg-black/40 rounded p-2 text-green-400 text-sm overflow-x-auto">
                          {`// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const inputDir = './raw-images';
  const outputDir = './public/paintings';
  
  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      await sharp(path.join(inputDir, file))
        .resize(800, 600, { fit: 'inside' })
        .webp({ quality: 75 })
        .toFile(path.join(outputDir, file.replace(/\.[^.]+$/, '.webp')));
    }
  }
}

optimizeImages();`}
                        </pre>
                      </div>

                      <div className="bg-black/20 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-2">2. Next.js Config</h3>
                        <pre className="bg-black/40 rounded p-2 text-green-400 text-sm overflow-x-auto">
                          {`// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  }
}`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {selectedApproach === "hybrid-approach" && (
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-2">1. Cloudinary Setup</h3>
                        <pre className="bg-black/40 rounded p-2 text-green-400 text-sm overflow-x-auto">
                          {`// lib/cloudinary.js
export const cloudinaryLoader = ({ src, width, quality }) => {
  const params = ['f_auto', 'c_limit', \`w_\${width}\`, \`q_\${quality || 'auto'}\`];
  return \`https://res.cloudinary.com/your-cloud-name/image/upload/\${params.join(',')}v1/\${src}\`;
};

// In your component:
<Image
  loader={cloudinaryLoader}
  src="vangogh/starry-night"
  width={400}
  height={300}
  alt="Starry Night"
/>`}
                        </pre>
                      </div>

                      <div className="bg-black/20 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-2">2. Image URLs Data</h3>
                        <pre className="bg-black/40 rounded p-2 text-green-400 text-sm overflow-x-auto">
                          {`// data/paintings.js
export const paintings = [
  {
    id: "1",
    title: "The Starry Night",
    realImage: "https://res.cloudinary.com/your-cloud/vangogh/starry-night-real.jpg",
    aiImage: "https://res.cloudinary.com/your-cloud/vangogh/starry-night-ai.jpg",
    difficulty: "Medium"
  }
  // ... more paintings
];`}
                        </pre>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Quick Start Recommendations */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              Quick Start Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-600/20 border-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-200">
                <strong>For beginners:</strong> Start with GitHub Pages approach - it's 100% free and handles unlimited
                images
              </AlertDescription>
            </Alert>

            <Alert className="bg-blue-600/20 border-blue-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                <strong>For best performance:</strong> Use Vercel + optimized images if you have under 300 images
              </AlertDescription>
            </Alert>

            <Alert className="bg-purple-600/20 border-purple-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-purple-200">
                <strong>For scaling:</strong> Hybrid approach gives you professional features while staying mostly free
              </AlertDescription>
            </Alert>

            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Free Tier Limits Summary:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-green-400 font-medium">GitHub Pages</div>
                  <div className="text-blue-200">✅ Unlimited storage</div>
                  <div className="text-blue-200">✅ Unlimited bandwidth</div>
                  <div className="text-blue-200">✅ Custom domains</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-medium">Vercel Free</div>
                  <div className="text-blue-200">⚠️ 100GB bandwidth/month</div>
                  <div className="text-blue-200">✅ Fast global CDN</div>
                  <div className="text-blue-200">✅ Auto optimization</div>
                </div>
                <div>
                  <div className="text-purple-400 font-medium">Cloudinary Free</div>
                  <div className="text-blue-200">✅ 25GB storage</div>
                  <div className="text-blue-200">✅ 25GB bandwidth</div>
                  <div className="text-blue-200">✅ Image transformations</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
