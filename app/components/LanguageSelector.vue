<template>
  <div class="w-full space-y-2 sm:space-y-3">
    <label
      for="language-select"
      class="text-sm sm:text-base font-semibold text-foreground block"
    >
      Translate to
    </label>
    <Select
      id="language-select"
      :model-value="modelValue"
      placeholder="Select a language..."
      class="w-full min-h-[48px] text-base"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #value="{ value }">
        <span v-if="value">
          {{ getLanguageDisplayName(value) }}
        </span>
        <span v-else class="text-muted-foreground">
          Select a language...
        </span>
      </template>
      <template v-for="lang in languages" :key="lang.code">
        <SelectItem
          :value="lang.code"
        >
          {{ lang.nativeName }} ({{ lang.name }})
        </SelectItem>
      </template>
    </Select>
  </div>
</template>

<script setup lang="ts">
import type { Language } from '@/composables/useLanguages'
import { Select, SelectItem } from '@/components/ui/select'
import { useLanguages } from '@/composables/useLanguages'

interface Props {
  modelValue: string
  languages: Language[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { getLanguageDisplayName } = useLanguages()
</script>
