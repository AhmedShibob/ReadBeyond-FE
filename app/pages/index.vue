<template>
  <main class="min-h-screen bg-background pb-8">
    <div class="reading-container">
      <!-- Header -->
      <header class="mb-4 sm:mb-6 text-center pt-4 sm:pt-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">ReadBeyond</h1>
        <p class="text-sm sm:text-base text-muted-foreground px-4">Break language barriers, one page at a time</p>
      </header>

      <div class="space-y-4 sm:space-y-6">
        <!-- Image Capture Section - Always First and Most Prominent -->
        <section aria-labelledby="capture-heading" class="bg-card border-2 border-primary/30 rounded-xl p-4 sm:p-6 shadow-lg ring-2 ring-primary/10">
          <div class="flex items-center justify-between mb-4">
            <h2 id="capture-heading" class="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Icon name="lucide:camera" class="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
              Capture Image
            </h2>
            <span v-if="!selectedImage" class="text-xs text-muted-foreground hidden sm:inline bg-primary/10 px-2 py-1 rounded">Step 1 of 3</span>
          </div>
          <ImageCapture
            ref="imageCaptureRef"
            @image-selected="handleImageSelected"
            @image-cleared="handleImageCleared"
          />
        </section>

        <!-- OCR Section -->
        <section v-if="selectedImage || ocrText" aria-labelledby="ocr-heading" class="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 id="ocr-heading" class="text-lg font-semibold text-foreground">Extracted Text</h2>
            <span class="text-xs text-muted-foreground hidden sm:inline">Step 2 of 3</span>
          </div>
          <p v-if="ocrText && !isProcessingOCR" class="text-xs text-muted-foreground mb-3">
            <Icon name="lucide:info" class="w-3 h-3 inline mr-1" aria-hidden="true" />
            You can edit the text below if OCR made any mistakes
          </p>
          
          <!-- Extract Button -->
          <div v-if="selectedImage && !ocrText && !isProcessingOCR" class="mb-4">
            <Button
              type="button"
              class="w-full min-h-[48px] text-base font-medium"
              :disabled="isProcessingOCR"
              @click="processOCR"
            >
              <Icon v-if="!isProcessingOCR" name="lucide:scan" class="w-5 h-5 mr-2" aria-hidden="true" />
              <Icon v-else name="lucide:loader-2" class="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              {{ isProcessingOCR ? 'Processing...' : 'Extract Text' }}
            </Button>
          </div>

          <!-- OCR Text Display -->
          <TextDisplay
            v-if="ocrText || isProcessingOCR"
            :text="ocrText"
            title=""
            :loading="isProcessingOCR"
            loading-text="Extracting text from image..."
            :editable="true"
            :selectable="true"
            show-copy
            @update:text="handleOcrTextUpdate"
          />
        </section>

        <!-- Translation Section -->
        <section v-if="ocrText" aria-labelledby="translation-heading" class="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 id="translation-heading" class="text-lg font-semibold text-foreground">Translation</h2>
            <span class="text-xs text-muted-foreground hidden sm:inline">Step 3 of 3</span>
          </div>
          <p v-if="!translatedText && !isTranslating" class="text-xs text-muted-foreground mb-3">
            <Icon name="lucide:info" class="w-3 h-3 inline mr-1" aria-hidden="true" />
            Select your target language and click Translate
          </p>
          <div class="space-y-4">
            <!-- Language Selector -->
            <LanguageSelector
              v-model="selectedLanguage"
              :languages="languages"
            />

            <!-- Translate Button -->
            <Button
              type="button"
              class="w-full min-h-[48px] text-base font-medium"
              :disabled="!selectedLanguage || !ocrText || isTranslating"
              @click="handleTranslate"
            >
              <Icon v-if="!isTranslating" name="lucide:languages" class="w-5 h-5 mr-2" aria-hidden="true" />
              <Icon v-else name="lucide:loader-2" class="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              {{ isTranslating ? 'Translating...' : 'Translate' }}
            </Button>

            <!-- Translation Display -->
            <TextDisplay
              v-if="translatedText || isTranslating"
              :text="translatedText"
              title=""
              :loading="isTranslating"
              loading-text="Translating text..."
              :editable="true"
              :selectable="true"
              :auto-detect-direction="true"
              show-copy
            />
          </div>
        </section>

        <!-- Reset Button -->
        <div v-if="ocrText || translatedText" class="pt-2">
          <Button
            type="button"
            variant="outline"
            class="w-full min-h-[48px] text-base font-medium"
            @click="handleReset"
          >
            <Icon name="lucide:refresh-cw" class="w-5 h-5 mr-2" aria-hidden="true" />
            Start Over
          </Button>
        </div>

        <!-- Quick Start Section - Always last -->
        <section class="bg-muted/30 border border-border rounded-xl p-4 sm:p-5">
          <div class="flex items-start gap-3 sm:gap-4">
            <div class="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="lucide:zap" class="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
            </div>
            <div class="flex-1 space-y-3">
              <div>
                <h3 class="text-sm sm:text-base font-semibold text-foreground mb-2">Quick Start</h3>
                <div class="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/50 border border-border/50">
                    <span class="font-semibold text-primary">1.</span>
                    <span class="text-muted-foreground">Capture image</span>
                  </div>
                  <Icon name="lucide:arrow-right" class="w-4 h-4 text-muted-foreground shrink-0 self-center" aria-hidden="true" />
                  <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/50 border border-border/50">
                    <span class="font-semibold text-primary">2.</span>
                    <span class="text-muted-foreground">Text extracted</span>
                  </div>
                  <Icon name="lucide:arrow-right" class="w-4 h-4 text-muted-foreground shrink-0 self-center" aria-hidden="true" />
                  <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/50 border border-border/50">
                    <span class="font-semibold text-primary">3.</span>
                    <span class="text-muted-foreground">Translate</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <div class="flex items-center gap-1.5">
                  <Icon name="lucide:lightbulb" class="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span>Good lighting works best</span>
                </div>
                <span class="text-border">•</span>
                <div class="flex items-center gap-1.5">
                  <Icon name="lucide:edit" class="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span>Edit text if needed</span>
                </div>
                <span class="text-border">•</span>
                <div class="flex items-center gap-1.5">
                  <Icon name="lucide:copy" class="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span>Copy to save</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Import components
import ImageCapture from '@/components/ImageCapture.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import TextDisplay from '@/components/TextDisplay.vue'
import Button from '@/components/ui/button/Button.vue'

// Import composables
const { languages } = useLanguages()
const { ocrText, isLoading: isProcessingOCR, processImage, reset: resetOCR } = useOCR()
const { translatedText, isLoading: isTranslating, translate, reset: resetTranslation } = useTranslation()
const { showSuccess } = useToast()

// Component refs and state
const imageCaptureRef = ref()
const selectedImage = ref<File | null>(null)
const selectedLanguage = ref('ar') // Default to Arabic
const editableOcrText = ref('')


/**
 * Handle image selection
 */
const handleImageSelected = (file: File) => {
  selectedImage.value = file
  resetOCR()
  resetTranslation()
  selectedLanguage.value = 'ar' // Reset to Arabic default
}

/**
 * Handle image cleared
 */
const handleImageCleared = () => {
  selectedImage.value = null
  resetOCR()
  resetTranslation()
  selectedLanguage.value = 'ar' // Reset to Arabic default
}

/**
 * Process OCR on selected image
 */
const processOCR = async () => {
  if (!selectedImage.value) return

  try {
    await processImage(selectedImage.value)
    showSuccess('Text extracted successfully!')
  } catch {
    // Error is already handled in useOCR composable
  }
}

/**
 * Handle OCR text update from textarea
 */
const handleOcrTextUpdate = (text: string) => {
  editableOcrText.value = text
  // Clear translation when OCR text is edited
  if (translatedText.value) {
    resetTranslation()
  }
}

/**
 * Translate OCR text to selected language
 */
const handleTranslate = async () => {
  // Prioritize edited text - if user has edited, use that; otherwise use original OCR text
  // Check editableOcrText first, and only fall back to ocrText if editableOcrText is empty
  const textToTranslate = (editableOcrText.value && editableOcrText.value.trim()) 
    ? editableOcrText.value.trim() 
    : (ocrText.value?.trim() || '')
  
  if (!textToTranslate || !selectedLanguage.value) return

  try {
    await translate(textToTranslate, selectedLanguage.value)
    showSuccess('Translation completed!')
  } catch {
    // Error is already handled in useTranslation composable
  }
}

/**
 * Reset entire flow
 */
const handleReset = () => {
  imageCaptureRef.value?.clearImage()
  selectedImage.value = null
  resetOCR()
  resetTranslation()
  selectedLanguage.value = 'ar' // Reset to Arabic default
}

// Auto-process OCR when image is selected
// Why: Better UX - user doesn't need to click extra button
watch(selectedImage, (newImage) => {
  if (newImage && !ocrText.value && !isProcessingOCR.value) {
    nextTick(() => {
      processOCR()
    })
  }
})

// Update editable text when OCR completes (only if user hasn't edited it yet)
watch(ocrText, (newText) => {
  if (newText && !editableOcrText.value) {
    editableOcrText.value = newText
  }
}, { immediate: true })

// Set page title
useHead({
  title: 'ReadBeyond - Translate Text from Images'
})
</script>
