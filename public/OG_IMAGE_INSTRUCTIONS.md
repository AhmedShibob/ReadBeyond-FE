# OG Image Creation Instructions

## What is an OG Image?

An OG (Open Graph) image is the preview image that appears when you share your app link on social media platforms like WhatsApp, Facebook, Twitter, LinkedIn, etc.

## Required Specifications

- **Size**: 1200 x 630 pixels (recommended)
- **Format**: PNG or JPG
- **File name**: `og-image.png` (or `og-image.jpg`)
- **Location**: Place in the `/public` folder
- **File size**: Keep under 1MB for fast loading

## Design Guidelines

### What to Include:

1. **App Logo/Icon** - The ReadBeyond book icon
2. **App Name** - "ReadBeyond" in large, bold text
3. **Tagline** - "Break language barriers, one page at a time"
4. **Key Features** - Visual representation of:
   - 📸 Capture
   - 🔍 Extract  
   - 🌐 Translate

### Design Tips:

- Use dark background (matches app theme: #1a1a1a or similar)
- High contrast text for readability
- Keep it simple and clean
- Use the app's color scheme (primary colors)
- Ensure text is readable at small sizes (when shared)

## Quick Creation Options

### Option 1: Use Online Tools
- **Canva**: https://www.canva.com (search "Open Graph Image" template)
- **Figma**: Create 1200x630 artboard
- **OG Image Generator**: https://www.opengraph.xyz/

### Option 2: Use the HTML Template
1. Open `public/og-image.html` in a browser
2. Take a screenshot at 1200x630 resolution
3. Save as `og-image.png` in the `/public` folder

### Option 3: Design from Scratch
Use any design tool (Photoshop, Figma, Canva) to create:
- 1200px width × 630px height
- Dark theme matching the app
- Include logo, name, and tagline
- Export as PNG

## Testing

After creating the image:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **WhatsApp**: Share the link in a WhatsApp chat to see preview

## Current Status

⚠️ **Note**: The meta tags are configured, but you need to create and add the `og-image.png` file to `/public/` folder for the social media previews to work.
