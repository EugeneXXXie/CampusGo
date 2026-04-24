import { ACTIVITY_STATUS_TEXT } from './constants'
import type { ActivityItem, ActivityStatus } from '../types/activity'

export function formatActivityTime(value: string) {
  return value.replace('T', ' ').slice(0, 16)
}

export function formatParticipantText(activity: Pick<ActivityItem, 'currentParticipants' | 'maxParticipants'>) {
  return `${activity.currentParticipants}/${activity.maxParticipants} 人`
}

export function getActivityProgress(activity: Pick<ActivityItem, 'currentParticipants' | 'maxParticipants'>) {
  if (!activity.maxParticipants) {
    return 0
  }

  return Math.min(100, Math.round((activity.currentParticipants / activity.maxParticipants) * 100))
}

export function getStatusText(status: ActivityStatus) {
  return ACTIVITY_STATUS_TEXT[status]
}
