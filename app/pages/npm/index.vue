<script setup lang="ts">
import { useSeoMeta } from '#app'
import EcosystemStats from './components/EcosystemStats.vue'
import HomeHero from './components/HomeHero.vue'
import PopularPackages from './components/PopularPackages.vue'

useSeoMeta({
  title: 'npm — pkgwise',
  description: 'Explore, search, and understand the npm ecosystem.',
})
</script>

<template>
  <div class="space-y-4">
    <HomeHero />
    <EcosystemStats />
    <PopularPackages />
  </div>
</template>
