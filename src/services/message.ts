import { mapMessage } from './mappers'
import { getAccessToken, request } from './request'

interface BackendMessageItem {
  id: number
  type: 'signup' | 'review' | 'comment' | 'system'
  title: string
  content: string
  is_read: boolean
  related_id?: number | null
  created_at: string
}

export async function getMessages() {
  if (!getAccessToken()) {
    return []
  }

  const result = await request<BackendMessageItem[]>({ url: '/api/messages' })
  return result.map(mapMessage)
}

export async function markMessageRead(id: string) {
  const result = await request<BackendMessageItem | null>({
    url: `/api/messages/read/${id}`,
    method: 'POST'
  })

  return result ? mapMessage(result) : undefined
}
