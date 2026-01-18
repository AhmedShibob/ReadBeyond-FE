<template>
  <footer class="w-full border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4">
        <!-- Copyright -->
        <p class="text-sm text-muted-foreground text-center">
          All rights reserved © ReadBeyond
        </p>
        
        <!-- GitHub Link -->
        <a
          href="https://github.com/AhmedShibob"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Visit Ahmed Shibob's GitHub profile"
        >
          <Icon name="lucide:github" class="w-5 h-5" aria-hidden="true" />
          <span class="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component - no logic needed
</script>
