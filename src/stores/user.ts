import { reactive } from 'vue'
import { getCurrentUser, login as loginService } from '../services/auth'
import { clearAccessToken } from '../services/request'
import { activityStore } from './activity'
import { messageStore } from './message'
import type { UserProfile } from '../types/user'

export const userStore = reactive({
  profile: null as UserProfile | null,
  loggedIn: false,
  loading: false,
  hydrated: false,
  async hydrate() {
    if (this.hydrated) {
      return
    }

    this.hydrated = true

    try {
      const profile = await getCurrentUser()
      this.profile = profile
      this.loggedIn = Boolean(profile)
    } catch {
      this.profile = null
      this.loggedIn = false
    }
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
    clearAccessToken()
    this.profile = null
    this.loggedIn = false
    this.hydrated = true
    activityStore.reset()
    messageStore.state.reset()
  }
})
