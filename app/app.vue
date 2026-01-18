<template>
  <div>
    <AppNavbar />
    <NuxtPage />
    <Toaster position="bottom-right" rich-colors :toast-options="{ duration: 4000 }" theme="dark" />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import

// SEO Configuration
const config = useRuntimeConfig()
// Ensure siteUrl is absolute HTTPS URL for WhatsApp compatibility
const siteUrl = (config.public.siteUrl || 'https://read-beyond.vercel.app').replace(/\/$/, '')
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
    // Facebook/Messenger App ID (optional - add if you have a Facebook App)
    // { property: 'fb:app_id', content: 'YOUR_FACEBOOK_APP_ID' },
  ]
})
</script>
