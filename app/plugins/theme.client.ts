/**
 * Theme initialization plugin
 * Runs on client-side only to initialize theme from localStorage
 */

export default defineNuxtPlugin(() => {
  const { initTheme } = useTheme()
  
  // Initialize theme immediately on client-side
  initTheme()
})
