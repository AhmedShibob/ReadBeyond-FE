<template>
  <div class="flex flex-col min-h-screen">
    <AppNavbar />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
    <Toaster position="bottom-right" rich-colors :toast-options="{ duration: 4000 }" theme="dark" />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import

// SEO Configuration
const config = useRuntimeConfig()
// Ensure siteUrl is absolute HTTPS URL for WhatsApp/Telegram compatibility
const siteUrl = config.public.siteUrl 
// Ensure ogImage is absolute HTTPS URL (required for Telegram, WhatsApp, Messenger)
const ogImage = `${siteUrl}/og-image.png`

useSeoMeta({
  description: 'Break language barriers, one page at a time. Capture text from images, extract it automatically, and translate to your language in seconds. Perfect for language learners, travelers, and readers.',
  ogTitle: 'ReadBeyond - Translate Text from Images',
  ogDescription: 'Break language barriers, one page at a time. Capture text from images, extract it automatically, and translate to your language in seconds.',
  ogImage: ogImage,
  ogImageSecureUrl: ogImage, // Required for WhatsApp & Messenger - must be HTTPS
  ogUrl: siteUrl,
  ogType: 'website',
  ogSiteName: 'ReadBeyond',
  ogLocale: 'en_US',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: 'ReadBeyond - Translate text from images instantly',
  ogImageType: 'image/png',
  // Additional tags for better Messenger/Facebook compatibility
  ogImageUrl: ogImage, // Alternative property name
  twitterCard: 'summary_large_image',
  twitterTitle: 'ReadBeyond - Translate Text from Images',
  twitterDescription: 'Break language barriers, one page at a time. Capture text from images, extract it automatically, and translate to your language in seconds.',
  twitterImage: ogImage,
  twitterImageAlt: 'ReadBeyond - Translate text from images instantly',
})

useHead({
  htmlAttrs: {
    lang: 'en',
    class: 'dark'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png'
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest'
    }
  ],
  meta: [
    { name: 'author', content: 'ReadBeyond' },
    { name: 'keywords', content: 'translation, OCR, text extraction, language learning, image to text, translate, multilingual, reading' },
    // Explicit Open Graph meta tags for Facebook/Messenger (some platforms need these as separate meta tags)
    { property: 'og:title', content: 'ReadBeyond - Translate Text from Images' },
    { property: 'og:description', content: 'Break language barriers, one page at a time. Capture text from images, extract it automatically, and translate to your language in seconds.' },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:url', content: ogImage }, // Telegram prefers this format
    { property: 'og:image:secure_url', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:alt', content: 'ReadBeyond - Translate text from images instantly' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'ReadBeyond' },
    { property: 'og:locale', content: 'en_US' },
    // Telegram-specific: Ensure image is in meta tags (Telegram reads these)
    { name: 'twitter:image', content: ogImage }, // Telegram sometimes falls back to Twitter cards
    { name: 'twitter:image:src', content: ogImage },
    // Facebook/Messenger App ID (optional - add if you have a Facebook App)
    // { property: 'fb:app_id', content: 'YOUR_FACEBOOK_APP_ID' },
  ]
})
</script>
