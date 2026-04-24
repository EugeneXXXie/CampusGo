import Taro from '@tarojs/taro'

const API_BASE_URL = 'http://127.0.0.1:8000'
const ACCESS_TOKEN_KEY = 'campusgo_access_token'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: Record<string, unknown> | undefined
}

function extractErrorMessage(payload: unknown, fallback = '请求失败') {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  if ('message' in payload && typeof payload.message === 'string' && payload.message) {
    return payload.message
  }

  if ('detail' in payload && typeof payload.detail === 'string' && payload.detail) {
    return payload.detail
  }

  return fallback
}

export function getAccessToken() {
  return Taro.getStorageSync<string>(ACCESS_TOKEN_KEY) || ''
}

export function setAccessToken(token: string) {
  Taro.setStorageSync(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  Taro.removeStorageSync(ACCESS_TOKEN_KEY)
}

export async function request<T>({ url, method = 'GET', data }: RequestOptions): Promise<T> {
  try {
    const token = getAccessToken()
    const response = await Taro.request<ApiResponse<T> | { detail?: string }>({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      timeout: 10000,
      header: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    const payload = response.data

    if (response.statusCode >= 400) {
      if (response.statusCode === 401) {
        clearAccessToken()
      }

      throw new Error(extractErrorMessage(payload))
    }

    if (!payload || typeof payload !== 'object' || !('code' in payload) || payload.code !== 0) {
      throw new Error(extractErrorMessage(payload))
    }

    return payload.data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('网络请求失败，请确认后端已启动')
  }
}
