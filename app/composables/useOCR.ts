/**
 * OCR Composable
 * 
 * Why: Encapsulate OCR logic
 * - Reusable across components
 * - Centralized error handling
 * - Loading state management
 * - Easy to test and mock
 */

import { uploadFile, ApiClientError } from '@/utils/api'
import { useToast } from './useToast'

interface OCRResponse {
  status: string
  message: string
  data: {
    filename: string
    mimetype: string
    size: number
    text: string
    confidence?: number
    language?: string
    processingTime?: number
    wordCount?: number
  }
}

export const useOCR = () => {
  const ocrText = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const { showError, showLoading, toast } = useToast()

  /**
   * Process image through OCR
   */
  const processImage = async (imageFile: File): Promise<string> => {
    // Validate file
    if (!imageFile.type.startsWith('image/')) {
      const errorMsg = 'Please select a valid image file'
      error.value = errorMsg
      showError('Invalid File', errorMsg)
      throw new Error(errorMsg)
    }

    // Check file size (max 10MB for mobile)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > maxSize) {
      const errorMsg = 'Image is too large. Please use an image smaller than 10MB.'
      error.value = errorMsg
      showError('File Too Large', errorMsg)
      throw new Error(errorMsg)
    }

    isLoading.value = true
    error.value = null
    ocrText.value = ''

    const loadingToast = showLoading('Extracting text from image...')

    try {
      const response = await uploadFile<OCRResponse>('/api/upload', imageFile)

      // Check if response has the expected structure
      if (!response.data?.text || response.data.text.trim().length === 0) {
        const errorMsg = 'No text could be extracted from this image. Please try a clearer image.'
        error.value = errorMsg
        toast.dismiss(loadingToast)
        showError('No Text Found', errorMsg)
        throw new Error(errorMsg)
      }

      // Remove newlines and extra whitespace, then trim
      // Replace all newlines with spaces, then collapse multiple spaces into one
      ocrText.value = response.data.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      toast.dismiss(loadingToast)
      return ocrText.value
    } catch (err: unknown) {
      toast.dismiss(loadingToast)
      
      if (err instanceof ApiClientError) {
        error.value = err.message
        showError('OCR Failed', err.message)
      } else {
        const errorMsg = 'Failed to extract text. Please check your connection and try again.'
        error.value = errorMsg
        showError('OCR Error', errorMsg)
      }
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset OCR state
   */
  const reset = () => {
    ocrText.value = ''
    error.value = null
    isLoading.value = false
  }

  return {
    ocrText: readonly(ocrText),
    isLoading: readonly(isLoading),
    error: readonly(error),
    processImage,
    reset
  }
}
