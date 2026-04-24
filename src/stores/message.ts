import { computed, reactive } from 'vue'
import { getMessages, markMessageRead } from '../services/message'
import type { MessageItem } from '../types/message'

const state = reactive({
  list: [] as MessageItem[],
  async loadMessages() {
    this.list = await getMessages()
  },
  async readMessage(id: string) {
    const updated = await markMessageRead(id)

    if (!updated) {
      return
    }

    this.list = this.list.map((item) => item.id === id ? updated : item)
  }
})

export const messageStore = {
  state,
  unreadCount: computed(() => state.list.filter((item) => !item.isRead).length)
}
