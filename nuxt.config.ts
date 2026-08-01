export default defineNuxtConfig({
  imports: {
    autoImport: false,
    scan: false,
  },

  pages: {
    pattern: ['**/*.vue', '!**/*/components/**.vue'],
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      standalone: false,
    },
  },
})
