/**
 * Translation Composable
 * 
 * Why: Separate translation logic from UI
 * - Reusable translation functionality
 * - Centralized error handling
 * - Rate limit handling
 * - Loading state management
 */

import { apiRequest, ApiClientError } from '@/utils/api'
import { useToast } from './useToast'
import { useLanguages } from './useLanguages'

interface TranslationResponse {
  original: string
  translated: string
  targetLanguage: string
  sourceLanguage?: string
  confidence?: number
}

interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

export const useTranslation = () => {
  const translatedText = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const targetLanguage = ref<string>('')
  const { showError, showLoading, toast } = useToast()
  const { getLanguageDisplayName } = useLanguages()

  /**
   * Translate text to target language
   */
  const translate = async (text: string, language: string): Promise<string> => {
    if (!text.trim()) {
      const errorMsg = 'No text to translate'
      error.value = errorMsg
      showError('Translation Error', errorMsg)
      throw new Error(errorMsg)
    }

    if (!language) {
      const errorMsg = 'Please select a target language'
      error.value = errorMsg
      showError('Translation Error', errorMsg)
      throw new Error(errorMsg)
    }

    isLoading.value = true
    error.value = null
    translatedText.value = ''
    targetLanguage.value = language

    const targetLangName = getLanguageDisplayName(language)
    const loadingToast = showLoading(`Translating to ${targetLangName}...`)

    try {
      const response = await apiRequest<TranslationResponse>('/api/translate', {
        method: 'POST',
        body: JSON.stringify({
          text: text.trim(),
          targetLanguage: language
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.translated || response.translated.trim().length === 0) {
        const errorMsg = 'Translation returned empty result. Please try again.'
        error.value = errorMsg
        toast.dismiss(loadingToast)
        showError('Translation Failed', errorMsg)
        throw new Error(errorMsg)
      }

      translatedText.value = response.translated.trim()
      toast.dismiss(loadingToast)
      return translatedText.value
    } catch (err: unknown) {
      toast.dismiss(loadingToast)

      if (err instanceof ApiClientError) {
        // Handle rate limiting specifically
        if (err.status === 429) {
          error.value = 'Too many translation requests. Please wait a moment.'
          showError('Rate Limit', 'Too many requests. Please wait a moment and try again.')
        } else {
          error.value = err.message
          showError('Translation Failed', err.message)
        }
      } else {
        const errorMsg = 'Failed to translate text. Please check your connection and try again.'
        error.value = errorMsg
        showError('Translation Error', errorMsg)
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset translation state
   */
  const reset = () => {
    translatedText.value = ''
    error.value = null
    isLoading.value = false
    targetLanguage.value = ''
  }

  return {
    translatedText: readonly(translatedText),
    isLoading: readonly(isLoading),
    error: readonly(error),
    targetLanguage: readonly(targetLanguage),
    translate,
    reset
  }
}
