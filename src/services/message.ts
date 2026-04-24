import { messageCollection } from '../mock/messages'

function wait(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getMessages() {
  await wait()
  return messageCollection.map((item) => ({ ...item }))
}

export async function markMessageRead(id: string) {
  await wait(60)
  const result = messageCollection.find((item) => item.id === id)

  if (!result) {
    return undefined
  }

  result.isRead = true
  return { ...result }
}
