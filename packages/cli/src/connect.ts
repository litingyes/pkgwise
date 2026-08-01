import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import open from 'open'

interface ConnectOptions {
  registry: string
  web: string
}

export async function connect(options: ConnectOptions) {
  const { registry, web } = options

  let token = readExistingToken(registry)

  if (token) {
    if (await validateToken(token, registry)) {
      console.log('Using existing npm token from ~/.npmrc')
    }
    else {
      token = undefined
    }
  }

  if (!token) {
    console.log('Opening browser to authorize pkgwise with npm...')
    const { loginWeb } = await import('npm-profile') as {
      loginWeb: (opener: (url: string) => Promise<void>, opts: { registry: string }) => Promise<{ token: string }>
    }

    const res = await loginWeb(async (url: string) => {
      await open(url)
      console.log('If your browser did not open, visit:')
      console.log(url)
    }, { registry })

    token = res.token
  }

  const profile = await fetchUser(token, registry)
  const username = profile.username || profile.name || ''

  const returnUrl = `${web}/npm#token=${encodeURIComponent(token)}${username ? `&username=${encodeURIComponent(username)}` : ''}`
  await open(returnUrl)

  console.log('\nAuthorized successfully!')
  console.log('Username:', username || 'unknown')
  console.log('Token:', token)
  console.log('\nYour browser should return to:')
  console.log(returnUrl)
  console.log('\nIf it did not open, paste the token manually in the pkgwise web app.')
}

function readExistingToken(registry: string): string | undefined {
  try {
    const rcPath = process.env.NPM_CONFIG_USERCONFIG || join(homedir(), '.npmrc')
    const content = readFileSync(rcPath, 'utf8')
    const host = registry.replace(/^https?:\/\//, '').replace(/\/+$/, '')
    const escaped = host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`//${escaped}/:_authToken=(.+)`)
    const match = content.match(regex)
    return match?.[1].trim()
  }
  catch {
    return undefined
  }
}

async function validateToken(token: string, registry: string): Promise<boolean> {
  try {
    const res = await fetch(`${registry}/-/npm/v1/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.ok
  }
  catch {
    return false
  }
}

async function fetchUser(token: string, registry: string): Promise<{ username?: string, name?: string }> {
  try {
    const res = await fetch(`${registry}/-/npm/v1/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      return {}
    }
    return await res.json() as { username?: string, name?: string }
  }
  catch {
    return {}
  }
}
