// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// Type declaration for process.env in config file
declare const process: {
  env?: {
    API_BASE_URL?: string
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
      apiBase: process.env?.API_BASE_URL || 'http://localhost:3000'
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
        { name: 'description', content: 'ReadBeyond - Translate Text from Images' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:title', content: 'ReadBeyond - Translate Text from Images' },
        { property: 'og:description', content: 'ReadBeyond - Translate Text from Images' },
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