import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const htmlPath = join(__dirname, '../public/og-image.html')
const outputPath = join(__dirname, '../public/og-image.png')

async function generateOGImage() {
  console.log('🚀 Starting OG image generation...')
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // Set viewport to exact OG image size
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1
    })
    
    // Load the HTML file
    const htmlUrl = `file://${htmlPath}`
    console.log(`📄 Loading HTML from: ${htmlUrl}`)
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' })
    
    // Wait a bit for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Take screenshot
    console.log('📸 Taking screenshot...')
    const screenshot = await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630
      }
    })
    
    console.log(`✅ OG image generated successfully at: ${outputPath}`)
    console.log(`📏 Size: 1200x630px`)
    
  } catch (error) {
    console.error('❌ Error generating OG image:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

generateOGImage()
