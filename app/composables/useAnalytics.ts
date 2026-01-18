/**
 * Analytics Composable
 * 
 * Provides functions to track custom events in Google Analytics
 * Only works if Google Analytics is configured
 */

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const gaId = config.public.googleAnalyticsId

  /**
   * Track a custom event
   * @param eventName - Name of the event
   * @param eventParams - Additional parameters for the event
   */
  const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
    if (!gaId || import.meta.dev || typeof window === 'undefined' || !window.gtag) {
      return
    }

    window.gtag('event', eventName, {
      ...eventParams,
      event_category: eventParams?.event_category || 'engagement',
      event_label: eventParams?.event_label || eventName
    })
  }

  /**
   * Track image capture/upload
   */
  const trackImageCapture = () => {
    trackEvent('image_captured', {
      event_category: 'user_action',
      event_label: 'Image Captured'
    })
  }

  /**
   * Track OCR processing
   */
  const trackOCR = (success: boolean, processingTime?: number) => {
    trackEvent('ocr_processed', {
      event_category: 'ocr',
      event_label: success ? 'OCR Success' : 'OCR Failed',
      value: processingTime,
      success
    })
  }

  /**
   * Track translation
   */
  const trackTranslation = (targetLanguage: string, success: boolean) => {
    trackEvent('translation_requested', {
      event_category: 'translation',
      event_label: `Translate to ${targetLanguage}`,
      target_language: targetLanguage,
      success
    })
  }

  /**
   * Track image crop
   */
  const trackImageCrop = () => {
    trackEvent('image_cropped', {
      event_category: 'user_action',
      event_label: 'Image Cropped'
    })
  }

  /**
   * Track copy action
   */
  const trackCopy = (type: 'extracted_text' | 'translation') => {
    trackEvent('text_copied', {
      event_category: 'user_action',
      event_label: `Copied ${type}`
    })
  }

  return {
    trackEvent,
    trackImageCapture,
    trackOCR,
    trackTranslation,
    trackImageCrop,
    trackCopy
  }
}
