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

        <!-- Collapsible Help Section - Only shows when no image -->
        <section v-if="!selectedImage && !ocrText" class="mb-4 sm:mb-6">
          <details class="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
            <summary class="cursor-pointer list-none flex items-center justify-between">
              <h2 class="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <Icon name="lucide:help-circle" class="w-5 h-5 text-primary" aria-hidden="true" />
                <span>How to Use</span>
              </h2>
              <Icon name="lucide:chevron-down" class="w-5 h-5 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
            </summary>
            <div class="mt-4 space-y-4 pt-4 border-t border-border">
              <!-- How It Works -->
              <div>
                <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="lucide:lightbulb" class="w-4 h-4 text-primary" aria-hidden="true" />
                  How It Works
                </h3>
                <div class="space-y-3">
                  <div class="flex gap-3">
                    <div class="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      1
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-foreground mb-1 text-sm">Capture</h4>
                      <p class="text-xs text-muted-foreground">Take a photo or upload an image with text</p>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      2
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-foreground mb-1 text-sm">Extract</h4>
                      <p class="text-xs text-muted-foreground">Text is automatically extracted (you can edit it)</p>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      3
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-foreground mb-1 text-sm">Translate</h4>
                      <p class="text-xs text-muted-foreground">Select language and get instant translation</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Tips -->
              <div>
                <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="lucide:sparkles" class="w-4 h-4 text-primary" aria-hidden="true" />
                  Quick Tips
                </h3>
                <ul class="space-y-2 text-xs text-muted-foreground">
                  <li class="flex items-start gap-2">
                    <Icon name="lucide:check" class="w-3 h-3 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Use good lighting and hold camera steady</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="lucide:check" class="w-3 h-3 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Edit extracted text if OCR made mistakes</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="lucide:check" class="w-3 h-3 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Copy translations to save for later</span>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </section>
      </div>

      <div class="space-y-4 sm:space-y-6">
        <!-- Image Capture Section -->
        <section aria-labelledby="capture-heading" class="bg-card border-2 border-primary/20 rounded-xl p-4 sm:p-6 shadow-lg">
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
  const textToTranslate = editableOcrText.value || ocrText.value
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

// Update editable text when OCR completes
watch(ocrText, (newText) => {
  if (newText) {
    editableOcrText.value = newText
  }
}, { immediate: true })

// Set page title
useHead({
  title: 'ReadBeyond - Translate Text from Images'
})
</script>
