import { reactive } from 'vue'
import { getCurrentUser, login as loginService } from '../services/auth'
import type { UserProfile } from '../types/user'

export const userStore = reactive({
  profile: null as UserProfile | null,
  loggedIn: false,
  loading: false,
  async hydrate() {
    if (this.profile) {
      return
    }

    const profile = await getCurrentUser()
    this.profile = profile
  },
  async login(phone: string, password: string) {
    this.loading = true

    try {
      const profile = await loginService(phone, password)
      this.profile = profile
      this.loggedIn = true
      return profile
    } finally {
      this.loading = false
    }
  },
  logout() {
    this.profile = null
    this.loggedIn = false
  }
})
