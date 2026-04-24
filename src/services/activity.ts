import { mapActivity } from './mappers'
import { request } from './request'
import type { ActivityQuery, PublishPayload, SignupResult } from '../types/activity'

const CATEGORY_ID_MAP: Record<string, number> = {
  羽毛球: 1,
  篮球: 2,
  自习: 3,
  桌游: 4,
  探店: 5,
  摄影: 6,
  骑行: 7,
  音乐: 8
}

interface BackendActivityItem {
  id: number
  title: string
  cover: string
  summary: string
  description: string
  activity_time: string
  location: string
  max_participants: number
  current_participants: number
  audit_required: boolean
  status: 'open' | 'full' | 'ended'
  contact_info: string
  is_favorite: boolean
  signup_status: 'none' | 'pending' | 'approved'
  owner: {
    id: number
    nickname: string
    avatar: string
    college: string
    bio: string
  }
  category: {
    id: number
    name: string
  }
  comments: Array<{
    id: number
    user_name: string
    content: string
    reply_to?: string | null
    created_at: string
  }>
}

interface ActivityListResponse {
  items: BackendActivityItem[]
  total: number
  page: number
  page_size: number
}

interface SignupResponse {
  status: 'none' | 'pending' | 'approved'
}

function buildQuery(params: ActivityQuery = {}) {
  return {
    keyword: params.keyword ?? '',
    category_id: params.category ? CATEGORY_ID_MAP[params.category] : undefined,
    status: params.status && params.status !== 'all' ? params.status : undefined,
    page: 1,
    page_size: 20
  }
}

export async function getRecommendedActivities() {
  const result = await request<ActivityListResponse>({
    url: '/api/activities',
    data: {
      page: 1,
      page_size: 4
    }
  })

  return result.items.map(mapActivity)
}

export async function getSquareActivities(params: ActivityQuery = {}) {
  const result = await request<ActivityListResponse>({
    url: '/api/activities',
    data: buildQuery(params)
  })

  return result.items.map(mapActivity)
}

export async function getActivityDetail(id: string) {
  try {
    const result = await request<BackendActivityItem>({
      url: `/api/activities/${id}`
    })
    return mapActivity(result)
  } catch (error) {
    if (error instanceof Error && error.message.includes('活动不存在')) {
      return undefined
    }

    throw error
  }
}

export async function toggleActivityFavorite(id: string) {
  const detail = await getActivityDetail(id)

  if (!detail) {
    return undefined
  }

  if (detail.isFavorite) {
    await request({
      url: `/api/activities/${id}/favorite`,
      method: 'DELETE'
    })
  } else {
    await request({
      url: `/api/activities/${id}/favorite`,
      method: 'POST'
    })
  }

  return getActivityDetail(id)
}

export async function signupActivity(id: string): Promise<SignupResult> {
  const result = await request<SignupResponse>({
    url: `/api/activities/${id}/signup`,
    method: 'POST'
  })

  return {
    success: true,
    message: result.status === 'pending' ? '报名已提交，等待发起人审核' : '报名成功，活动名额已为你锁定',
    signupStatus: result.status
  }
}

export async function publishActivity(payload: PublishPayload) {
  const categoryId = CATEGORY_ID_MAP[payload.category]

  if (!categoryId) {
    throw new Error('活动分类不存在')
  }

  const created = await request<BackendActivityItem>({
    url: '/api/activities',
    method: 'POST',
    data: {
      category_id: categoryId,
      title: payload.title,
      cover: '',
      description: payload.description,
      activity_time: payload.activityTime.replace(' ', 'T'),
      location: payload.location,
      max_participants: payload.maxParticipants,
      audit_required: payload.auditRequired,
      contact_info: payload.contactInfo
    }
  })

  return mapActivity(created)
}
