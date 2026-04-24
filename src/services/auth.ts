import { DEMO_PASSWORD, DEMO_PHONE } from '../utils/constants'
import { demoUser } from '../mock/user'
import type { UserProfile } from '../types/user'

function wait(ms = 120) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function login(phone: string, password: string): Promise<UserProfile> {
  await wait()

  if (phone !== DEMO_PHONE || password !== DEMO_PASSWORD) {
    throw new Error('演示账号为 18800001111 / 123456')
  }

  return { ...demoUser }
}

export async function getCurrentUser() {
  await wait(60)
  return { ...demoUser }
}
