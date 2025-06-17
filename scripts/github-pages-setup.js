// Script to help set up GitHub Pages deployment
const fs = require("fs").promises
const path = require("path")

async function setupGitHubPages() {
  console.log("🚀 Setting up GitHub Pages deployment...")

  // Create next.config.js for static export
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vangogh-game' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/vangogh-game' : '',
}

module.exports = nextConfig`

  await fs.writeFile("next.config.js", nextConfig)

  // Update package.json scripts
  const packageJsonPath = "package.json"
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"))

  packageJson.scripts = {
    ...packageJson.scripts,
    export: "next build",
    deploy: "npm run export && npx gh-pages -d out",
  }

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    "gh-pages": "^6.0.0",
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))

  // Create .gitattributes for Git LFS
  const gitAttributes = `*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.webp filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text`

  await fs.writeFile(".gitattributes", gitAttributes)

  // Create GitHub Actions workflow
  const workflowDir = ".github/workflows"
  await fs.mkdir(workflowDir, { recursive: true })

  const workflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      with:
        lfs: true
        
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run export
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out`

  await fs.writeFile(path.join(workflowDir, "deploy.yml"), workflow)

  console.log("✅ GitHub Pages setup complete!")
  console.log("📝 Next steps:")
  console.log("1. Run: git lfs install")
  console.log("2. Run: npm install")
  console.log("3. Add your images to public/paintings/")
  console.log('4. Run: git add . && git commit -m "Setup GitHub Pages"')
  console.log("5. Push to GitHub and enable Pages in repo settings")
}

setupGitHubPages().catch(console.error)
