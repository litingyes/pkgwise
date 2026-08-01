import { createError, defineEventHandler } from 'h3'
import { fetchRegistry, getNpmToken } from '../../utils/npm'

interface NpmProfile {
  username?: string
  name?: string
  email?: string
}

export default defineEventHandler(async (event) => {
  const token = getNpmToken(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing npm token' })
  }

  return await fetchRegistry<NpmProfile>('https://registry.npmjs.org/-/npm/v1/user', token)
})
