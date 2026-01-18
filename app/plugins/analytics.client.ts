/**
 * Google Analytics Plugin
 * 
 * Loads Google Analytics (GA4) only on client-side and in production
 * Tracks page views automatically for SPA navigation
 */

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gaId = config.public.googleAnalyticsId

  // Only load analytics in production and if GA ID is provided
  if (!gaId || import.meta.dev) {
    return
  }

  // Load Google Analytics script
  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
        async: true,
        defer: true
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `,
        type: 'text/javascript'
      }
    ]
  })

  // Track page views on route changes (for SPA navigation)
  const router = useRouter()
  router.afterEach((to) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', gaId, {
        page_path: to.fullPath,
        page_title: document.title
      })
    }
  })
})

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
