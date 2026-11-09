/**
 * User Requests — what the logged-in customer sees on their dashboard.
 *
 * Reads from the active API provider (Supabase in production, browser
 * storage in dev mock mode). Every request type comes from the backend:
 *   'service'   — service enquiries (contact form / Get started / Chat Buddy)
 *   'apply-job' — part-time job applications
 *   'workshop'  — workshop registrations
 *   'post-job'  — jobs posted by the user
 */
import { api } from './api'
import { countRequests } from './providers/shared'

export const userRequests = {
  /** All of the current user's requests, newest first. */
  async getAll() {
    try {
      return await api.listMyRequests()
    } catch (err) {
      console.error('[iN Empower] Could not load requests:', err)
      return []
    }
  },

  async getByType(...types) {
    const all = await this.getAll()
    return all.filter((r) => types.includes(r.type))
  },

  countRequests,
}
