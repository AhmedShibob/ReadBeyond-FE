<template>
  <div class="w-full space-y-2" style="pointer-events: auto;">
    <div v-if="title" class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-foreground">
        {{ title }}
      </h3>
      <Button
        v-if="text && showCopy"
        type="button"
        variant="ghost"
        size="sm"
        class="min-h-[44px]"
        :aria-label="`Copy ${title} to clipboard`"
        @click="copyToClipboard"
      >
        <Icon name="lucide:copy" class="w-4 h-4 mr-2" aria-hidden="true" />
        Copy
      </Button>
    </div>

    <!-- Copy button when no title but showCopy is true -->
    <div v-if="!title && text && showCopy && !loading" class="flex justify-end mb-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        class="min-h-[40px] px-3"
        aria-label="Copy text to clipboard"
        @click="copyToClipboard"
      >
        <Icon name="lucide:copy" class="w-4 h-4 sm:mr-2" aria-hidden="true" />
        <span class="hidden sm:inline">Copy</span>
      </Button>
    </div>

      
    <div
      v-if="loading"
      class="flex items-center justify-center py-12"
      role="status"
      aria-live="polite"
      :aria-label="loadingText"
    >
      <Icon name="lucide:loader-2" class="w-6 h-6 text-primary animate-spin mr-3" aria-hidden="true" />
      <span class="text-sm text-muted-foreground">{{ loadingText }}</span>
    </div>

    <textarea
      v-else-if="text && editable"
      ref="editableTextareaRef"
      v-model="localText"
      :dir="textDirection"
      class="w-full border border-input rounded-lg p-6 resize-y min-h-[120px]"
      style="user-select: text !important; -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; pointer-events: auto !important; -webkit-touch-callout: default !important;"
      placeholder="Edit the extracted text here..."
      @input="handleTextareaInput"
      @keydown.ctrl.a.prevent="selectAllText"
      @keydown.meta.a.prevent="selectAllText"
    />
    
  
    <div
      v-else-if="text && !editable && !selectable"
      :dir="textDirection"
      class="reading-text bg-card border border-border rounded-lg p-6 text-foreground whitespace-pre-wrap wrap-break-word select-text"
      role="article"
      :aria-label="title || 'Text content'"
    >
      {{ text }}
    </div>

    <div
      v-else
      class="text-center py-12 text-muted-foreground"
      role="status"
    >
      <Icon name="lucide:file-text" class="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
      <p class="text-sm">{{ placeholder }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

interface Props {
  text?: string
  title?: string
  loading?: boolean
  loadingText?: string
  placeholder?: string
  showCopy?: boolean
  editable?: boolean
  selectable?: boolean
  autoDetectDirection?: boolean // Auto-detect RTL for translation text
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  title: '',
  loading: false,
  loadingText: 'Processing...',
  placeholder: 'No text available',
  showCopy: true,
  editable: false,
  selectable: true,
  autoDetectDirection: false
})

const emit = defineEmits<{
  'update:text': [value: string]
}>()

const localText = ref(props.text || '')
const editableTextareaRef = ref<HTMLTextAreaElement | null>(null)
const selectableTextareaRef = ref<HTMLTextAreaElement | null>(null)

const { showSuccess, showError } = useToast()

/**
 * Detect if text is RTL (Right-to-Left)
 * Checks for Arabic, Hebrew, and other RTL scripts
 */
const isRTL = (text: string): boolean => {
  if (!text || !text.trim()) return false
  
  // Arabic Unicode range: \u0600-\u06FF
  // Hebrew Unicode range: \u0590-\u05FF
  // Persian/Farsi: \u0600-\u06FF (same as Arabic)
  // Urdu: \u0600-\u06FF (same as Arabic)
  const rtlPattern = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  
  // Check if text contains RTL characters
  return rtlPattern.test(text)
}

/**
 * Get text direction based on content
 */
const textDirection = computed(() => {
  if (!props.autoDetectDirection) return 'ltr'
  
  const textToCheck = props.editable ? localText.value : props.text
  return isRTL(textToCheck || '') ? 'rtl' : 'ltr'
})

/**
 * Select all text in textarea
 */
const selectAllText = (event: KeyboardEvent) => {
  event.preventDefault()
  const textarea = editableTextareaRef.value || selectableTextareaRef.value
  if (textarea) {
    textarea.focus()
    textarea.select()
  }
}

/**
 * Handle textarea input
 */
const handleTextareaInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  localText.value = target.value
  emit('update:text', target.value)
}

/**
 * Watch for external text changes (only when not editing)
 */
watch(() => props.text, (newText) => {
  if (newText !== undefined && newText !== localText.value) {
    localText.value = newText
  }
}, { immediate: true })

/**
 * Watch localText changes to update direction for editable textareas
 */
watch(localText, () => {
  // Direction will update automatically via computed property
}, { deep: true })

/**
 * Copy text to clipboard
 */
const copyToClipboard = async () => {
  // For editable textareas, use the current localText value (which includes user edits)
  // For non-editable, use the props.text
  const textToCopy = props.editable ? (localText.value || props.text || '') : (props.text || '')
  if (!textToCopy || !textToCopy.trim()) return

  try {
    await navigator.clipboard.writeText(textToCopy.trim())
    showSuccess('Copied to clipboard!')
  } catch {
    showError('Failed to copy', 'Please try selecting and copying the text manually.')
  }
}
</script>
