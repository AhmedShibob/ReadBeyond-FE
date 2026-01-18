<template>
  <div class="w-full space-y-4">
    <!-- Hidden file input for camera/file picker -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      :capture="isMobile ? 'environment' : undefined"
      class="hidden"
      aria-label="Capture or upload image"
      @change="handleFileChange"
    >

    <!-- Upload area (shown when no image) -->
    <div
      v-if="!previewImage"
      class="flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-dashed border-border rounded-xl bg-muted/20 cursor-pointer hover:bg-muted/40 active:bg-muted/50 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-primary"
      tabindex="0"
      role="button"
      aria-label="Click to capture or upload an image"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
    >
      <div class="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 mb-4">
        <Icon name="lucide:camera" class="w-10 h-10 sm:w-12 sm:h-12 text-primary" aria-hidden="true" />
      </div>
      <p class="text-base sm:text-lg font-semibold text-foreground mb-2">
        {{ isMobile ? 'Tap to open camera' : 'Tap to capture or upload' }}
      </p>
      <p class="text-sm sm:text-base text-muted-foreground text-center px-4 max-w-md">
        {{ isMobile ? 'Take a photo of the text you want to translate' : 'Take a photo of text or select an image from your device' }}
      </p>
    </div>

    <!-- Image preview (shown when image is selected) -->
    <div v-else class="space-y-3 sm:space-y-4">
      <div class="relative w-full rounded-xl overflow-hidden border border-border bg-muted/20 shadow-sm">
        <img
          :src="previewImage"
          alt="Preview of captured image"
          class="w-full h-auto max-h-80 sm:max-h-96 object-contain"
        >
        <button
          type="button"
          class="absolute top-2 right-2 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-background/95 hover:bg-background border border-border shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Remove image"
          @click="clearImage"
        >
          <Icon name="lucide:x" class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div class="flex gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          class="flex-1 min-h-[48px] text-base font-medium"
          @click="clearImage"
        >
          <Icon name="lucide:trash-2" class="w-5 h-5 mr-2" aria-hidden="true" />
          Remove
        </Button>
        <Button
          type="button"
          variant="outline"
          class="flex-1 min-h-[48px] text-base font-medium"
          @click="triggerFileInput"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5 mr-2" aria-hidden="true" />
          Change
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const fileInputRef = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const emit = defineEmits<{
  imageSelected: [file: File]
  imageCleared: []
}>()

const { showError } = useToast()

/**
 * Detect if device is mobile
 * Use ref instead of computed to avoid SSR issues
 */
const isMobile = ref(false)

/**
 * Initialize mobile detection on client side
 */
onMounted(() => {
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || ''
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
  
  // Also check screen width as fallback
  const isSmallScreen = window.innerWidth <= 768
  
  isMobile.value = isMobileDevice || isSmallScreen
})

/**
 * Trigger file input click
 */
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

/**
 * Handle file selection
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showError('Invalid File Type', 'Please select a valid image file (JPG, PNG, etc.)')
    return
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    showError('File Too Large', 'Please select an image smaller than 10MB')
    return
  }

  selectedFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
    emit('imageSelected', file)
  }
  reader.onerror = () => {
    showError('Image Load Error', 'Failed to load the image. Please try again.')
  }
  reader.readAsDataURL(file)
}

/**
 * Clear selected image
 */
const clearImage = () => {
  previewImage.value = null
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  emit('imageCleared')
}

/**
 * Get current file (for parent component access)
 */
defineExpose({
  clearImage,
  selectedFile: readonly(selectedFile)
})
</script>
