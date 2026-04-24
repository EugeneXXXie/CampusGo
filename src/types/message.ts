export type MessageType = 'signup' | 'review' | 'comment' | 'system'

export interface MessageItem {
  id: string
  type: MessageType
  title: string
  content: string
  isRead: boolean
  createdAt: string
  relatedActivityId?: string
}
