<script setup lang="ts">
import { useNpmAuth } from '../../composables/useNpmAuth'

const { isConnected, username, openConnectDialog, disconnect } = useNpmAuth()

const items = [
  [
    {
      label: 'View profile',
      icon: 'i-lucide-user',
      to: username.value ? `https://www.npmjs.com/~${username.value}` : undefined,
      target: '_blank',
    },
    {
      label: 'Disconnect',
      icon: 'i-lucide-log-out',
      onClick: disconnect,
    },
  ],
]
</script>

<template>
  <div v-if="isConnected">
    <UDropdownMenu :items="items">
      <UButton
        :label="username ? `@${username}` : 'Connected'"
        color="success"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
      />
    </UDropdownMenu>
  </div>
  <UButton
    v-else
    label="Connect npm"
    color="primary"
    variant="subtle"
    icon="i-lucide-plug"
    data-testid="connect-npm"
    @click="openConnectDialog"
  />
</template>
