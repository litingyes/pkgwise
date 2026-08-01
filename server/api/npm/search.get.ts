import type { NpmSearchResponse } from '../../utils/npm'
import { defineEventHandler, getQuery } from 'h3'
import { fetchRegistry, getNpmToken } from '../../utils/npm'

interface SortWeights {
  quality?: number
  popularity?: number
  maintenance?: number
}

const SORT_WEIGHTS: Record<string, SortWeights> = {
  relevance: {},
  downloads: { quality: 0, popularity: 1, maintenance: 0 },
  quality: { quality: 1, popularity: 0, maintenance: 0 },
  maintenance: { quality: 0, popularity: 0, maintenance: 1 },
}

type SortOption = keyof typeof SORT_WEIGHTS

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const text = String(query.text || '')
  const page = Math.max(1, Number(query.page || 1))
  const rawSort = String(query.sort || 'relevance') as SortOption
  const sort = (rawSort in SORT_WEIGHTS) ? rawSort : 'relevance'
  const size = Math.min(50, Math.max(1, Number(query.size || 20)))
  const token = getNpmToken(event)

  if (!text) {
    return { objects: [], total: 0, time: new Date().toISOString() }
  }

  const weights: SortWeights = SORT_WEIGHTS[sort] || {}

  const params = new URLSearchParams()
  params.set('text', text)
  params.set('size', String(size))
  params.set('from', String((page - 1) * size))

  if (weights.quality !== undefined) {
    params.set('quality', String(weights.quality))
  }
  if (weights.popularity !== undefined) {
    params.set('popularity', String(weights.popularity))
  }
  if (weights.maintenance !== undefined) {
    params.set('maintenance', String(weights.maintenance))
  }

  const url = `https://registry.npmjs.org/-/v1/search?${params.toString()}`

  return await fetchRegistry<NpmSearchResponse>(url, token)
})
