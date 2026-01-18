/**
 * Theme Composable
 * 
 * Manages dark/light theme switching with persistence
 */

export const useTheme = () => {
  // Default to dark mode for SSR consistency
  const isDark = ref(true)

  /**
   * Initialize theme from localStorage or default to dark
   */
  const initTheme = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('theme')
        
        // Default to dark mode (as per requirements)
        // Use saved preference if exists, otherwise default to dark
        const shouldBeDark = saved ? saved === 'dark' : true
        isDark.value = shouldBeDark
        applyTheme(shouldBeDark)
      } catch (error) {
        // Fallback to dark if localStorage is not available
        isDark.value = true
        applyTheme(true)
      }
    }
  }

  /**
   * Apply theme to document
   */
  const applyTheme = (dark: boolean) => {
    if (import.meta.client) {
      const html = document.documentElement
      if (dark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  }

  /**
   * Toggle theme
   */
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  /**
   * Set theme explicitly
   */
  const setTheme = (dark: boolean) => {
    isDark.value = dark
    applyTheme(dark)
  }

  // Initialize on client side
  if (import.meta.client) {
    initTheme()
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
    initTheme
  }
}
