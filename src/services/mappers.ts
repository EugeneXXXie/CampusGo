import { activityCollection } from '../mock/activities'
import { demoUser } from '../mock/user'
import type { ActivityComment, ActivityItem, ActivityStatus, SignupStatus } from '../types/activity'
import type { MessageItem, MessageType } from '../types/message'
import type { UserProfile } from '../types/user'

interface BackendUserSummary {
  id: number
  nickname: string
  avatar: string
  college: string
  grade?: string
  bio: string
}

interface BackendUserProfile extends BackendUserSummary {
  phone: string
}

interface BackendActivityComment {
  id: number
  user_name: string
  content: string
  reply_to?: string | null
  created_at: string
}

interface BackendActivityCategory {
  id: number
  name: string
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
  status: ActivityStatus
  contact_info: string
  is_favorite: boolean
  signup_status: SignupStatus
  owner: BackendUserSummary
  category: BackendActivityCategory
  comments: BackendActivityComment[]
}

interface BackendMessageItem {
  id: number
  type: MessageType
  title: string
  content: string
  is_read: boolean
  related_id?: number | null
  created_at: string
}

function formatDateTime(value: string) {
  if (!value) {
    return ''
  }

  return value.replace('T', ' ').slice(0, 16)
}

function fallbackCover(id: number) {
  const index = Math.abs(id - 1) % activityCollection.length
  return activityCollection[index]?.cover ?? activityCollection[0].cover
}

function mapComment(comment: BackendActivityComment): ActivityComment {
  return {
    id: String(comment.id),
    userName: comment.user_name,
    content: comment.content,
    replyTo: comment.reply_to ?? undefined,
    createdAt: formatDateTime(comment.created_at)
  }
}

export function mapUserProfile(user: BackendUserProfile): UserProfile {
  return {
    id: String(user.id),
    nickname: user.nickname,
    avatar: user.avatar || demoUser.avatar,
    college: user.college,
    grade: user.grade ?? '',
    bio: user.bio,
    phone: user.phone
  }
}

export function mapActivity(activity: BackendActivityItem): ActivityItem {
  const tags = [
    activity.category.name,
    activity.audit_required ? '需审核' : '直接报名',
    activity.status === 'full' ? '已满员' : activity.status === 'ended' ? '已结束' : '招募中'
  ]

  return {
    id: String(activity.id),
    title: activity.title,
    category: activity.category.name,
    cover: activity.cover || fallbackCover(activity.id),
    summary: activity.summary,
    description: activity.description,
    activityTime: formatDateTime(activity.activity_time),
    location: activity.location,
    maxParticipants: activity.max_participants,
    currentParticipants: activity.current_participants,
    auditRequired: activity.audit_required,
    status: activity.status,
    contactInfo: activity.contact_info,
    organizer: {
      id: String(activity.owner.id),
      nickname: activity.owner.nickname,
      avatar: activity.owner.avatar || demoUser.avatar,
      college: activity.owner.college,
      bio: activity.owner.bio
    },
    isFavorite: activity.is_favorite,
    signupStatus: activity.signup_status,
    tags,
    comments: activity.comments.map(mapComment)
  }
}

export function mapMessage(item: BackendMessageItem): MessageItem {
  return {
    id: String(item.id),
    type: item.type,
    title: item.title,
    content: item.content,
    isRead: item.is_read,
    createdAt: formatDateTime(item.created_at),
    relatedActivityId: item.related_id ? String(item.related_id) : undefined
  }
}
