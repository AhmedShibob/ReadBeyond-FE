<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  disabled?: boolean
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

// Get the select function from parent Select component via provide/inject
const selectFn = inject<(value: string) => void>('selectFn', null)

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && selectFn) {
    event.stopPropagation()
    selectFn(props.value)
  }
}
</script>

<template>
  <div
    :class="cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
      props.class
    )"
    @click="handleClick"
    role="option"
    :aria-selected="false"
  >
    <slot />
  </div>
</template>
