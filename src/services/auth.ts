import { mapUserProfile } from './mappers'
import { clearAccessToken, getAccessToken, request, setAccessToken } from './request'
import type { UserProfile } from '../types/user'

interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    phone: string
    nickname: string
    avatar: string
    college: string
    grade: string
    bio: string
  }
}

interface CurrentUserResponse {
  id: number
  phone: string
  nickname: string
  avatar: string
  college: string
  grade: string
  bio: string
}

export async function login(phone: string, password: string): Promise<UserProfile> {
  const result = await request<LoginResponse>({
    url: '/api/auth/login',
    method: 'POST',
    data: {
      phone,
      password
    }
  })

  setAccessToken(result.access_token)
  return mapUserProfile(result.user)
}

export async function getCurrentUser() {
  if (!getAccessToken()) {
    return null
  }

  try {
    const profile = await request<CurrentUserResponse>({ url: '/api/auth/me' })
    return mapUserProfile(profile)
  } catch (error) {
    clearAccessToken()
    throw error
  }
}
