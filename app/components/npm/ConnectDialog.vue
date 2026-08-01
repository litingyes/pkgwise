<script setup lang="ts">
import { $fetch } from 'ofetch'
import { computed, onMounted, ref, watch } from 'vue'
import { useSummoned } from 'vue-summon'

const { visible, dismiss, resolve } = useSummoned<{ token: string, username: string }>()

const pm = ref('npm')
const registry = ref('https://registry.npmjs.org')
const showAdvanced = ref(false)
const token = ref('')
const showToken = ref(false)
const validating = ref(false)
const error = ref('')
const webUrl = ref('https://pkgwise.vercel.app')

const pmItems = [
  { label: 'npm', value: 'npm', icon: 'i-simple-icons-npm' },
  { label: 'pnpm', value: 'pnpm', icon: 'i-simple-icons-pnpm' },
  { label: 'yarn', value: 'yarn', icon: 'i-simple-icons-yarn' },
  { label: 'bun', value: 'bun', icon: 'i-simple-icons-bun' },
]

const commandPrefix = computed(() => {
  switch (pm.value) {
    case 'pnpm': return 'pnpm dlx'
    case 'yarn': return 'yarn dlx'
    case 'bun': return 'bunx'
    default: return 'npx'
  }
})

const command = computed(() => {
  let cmd = `${commandPrefix.value} pkgwise connect --web ${webUrl.value}`
  if (registry.value !== 'https://registry.npmjs.org') {
    cmd += ` --registry ${registry.value}`
  }
  return cmd
})

const open = ref(visible.value)
watch(() => visible.value, (v) => {
  open.value = v
})
watch(open, (v) => {
  visible.value = v
  if (!v)
    dismiss()
})

onMounted(() => {
  if (import.meta.client) {
    webUrl.value = window.location.origin
  }
})

async function copyCommand() {
  if (import.meta.client) {
    await navigator.clipboard.writeText(command.value)
  }
}

async function connectPasted() {
  const t = token.value.trim()
  if (!t)
    return

  validating.value = true
  error.value = ''

  try {
    const profile = await $fetch('/api/npm/whoami', {
      headers: { 'x-npm-token': t },
    })
    resolve({ token: t, username: profile.username || profile.name || '' })
  }
  catch (e) {
    error.value = (e as Error).message || 'Could not validate token. Please check it and try again.'
  }
  finally {
    validating.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Connect your npm account" description="Run the pkgwise CLI on your machine, or paste a read-only token manually.">
    <template #body>
      <div class="space-y-5">
        <div class="space-y-2">
          <label class="block text-sm font-medium">Run the connector</label>
          <div class="flex flex-wrap items-center gap-2">
            <div
              class="
                w-full rounded-md bg-muted px-3 py-2 font-mono text-sm break-all
                text-muted
              "
            >
              {{ command }}
            </div>
            <div class="flex items-center gap-2">
              <USelect v-model="pm" :items="pmItems" class="w-32" />
              <UButton icon="i-lucide-copy" color="neutral" variant="soft" @click="copyCommand" />
            </div>
          </div>
          <p class="text-xs text-muted">
            The CLI will open your browser back to this page and save the token automatically.
          </p>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium">Or paste a token manually</label>
          <UInput
            v-model="token"
            :type="showToken ? 'text' : 'password'"
            placeholder="npm_..."
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showToken ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                aria-label="Toggle token visibility"
                @click="showToken = !showToken"
              />
            </template>
          </UInput>
          <p class="text-xs text-muted">
            Create a read-only token on
            <ULink
              href="https://www.npmjs.com/settings/tokens" target="_blank" class="
                underline
              "
            >
              npmjs.com
            </ULink>
            for higher rate limits.
          </p>
        </div>

        <UCollapsible v-model:open="showAdvanced">
          <UButton variant="link" color="neutral" trailing-icon="i-lucide-chevron-down" size="sm">
            Advanced options
          </UButton>
          <template #content>
            <div class="space-y-3 pt-2">
              <div class="space-y-1">
                <label class="text-xs font-medium">Registry URL</label>
                <UInput v-model="registry" placeholder="https://registry.npmjs.org" />
              </div>
            </div>
          </template>
        </UCollapsible>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          icon="i-lucide-circle-alert"
          class="text-sm"
        />

        <UAlert
          color="warning"
          variant="soft"
          title="Trust this connection"
          icon="i-lucide-shield-alert"
          class="text-sm"
        >
          <template #description>
            This lets pkgwise call the npm registry on your behalf. Only connect sites you trust, and use a read-only token when possible.
          </template>
        </UAlert>
      </div>
    </template>

    <template #footer>
      <UButton color="neutral" variant="ghost" @click="dismiss">
        Cancel
      </UButton>
      <UButton color="primary" :disabled="!token" :loading="validating" @click="connectPasted">
        Connect
      </UButton>
    </template>
  </UModal>
</template>
