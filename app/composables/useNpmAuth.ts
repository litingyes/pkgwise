import { useToast } from '@nuxt/ui/composables'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { summon, SummonDismissedError } from 'vue-summon'
import ConnectDialog from '../components/npm/ConnectDialog.vue'

const useState = createGlobalState(() => ({
  token: useLocalStorage('pkgwise:npm:token', ''),
  username: useLocalStorage('pkgwise:npm:username', ''),
  registry: useLocalStorage('pkgwise:npm:registry', 'https://registry.npmjs.org'),
}))

export function useNpmAuth() {
  const { token, username, registry } = useState()
  const toast = useToast()

  const isConnected = computed(() => !!token.value)

  async function openConnectDialog() {
    try {
      const result = await summon(ConnectDialog) as { token: string, username?: string } | undefined
      if (result?.token) {
        await connect(result.token, result.username)
      }
    }
    catch (error) {
      if (error instanceof SummonDismissedError)
        return
      throw error
    }
  }

  async function connect(newToken: string, newUsername?: string) {
    token.value = newToken
    if (newUsername) {
      username.value = newUsername
    }
    toast.add({
      title: 'npm connected',
      description: newUsername ? `Signed in as @${newUsername}` : 'Your token is saved locally.',
      color: 'success',
    })
  }

  function disconnect() {
    token.value = ''
    username.value = ''
    toast.add({
      title: 'Disconnected',
      description: 'Your npm token has been removed from this browser.',
      color: 'neutral',
    })
  }

  function captureHashToken() {
    if (!import.meta.client)
      return
    const hash = window.location.hash
    if (!hash)
      return

    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const t = params.get('token')
    if (!t)
      return

    const u = params.get('username') || ''
    connect(t, u)
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  return {
    token,
    username,
    registry,
    isConnected,
    openConnectDialog,
    connect,
    disconnect,
    captureHashToken,
  }
}
