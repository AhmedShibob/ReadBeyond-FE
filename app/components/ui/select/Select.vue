<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLDivElement | null>(null)

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

// Provide select function to child SelectItem components
provide('selectFn', handleSelect)

const toggleOpen = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

// Close on outside click and escape key
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      isOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<template>
  <div ref="selectRef" class="relative w-full" :class="props.class">
    <button
      type="button"
      :disabled="disabled"
      :class="cn(
        'flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]',
        isOpen && 'ring-2 ring-ring'
      )"
      @click="toggleOpen"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <span :class="cn('truncate', !modelValue && 'text-muted-foreground')">
        <slot name="value" :value="modelValue">
          {{ modelValue || placeholder }}
        </slot>
      </span>
      <Icon
        name="lucide:chevron-down"
        :class="cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')"
        aria-hidden="true"
      />
    </button>
    
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md"
        role="listbox"
      >
        <div class="max-h-[300px] overflow-auto p-1">
          <slot :select="handleSelect" :value="modelValue" />
        </div>
      </div>
    </Transition>
  </div>
</template>
