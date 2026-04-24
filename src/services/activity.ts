import { activityCollection } from '../mock/activities'
import { demoUser } from '../mock/user'
import type { ActivityItem, ActivityQuery, PublishPayload, SignupResult } from '../types/activity'

function wait(ms = 120) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function matchKeyword(activity: ActivityItem, keyword: string) {
  const source = [
    activity.title,
    activity.summary,
    activity.location,
    activity.category,
    activity.tags.join(' ')
  ].join(' ').toLowerCase()

  return source.includes(keyword.toLowerCase())
}

export async function getRecommendedActivities() {
  await wait()
  return activityCollection.slice(0, 4).map((item) => ({ ...item }))
}

export async function getSquareActivities(params: ActivityQuery = {}) {
  await wait()

  const { keyword = '', category = '', status = 'all' } = params

  return activityCollection
    .filter((item) => !keyword || matchKeyword(item, keyword))
    .filter((item) => !category || item.category === category)
    .filter((item) => status === 'all' || item.status === status)
    .map((item) => ({ ...item }))
}

export async function getActivityDetail(id: string) {
  await wait()
  const result = activityCollection.find((item) => item.id === id)
  return result ? { ...result } : undefined
}

export async function toggleActivityFavorite(id: string) {
  await wait(80)
  const result = activityCollection.find((item) => item.id === id)

  if (!result) {
    return undefined
  }

  result.isFavorite = !result.isFavorite
  return { ...result }
}

export async function signupActivity(id: string): Promise<SignupResult> {
  await wait(100)
  const result = activityCollection.find((item) => item.id === id)

  if (!result) {
    return { success: false, message: '活动不存在', signupStatus: 'none' }
  }

  if (result.status === 'ended') {
    return { success: false, message: '活动已结束，不能报名', signupStatus: result.signupStatus }
  }

  if (result.currentParticipants >= result.maxParticipants) {
    result.status = 'full'
    return { success: false, message: '人数已满，下次早点来', signupStatus: result.signupStatus }
  }

  result.signupStatus = result.auditRequired ? 'pending' : 'approved'
  result.currentParticipants += 1
  if (result.currentParticipants >= result.maxParticipants) {
    result.status = 'full'
  }

  return {
    success: true,
    message: result.auditRequired ? '报名已提交，等待发起人审核' : '报名成功，活动名额已为你锁定',
    signupStatus: result.signupStatus
  }
}

export async function publishActivity(payload: PublishPayload) {
  await wait(140)

  const created: ActivityItem = {
    id: `activity-${Date.now()}`,
    title: payload.title,
    category: payload.category,
    cover: activityCollection[0].cover,
    summary: payload.description.slice(0, 34),
    description: payload.description,
    activityTime: payload.activityTime,
    location: payload.location,
    maxParticipants: payload.maxParticipants,
    currentParticipants: 1,
    auditRequired: payload.auditRequired,
    status: 'open',
    contactInfo: payload.contactInfo,
    organizer: demoUser,
    isFavorite: false,
    signupStatus: 'approved',
    tags: [payload.category, payload.auditRequired ? '需审核' : '直接报名'],
    comments: []
  }

  activityCollection.unshift(created)
  return { ...created }
}
