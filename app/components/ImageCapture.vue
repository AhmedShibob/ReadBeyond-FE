<template>
  <div class="w-full space-y-4">
    <!-- Hidden file input for camera (mobile) or file picker (desktop) -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      :capture="shouldUseCamera ? 'environment' : undefined"
      class="hidden"
      aria-label="Capture or upload image"
      @change="handleFileChange"
    >
    
    <!-- Hidden file input for gallery upload (mobile only - no camera) -->
    <input
      ref="galleryInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      aria-label="Upload image from gallery"
      @change="handleFileChange"
    >

    <!-- Upload area (shown when no image) -->
    <div
      v-if="!previewImage"
      class="space-y-4"
    >
      <!-- Main upload area -->
      <div
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
          {{ mobileText.title }}
        </p>
        <p class="text-sm sm:text-base text-muted-foreground text-center px-4 max-w-md">
          {{ mobileText.description }}
        </p>
      </div>
      
      <!-- Upload from Gallery button (mobile only) - ClientOnly to prevent hydration mismatch -->
      <ClientOnly>
        <template #default>
          <Button
            v-if="showGalleryButton"
            type="button"
            variant="outline"
            class="w-full min-h-[48px] text-base font-medium sm:hidden"
            @click="triggerGalleryInput"
          >
            <Icon name="lucide:image" class="w-5 h-5 mr-2" aria-hidden="true" />
            Upload from Gallery
          </Button>
        </template>
        <template #fallback>
          <!-- Placeholder to maintain consistent DOM structure -->
          <div class="w-full min-h-[48px] sm:hidden" aria-hidden="true" />
        </template>
      </ClientOnly>
    </div>

    <!-- Image cropper (shown when image is selected and not yet cropped) -->
    <div v-else-if="showCropper" class="space-y-3 sm:space-y-4">
      <div class="relative w-full rounded-xl overflow-hidden border border-border bg-muted/20 shadow-sm" style="height: 400px; min-height: 300px;">
        <Cropper
          ref="cropperRef"
          :src="previewImage"
          :stencil-props="{
            aspectRatio: NaN,
            resizable: true,
            movable: true
          }"
          class="cropper h-full"
        />
      </div>

      <div class="flex gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          class="flex-1 min-h-[48px] text-base font-medium"
          @click="cancelCrop"
        >
          <Icon name="lucide:x" class="w-5 h-5 mr-2" aria-hidden="true" />
          Cancel
        </Button>
        <Button
          type="button"
          variant="default"
          class="flex-1 min-h-[48px] text-base font-medium"
          @click="applyCrop"
        >
          <Icon name="lucide:check" class="w-5 h-5 mr-2" aria-hidden="true" />
          Apply Crop
        </Button>
      </div>
    </div>

    <!-- Image preview (shown after cropping) -->
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
          @click="showCropperAgain"
        >
          <Icon name="lucide:crop" class="w-5 h-5 mr-2" aria-hidden="true" />
          Crop Again
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
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const fileInputRef = ref<HTMLInputElement | null>(null)
const galleryInputRef = ref<HTMLInputElement | null>(null)
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
// Initialize to null explicitly to ensure SSR/client consistency
// Use a function to ensure consistent initialization
const previewImage = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const showCropper = ref(false)
const originalImageFile = ref<File | null>(null)

const emit = defineEmits<{
  imageSelected: [file: File]
  imageCleared: []
}>()

const { showError } = useToast()

/**
 * Detect if device is mobile
 * Use ref instead of computed to avoid SSR issues
 * Initialize to false for SSR, will be set on client
 */
const isMobile = ref(false)

/**
 * Computed properties to avoid hydration mismatches
 * These return safe defaults during SSR
 */
const shouldUseCamera = computed(() => {
  // Always return false during SSR to ensure consistent rendering
  // This ensures the capture attribute is undefined on both server and initial client render
  if (import.meta.server) return false
  if (!import.meta.client) return false
  return isMobile.value
})

const showGalleryButton = computed(() => {
  // Always return false during SSR to ensure consistent rendering
  if (import.meta.server) return false
  if (!import.meta.client) return false
  return isMobile.value
})

const mobileText = computed(() => {
  // Always return desktop text during SSR
  if (import.meta.server) {
    return {
      title: 'Tap to capture or upload',
      description: 'Take a photo of text or select an image from your device'
    }
  }
  if (!import.meta.client || !isMobile.value) {
    return {
      title: 'Tap to capture or upload',
      description: 'Take a photo of text or select an image from your device'
    }
  }
  return {
    title: 'Tap to open camera',
    description: 'Take a photo of the text you want to translate'
  }
})

/**
 * Initialize mobile detection on client side only
 */
if (import.meta.client) {
  onMounted(() => {
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || ''
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    
    // Also check screen width as fallback
    const isSmallScreen = window.innerWidth <= 768
    
    isMobile.value = isMobileDevice || isSmallScreen
  })
}

/**
 * Trigger file input click (camera on mobile, file picker on desktop)
 */
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

/**
 * Trigger gallery file input click (file picker only, no camera)
 */
const triggerGalleryInput = () => {
  galleryInputRef.value?.click()
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

  originalImageFile.value = file

  // Create preview and show cropper
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
    showCropper.value = true
  }
  reader.onerror = () => {
    showError('Image Load Error', 'Failed to load the image. Please try again.')
  }
  reader.readAsDataURL(file)
}

/**
 * Apply crop and convert to file
 */
const applyCrop = () => {
  if (!cropperRef.value || !originalImageFile.value) return

  const { canvas } = cropperRef.value.getResult()
  
  if (!canvas) {
    showError('Crop Error', 'Failed to crop the image. Please try again.')
    return
  }

  // Convert canvas to blob
  canvas.toBlob((blob) => {
    if (!blob) {
      showError('Crop Error', 'Failed to process the cropped image. Please try again.')
      return
    }

    // Create a File from the blob
    if (!originalImageFile.value) return
    
    const croppedFile = new File([blob], originalImageFile.value.name, {
      type: originalImageFile.value.type || 'image/png',
      lastModified: Date.now()
    })

    selectedFile.value = croppedFile
    showCropper.value = false

    // Update preview with cropped image
    previewImage.value = canvas.toDataURL()
    
    // Emit the cropped file
    emit('imageSelected', croppedFile)
  }, originalImageFile.value.type || 'image/png', 0.95)
}

/**
 * Cancel crop and clear image selection
 */
const cancelCrop = () => {
  clearImage()
}

/**
 * Show cropper again with original image
 */
const showCropperAgain = () => {
  if (!originalImageFile.value) return
  
  // Reload original image into cropper
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
    showCropper.value = true
  }
  reader.readAsDataURL(originalImageFile.value)
}

/**
 * Clear selected image
 */
const clearImage = () => {
  previewImage.value = null
  selectedFile.value = null
  originalImageFile.value = null
  showCropper.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  if (galleryInputRef.value) {
    galleryInputRef.value.value = ''
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

<style scoped>
/* Cropper styling */
.cropper {
  width: 100%;
  height: 100%;
}


</style>
