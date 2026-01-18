<template>
  <div>
    <AppNavbar />
    <NuxtPage />
    <Toaster position="bottom-right" rich-colors :toast-options="{ duration: 4000 }" theme="dark" />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
</script>
