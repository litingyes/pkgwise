import type { H3Event } from 'h3'
import { getHeader } from 'h3'

export const NPM_REGISTRY = 'https://registry.npmjs.org'

export interface NpmSearchPackage {
  name: string
  scope: string
  version: string
  description?: string
  keywords?: string[]
  date?: string
  links?: {
    npm?: string
    homepage?: string
    repository?: string
    bugs?: string
  }
  author?: {
    name?: string
    email?: string
    username?: string
  }
  publisher?: {
    username?: string
    email?: string
  }
  maintainers?: Array<{
    username: string
    email: string
  }>
}

export interface NpmSearchObject {
  package: NpmSearchPackage
  score: {
    final: number
    detail: {
      quality: number
      popularity: number
      maintenance: number
    }
  }
  searchScore: number
  flags?: {
    insecure?: number
    deprecated?: string
  }
  downloads?: {
    monthly: number
    weekly: number
  }
}

export interface NpmSearchResponse {
  objects: NpmSearchObject[]
  total: number
  time: string
}

export async function fetchRegistry<T>(url: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`npm registry error ${res.status}: ${res.statusText}`)
  }

  return await res.json() as T
}

export function getNpmToken(event: H3Event): string | undefined {
  return getHeader(event, 'x-npm-token')
}
