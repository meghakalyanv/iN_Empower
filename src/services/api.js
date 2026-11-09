/**
 * API Service Layer — iN Empower
 *
 * Central switch for the backend. Reads VITE_API_PROVIDER from .env:
 *   - "supabase" → providers/supabase.js (REAL backend — use this for the live site)
 *   - "mock"     → providers/mock.js     (development only; nothing is sent anywhere)
 *
 * Every page talks to `api` only, so switching never requires page changes.
 */

import { mockProvider } from './providers/mock'
import { supabaseProvider } from './providers/supabase'

const providers = {
  mock: mockProvider,
  supabase: supabaseProvider,
}

const activeProvider = import.meta.env.VITE_API_PROVIDER || 'mock'

if (!providers[activeProvider]) {
  console.error(`[iN Empower] Unknown API provider: "${activeProvider}". Falling back to mock.`)
}

if (import.meta.env.PROD && activeProvider !== 'supabase') {
  console.warn(
    '[iN Empower] WARNING: this production build is using the MOCK backend. ' +
      'Customer enquiries will NOT be saved. Set VITE_API_PROVIDER=supabase in .env and rebuild.'
  )
}

export const apiProviderName = providers[activeProvider] ? activeProvider : 'mock'
export const api = providers[apiProviderName]
