<script setup lang="ts">
import { useFetch } from '#app'

const { data: stats, status } = await useFetch('/api/npm/stats')

function formatNumber(n?: number): string {
  if (n === undefined || n === null)
    return '-'
  return new Intl.NumberFormat('en-US').format(n)
}
</script>

<template>
  <UPageSection class="py-8">
    <div
      class="
        grid grid-cols-1 gap-4
        sm:grid-cols-3
      "
    >
      <UCard class="bg-elevated/50">
        <p class="text-sm text-muted">
          Indexed packages
        </p>
        <p class="mt-1 text-2xl font-semibold text-highlighted">
          {{ status === 'pending' ? '...' : formatNumber(stats?.totalPackages) }}
        </p>
        <p class="mt-1 text-xs text-muted">
          Approximate count from registry changes
        </p>
      </UCard>

      <UCard class="bg-elevated/50">
        <p class="text-sm text-muted">
          Weekly downloads
        </p>
        <p class="mt-1 text-2xl font-semibold text-highlighted">
          {{ status === 'pending' ? '...' : formatNumber(stats?.weeklyDownloads) }}
        </p>
        <p class="mt-1 text-xs text-muted">
          Across the top 20 popular packages
        </p>
      </UCard>

      <UCard class="bg-elevated/50">
        <p class="text-sm text-muted">
          Registry status
        </p>
        <p class="mt-1 text-2xl font-semibold text-success">
          Online
        </p>
        <p class="mt-1 text-xs text-muted">
          registry.npmjs.org
        </p>
      </UCard>
    </div>
  </UPageSection>
</template>
