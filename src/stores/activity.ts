import { reactive } from 'vue'
import {
  getActivityDetail,
  getRecommendedActivities,
  getSquareActivities,
  publishActivity,
  signupActivity,
  toggleActivityFavorite
} from '../services/activity'
import type { ActivityItem, ActivityQuery, PublishPayload, SignupResult } from '../types/activity'

export const activityStore = reactive({
  recommended: [] as ActivityItem[],
  squareList: [] as ActivityItem[],
  currentActivity: null as ActivityItem | null,
  filters: {
    keyword: '',
    category: '',
    status: 'all' as ActivityQuery['status']
  },
  reset() {
    this.recommended = []
    this.squareList = []
    this.currentActivity = null
    this.filters.keyword = ''
    this.filters.category = ''
    this.filters.status = 'all'
  },
  async loadRecommended() {
    this.recommended = await getRecommendedActivities()
  },
  async loadSquareActivities(params?: ActivityQuery) {
    if (params) {
      this.filters.keyword = params.keyword ?? this.filters.keyword
      this.filters.category = params.category ?? this.filters.category
      this.filters.status = params.status ?? this.filters.status
    }

    this.squareList = await getSquareActivities(this.filters)
  },
  async loadDetail(id: string) {
    this.currentActivity = await getActivityDetail(id) ?? null
  },
  async toggleFavorite(id: string) {
    const updated = await toggleActivityFavorite(id)

    if (!updated) {
      return null
    }

    this.recommended = this.recommended.map((item) => item.id === id ? updated : item)
    this.squareList = this.squareList.map((item) => item.id === id ? updated : item)

    if (this.currentActivity?.id === id) {
      this.currentActivity = updated
    }

    return updated
  },
  async signupCurrentActivity(): Promise<SignupResult | null> {
    if (!this.currentActivity) {
      return null
    }

    const result = await signupActivity(this.currentActivity.id)
    await this.loadDetail(this.currentActivity.id)
    await this.loadSquareActivities()
    await this.loadRecommended()
    return result
  },
  async submitPublish(payload: PublishPayload) {
    const created = await publishActivity(payload)
    await this.loadRecommended()
    await this.loadSquareActivities()
    return created
  }
})
