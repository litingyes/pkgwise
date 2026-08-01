import antfu from '@antfu/eslint-config'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    pnpm: false,
  }),
  {
    extends: [
      eslintPluginBetterTailwindcss.configs.recommended,
    ],
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
      },
    },
    files: ['**/*.vue'],
  },
)
