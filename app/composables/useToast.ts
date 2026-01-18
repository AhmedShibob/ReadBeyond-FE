/**
 * Toast Notification Composable
 * 
 * Why: Centralized toast management
 * - Consistent messaging across the app
 * - Mobile-optimized positioning
 * - User-friendly error messages
 * - Easy to extend with custom toast types
 */

import { toast } from 'vue-sonner'

export const useToast = () => {
  /**
   * Show error toast with user-friendly message
   */
  const showError = (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 5000,
      class: 'mobile-toast'
    })
  }

  /**
   * Show success toast
   */
  const showSuccess = (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 3000,
      class: 'mobile-toast'
    })
  }

  /**
   * Show info toast
   */
  const showInfo = (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 3000,
      class: 'mobile-toast'
    })
  }

  /**
   * Show loading toast (returns dismiss function)
   */
  const showLoading = (message: string) => {
    return toast.loading(message, {
      class: 'mobile-toast'
    })
  }

  /**
   * Show promise toast (for async operations)
   */
  const showPromise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      class: 'mobile-toast'
    })
  }

  return {
    showError,
    showSuccess,
    showInfo,
    showLoading,
    showPromise,
    toast
  }
}
