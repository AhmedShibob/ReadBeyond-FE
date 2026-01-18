/**
 * Centralized API Client
 * 
 * Why: Single source of truth for all API calls
 * - Consistent error handling
 * - Easy to add interceptors (auth, logging, etc.)
 * - Type-safe request/response handling
 * - Centralized timeout and retry logic
 */

export class ApiClientError extends Error {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

/**
 * Format error message for user display
 */
function formatErrorMessage(error: unknown): string {
  const err = error as { data?: { message?: string }; message?: string; status?: number; statusCode?: number }
  
  if (err?.data?.message) {
    return err.data.message
  }
  if (err?.message) {
    return err.message
  }
  const status = err?.status || err?.statusCode
  if (status === 429) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  if (status === 413) {
    return 'Image file is too large. Please use a smaller image.'
  }
  if (status && status >= 500) {
    return 'Server error. Please try again later.'
  }
  if (status === 404) {
    return 'Service not found. Please check your connection.'
  }
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Make API request with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: unknown
    headers?: Record<string, string>
  } = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  try {
    const response = await $fetch<T>(`${baseURL}${endpoint}`, {
      method: options.method || 'GET',
      body: options.body as BodyInit,
      headers: options.headers
    })

    return response
  } catch (error: unknown) {
    const message = formatErrorMessage(error)
    const status = (error as { status?: number; statusCode?: number })?.status || (error as { status?: number; statusCode?: number })?.statusCode
    const code = (error as { data?: { code?: string } })?.data?.code

    throw new ApiClientError(message, status, code)
  }
}

/**
 * Upload file to API
 */
export async function uploadFile<T>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string | number>
): Promise<T> {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const formData = new FormData()
  formData.append('image', file)

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
  }

  try {
    const response = await $fetch<T>(`${baseURL}${endpoint}`, {
      method: 'POST',
      body: formData
    })

    return response
  } catch (error: unknown) {
    const message = formatErrorMessage(error)
    const status = (error as { status?: number; statusCode?: number })?.status || (error as { status?: number; statusCode?: number })?.statusCode
    const code = (error as { data?: { code?: string } })?.data?.code

    throw new ApiClientError(message, status, code)
  }
}
