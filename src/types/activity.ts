export type ActivityStatus = 'open' | 'full' | 'ended'
export type SignupStatus = 'none' | 'pending' | 'approved'

export interface OrganizerProfile {
  id: string
  nickname: string
  avatar: string
  college: string
  bio: string
}

export interface ActivityComment {
  id: string
  userName: string
  content: string
  replyTo?: string
  createdAt: string
}

export interface ActivityItem {
  id: string
  title: string
  category: string
  cover: string
  summary: string
  description: string
  activityTime: string
  location: string
  maxParticipants: number
  currentParticipants: number
  auditRequired: boolean
  status: ActivityStatus
  contactInfo: string
  organizer: OrganizerProfile
  isFavorite: boolean
  signupStatus: SignupStatus
  tags: string[]
  comments: ActivityComment[]
}

export interface ActivityQuery {
  keyword?: string
  category?: string
  status?: 'all' | ActivityStatus
}

export interface PublishPayload {
  title: string
  category: string
  activityTime: string
  location: string
  maxParticipants: number
  auditRequired: boolean
  contactInfo: string
  description: string
}

export interface SignupResult {
  success: boolean
  message: string
  signupStatus: SignupStatus
}
