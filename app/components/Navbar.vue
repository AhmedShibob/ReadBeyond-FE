<template>
  <nav
    class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Icon name="lucide:book-open" class="w-6 h-6" aria-hidden="true" />
          </div>
          <span class="text-xl font-bold text-foreground hidden sm:inline">ReadBeyond</span>
        </div>

        <!-- Theme Toggle -->
        <button
          type="button"
          class="flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          :aria-label="displayIsDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="displayIsDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <ClientOnly>
            <Icon
              v-if="displayIsDark"
              name="lucide:sun"
              class="w-5 h-5"
              aria-hidden="true"
            />
            <Icon
              v-else
              name="lucide:moon"
              class="w-5 h-5"
              aria-hidden="true"
            />
            <template #fallback>
              <Icon
                name="lucide:moon"
                class="w-5 h-5"
                aria-hidden="true"
              />
            </template>
          </ClientOnly>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

// Ensure consistent initial state for SSR
// Default to dark mode (matches head.ts)
const displayIsDark = computed(() => {
  // On server, always return true (dark mode default)
  // On client, use the actual theme state
  return import.meta.client ? isDark.value : true
})
</script>
