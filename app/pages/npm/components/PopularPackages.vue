<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '#app'
import { useNpmAuth } from '../../../composables/useNpmAuth'
import PackageCard from './PackageCard.vue'

const { token } = useNpmAuth()

const headers = computed(() => {
  return token.value ? { 'x-npm-token': token.value } : undefined
})

const { data, status, error } = await useFetch('/api/npm/search', {
  query: { sort: 'downloads', size: '12', text: 'javascript' },
  headers,
})
</script>

<template>
  <UPageSection class="py-8">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-highlighted">
        Popular packages
      </h2>
      <NuxtLink
        to="/npm/search?sort=downloads" class="
          text-sm text-primary
          hover:underline
        "
      >
        View all
      </NuxtLink>
    </div>

    <div
      v-if="status === 'pending'" class="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      <div
        v-for="i in 6" :key="i" class="
          h-32 animate-pulse rounded-lg bg-elevated
        "
      />
    </div>

    <div
      v-else-if="error" class="
        rounded-lg border border-error bg-error/10 p-4 text-sm text-error
      "
    >
      Could not load popular packages. Try connecting your npm account for higher rate limits.
    </div>

    <div
      v-else-if="data?.objects.length" class="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      <PackageCard v-for="obj in data.objects" :key="obj.package.name" :pkg="obj" />
    </div>
  </UPageSection>
</template>
