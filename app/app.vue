<script setup>
import { onMounted } from 'vue'
import { SummonHost } from 'vue-summon'
import { useHead, useSeoMeta } from '#app'
import NpmConnectButton from './components/npm/NpmConnectButton.vue'
import { useNpmAuth } from './composables/useNpmAuth'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'pkgwise'
const description = 'Intelligent insights for the software package ecosystem.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary',
})

const { captureHashToken } = useNpmAuth()

onMounted(() => {
  captureHashToken()
})
</script>

<template>
  <UApp>
    <SummonHost />

    <UHeader>
      <template #left>
        <NuxtLink to="/npm" class="flex items-center gap-2">
          <Logo class="h-6 w-auto" />
          <span class="text-lg font-bold">pkgwise</span>
        </NuxtLink>
      </template>

      <template #right>
        <NpmConnectButton />

        <UColorModeButton />

        <UButton
          to="https://github.com/liting/pkgwise"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          pkgwise — Intelligent insights for the package ecosystem
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
