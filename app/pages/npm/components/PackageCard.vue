<script setup lang="ts">
import type { NpmSearchObject } from '../../../../server/utils/npm'
import { useTimeAgo } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  pkg: NpmSearchObject
}>()

const pkgName = computed(() => props.pkg.package.name)
const npmUrl = computed(() => props.pkg.package.links?.npm || `https://www.npmjs.com/package/${pkgName.value}`)
const downloads = computed(() => props.pkg.downloads?.weekly ?? 0)
const keywords = computed(() => (props.pkg.package.keywords || []).slice(0, 5))

const updatedAt = computed(() => {
  return props.pkg.package.date ? new Date(props.pkg.package.date) : undefined
})
const timeAgo = useTimeAgo(() => updatedAt.value ?? new Date())

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}
</script>

<template>
  <NuxtLink
    :to="npmUrl"
    target="_blank"
    class="
      group block rounded-lg border border-default bg-default p-4
      transition-colors
      hover:bg-elevated/50
    "
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3
          class="
            truncate font-semibold text-highlighted transition-colors
            group-hover:text-primary
          "
        >
          {{ pkgName }}
        </h3>
        <p class="line-clamp-2 text-sm text-muted">
          {{ pkg.package.description || 'No description' }}
        </p>
      </div>
      <UBadge color="neutral" variant="subtle" class="shrink-0">
        {{ pkg.package.version }}
      </UBadge>
    </div>

    <div v-if="keywords.length" class="mt-3 flex flex-wrap gap-1.5">
      <UBadge v-for="kw in keywords" :key="kw" color="neutral" variant="outline" size="sm">
        {{ kw }}
      </UBadge>
    </div>

    <div class="mt-4 flex items-center gap-4 text-xs text-muted">
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-download" />
        {{ formatNumber(downloads) }} weekly
      </span>
      <span v-if="timeAgo" class="flex items-center gap-1">
        <UIcon name="i-lucide-clock" />
        {{ timeAgo }}
      </span>
    </div>
  </NuxtLink>
</template>
