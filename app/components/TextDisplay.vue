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
        v-model="localText"
        class="w-full border border-input rounded-lg p-6 resize-y min-h-[120px]"
        style="user-select: text !important; -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; pointer-events: auto !important; -webkit-touch-callout: default !important;"
        placeholder="Edit the extracted text here..."
      />
    
  
    <div
      v-else-if="text && !editable && !selectable"
      class="reading-text bg-card border border-border rounded-lg p-6 text-foreground whitespace-pre-wrap break-words select-text"
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
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingText: 'Processing...',
  placeholder: 'No text available',
  showCopy: true,
  editable: false,
  selectable: true
})

const emit = defineEmits<{
  'update:text': [value: string]
}>()

const localText = ref(props.text || '')
const editableTextareaRef = ref<HTMLTextAreaElement | null>(null)
const selectableTextareaRef = ref<HTMLTextAreaElement | null>(null)

const { showSuccess, showError } = useToast()

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
 * Copy text to clipboard
 */
const copyToClipboard = async () => {
  const textToCopy = props.editable ? localText.value : props.text
  if (!textToCopy) return

  try {
    await navigator.clipboard.writeText(textToCopy)
    showSuccess('Copied to clipboard!')
  } catch {
    showError('Failed to copy', 'Please try selecting and copying the text manually.')
  }
}
</script>
