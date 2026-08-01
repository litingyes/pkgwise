<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFetch, useRoute, useRouter, useSeoMeta } from '#app'
import { useNpmAuth } from '../../../composables/useNpmAuth'
import PackageCard from '../components/PackageCard.vue'

const route = useRoute()
const router = useRouter()
const { openConnectDialog, token } = useNpmAuth()

const q = computed(() => String(route.query.q || ''))
const page = computed(() => Math.max(1, Number(route.query.page || 1)))
const sort = computed(() => String(route.query.sort || 'relevance'))

const inputQ = ref(q.value)

watch(q, (value) => {
  inputQ.value = value
})

const sortItems = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Downloads', value: 'downloads' },
  { label: 'Quality', value: 'quality' },
  { label: 'Maintenance', value: 'maintenance' },
]

const queryParams = computed(() => ({
  text: q.value,
  page: page.value,
  sort: sort.value,
  size: 20,
}))

const headers = computed(() => {
  return token.value ? { 'x-npm-token': token.value } : undefined
})

const { data, status, error } = await useFetch('/api/npm/search', {
  query: queryParams,
  headers,
})

const totalPages = computed(() => {
  if (!data.value)
    return 0
  return Math.ceil(data.value.total / 20)
})

const isRateLimited = computed(() => {
  if (!error.value)
    return false
  const statusCode = (error.value as any).statusCode || (error.value as any).status
  return statusCode === 429
})

function search() {
  const trimmed = inputQ.value.trim()
  if (!trimmed)
    return
  router.push({ query: { q: trimmed, sort: sort.value, page: '1' } })
}

function updateSort(value: string) {
  router.push({ query: { q: q.value, sort: value, page: '1' } })
}

function updatePage(value: number) {
  router.push({ query: { q: q.value, sort: sort.value, page: String(value) } })
}

useSeoMeta({
  title: q.value ? `${q.value} — npm search — pkgwise` : 'npm search — pkgwise',
  description: 'Search packages on the npm registry.',
})
</script>

<template>
  <UPageSection class="py-8">
    <div class="mx-auto max-w-4xl">
      <form class="flex items-center gap-2" @submit.prevent="search">
        <UInput
          v-model="inputQ"
          placeholder="Search packages..."
          size="xl"
          class="flex-1"
          :ui="{ base: 'h-12' }"
        />
        <UButton type="submit" size="xl" color="primary" icon="i-lucide-search" label="Search" />
      </form>

      <div
        class="
          mt-4 flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div v-if="data" class="text-sm text-muted">
          {{ new Intl.NumberFormat('en-US').format(data.total) }} results
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted">Sort by</span>
          <USelect
            :model-value="sort"
            :items="sortItems"
            class="w-40"
            @update:model-value="updateSort"
          />
        </div>
      </div>

      <UAlert
        v-if="isRateLimited"
        color="warning"
        title="Rate limit reached"
        icon="i-lucide-triangle-alert"
        class="mt-4"
      >
        <template #description>
          <div class="flex items-center gap-2">
            <span>Anonymous npm searches are limited. Connect your npm account to continue.</span>
            <UButton size="xs" color="primary" variant="soft" @click="openConnectDialog">
              Connect npm
            </UButton>
          </div>
        </template>
      </UAlert>

      <div
        v-if="status === 'pending'" class="
          mt-6 grid grid-cols-1 gap-4
          sm:grid-cols-2
        "
      >
        <div
          v-for="i in 6" :key="i" class="
            h-32 animate-pulse rounded-lg bg-elevated
          "
        />
      </div>

      <div v-else-if="!q" class="mt-12 text-center">
        <UIcon name="i-lucide-search" class="mx-auto size-10 text-muted" />
        <p class="mt-4 text-muted">
          Enter a search term to find packages.
        </p>
      </div>

      <div
        v-else-if="data?.objects.length" class="
          mt-6 grid grid-cols-1 gap-4
          sm:grid-cols-2
        "
      >
        <PackageCard v-for="obj in data.objects" :key="obj.package.name" :pkg="obj" />
      </div>

      <div v-else-if="data" class="mt-12 text-center">
        <UIcon name="i-lucide-package-x" class="mx-auto size-10 text-muted" />
        <p class="mt-4 text-muted">
          No packages found for "{{ q }}".
        </p>
      </div>

      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <UPagination
          :model-value="page"
          :total="totalPages"
          :sibling-count="1"
          show-edges
          @update:model-value="updatePage"
        />
      </div>
    </div>
  </UPageSection>
</template>
