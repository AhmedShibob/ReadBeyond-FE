// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// Type declaration for process.env in config file
declare const process: {
  env?: {
    API_BASE_URL?: string
    SITE_URL?: string
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['./app/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/hints',
    '@nuxt/scripts',
    'shadcn-nuxt'
  ],

  fonts: {
    families: [
      { name: 'Tajawal', provider: 'google' }
    ]
  },

  icon: {
    provider: 'iconify'
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },
  runtimeConfig: {
    public: {
      apiBase: process.env?.API_BASE_URL || 'http://localhost:3000',
      siteUrl: process.env?.SITE_URL || 'https://readbeyond.app'
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'dark'
      },
      title: 'ReadBeyond - Translate Text from Images',
      meta: [
        // Basic meta tags
        { name: 'description', content: 'Break language barriers, one page at a time. Capture text from images, extract it automatically, and translate to your language in seconds. Perfect for language learners, travelers, and readers.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'ReadBeyond' },
        { name: 'keywords', content: 'translation, OCR, text extraction, language learning, image to text, translate, multilingual, reading' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'ReadBeyond - Translate Text from Images' },
        { property: 'og:description', content: 'Break language barriers, one page at a time. Capture text from images, extract it automatically, and translate to your language in seconds.' },
        { property: 'og:image', content: `${process.env?.SITE_URL || 'https://readbeyond.app'}/og-image.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'ReadBeyond - Translate text from images instantly' },
        { property: 'og:url', content: process.env?.SITE_URL || 'https://readbeyond.app' },
        { property: 'og:site_name', content: 'ReadBeyond' },
        { property: 'og:locale', content: 'en_US' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ReadBeyond - Translate Text from Images' },
        { name: 'twitter:description', content: 'Break language barriers, one page at a time. Capture text from images, extract it automatically, and translate to your language in seconds.' },
        { name: 'twitter:image', content: `${process.env?.SITE_URL || 'https://readbeyond.app'}/og-image.png` },
        { name: 'twitter:image:alt', content: 'ReadBeyond - Translate text from images instantly' },
        
        // WhatsApp / Telegram
        { property: 'og:image:type', content: 'image/png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },

        { rel: 'manifest', href: '/site.webmanifest' }
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  }
})