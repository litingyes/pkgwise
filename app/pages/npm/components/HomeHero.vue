<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#app'

const q = ref('')
const router = useRouter()

function search() {
  const trimmed = q.value.trim()
  if (!trimmed)
    return
  router.push(`/npm/search?q=${encodeURIComponent(trimmed)}`)
}
</script>

<template>
  <UPageSection
    class="
      py-16
      sm:py-24
    "
  >
    <div class="mx-auto max-w-2xl text-center">
      <UIcon
        name="i-lucide-package-search" class="mx-auto size-12 text-primary"
      />
      <h1
        class="
          mt-6 text-4xl font-bold tracking-tight text-highlighted
          sm:text-5xl
        "
      >
        npm insights
      </h1>
      <p class="mt-4 text-lg text-muted">
        Explore, search, and understand the npm ecosystem faster.
      </p>

      <form class="mt-8 flex items-center gap-2" @submit.prevent="search">
        <UInput
          v-model="q"
          placeholder="Search packages..."
          size="xl"
          class="flex-1"
          :ui="{ base: 'h-12' }"
        />
        <UButton type="submit" size="xl" color="primary" icon="i-lucide-search" label="Search" />
      </form>
    </div>
  </UPageSection>
</template>
