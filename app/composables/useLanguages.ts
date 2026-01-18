/**
 * Language Management Composable
 * 
 * Why: Centralized language definitions
 * - Single source of truth for available languages
 * - Easy to add/remove languages
 * - Consistent language codes
 * - Native names for better UX
 */

export interface Language {
  code: string
  name: string
  nativeName: string
}

/**
 * Curated list of common languages
 * Why 15-20 languages: Balance between coverage and UX
 * Too many = overwhelming dropdown
 * Too few = missing important languages
 */
const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' }
]

export const useLanguages = () => {
  /**
   * Get all available languages
   */
  const getLanguages = (): Language[] => {
    return LANGUAGES
  }

  /**
   * Get language by code
   */
  const getLanguageByCode = (code: string): Language | undefined => {
    return LANGUAGES.find(lang => lang.code === code)
  }

  /**
   * Get language name (prefer native name for better UX)
   */
  const getLanguageDisplayName = (code: string, useNative = true): string => {
    const lang = getLanguageByCode(code)
    if (!lang) return code
    return useNative ? lang.nativeName : lang.name
  }

  /**
   * Search languages by name or native name
   */
  const searchLanguages = (query: string): Language[] => {
    const lowerQuery = query.toLowerCase()
    return LANGUAGES.filter(
      lang =>
        lang.name.toLowerCase().includes(lowerQuery) ||
        lang.nativeName.toLowerCase().includes(lowerQuery) ||
        lang.code.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    languages: LANGUAGES,
    getLanguages,
    getLanguageByCode,
    getLanguageDisplayName,
    searchLanguages
  }
}
