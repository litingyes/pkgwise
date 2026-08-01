import type { NpmSearchResponse } from '../../utils/npm'
import { defineEventHandler } from 'h3'
import { fetchRegistry } from '../../utils/npm'

interface RegistryInfo {
  last_seq: number
}

interface CacheEntry {
  data: {
    totalPackages: number
    weeklyDownloads: number
    registryOnline: boolean
  }
  expiry: number
}

let cache: CacheEntry | null = null

export default defineEventHandler(async () => {
  if (cache && Date.now() < cache.expiry) {
    return cache.data
  }

  const [info, popularRes] = await Promise.all([
    fetchRegistry<RegistryInfo>('https://replicate.npmjs.com/registry/_changes?limit=1&descending=true'),
    fetchRegistry<NpmSearchResponse>('https://registry.npmjs.org/-/v1/search?text=javascript&popularity=1.0&quality=0&maintenance=0&size=20'),
  ])

  const data = {
    totalPackages: info.last_seq,
    weeklyDownloads: popularRes.objects.reduce((sum, obj) => {
      return sum + (obj.downloads?.weekly || 0)
    }, 0),
    registryOnline: true,
  }

  cache = { data, expiry: Date.now() + 60 * 60 * 1000 }
  return data
})
