import type { ActivityStatus } from '../types/activity'
import type { MessageType } from '../types/message'

export const APP_NAME = '约搭 CampusGo'
export const DEMO_PHONE = '18800001111'
export const DEMO_PASSWORD = '123456'

export const ACTIVITY_CATEGORIES = [
  '羽毛球',
  '篮球',
  '自习',
  '桌游',
  '探店',
  '摄影',
  '骑行',
  '音乐'
]

export const ACTIVITY_STATUS_TEXT: Record<ActivityStatus, string> = {
  open: '招募中',
  full: '已满员',
  ended: '已结束'
}

export const MESSAGE_TYPE_TEXT: Record<MessageType, string> = {
  signup: '报名通知',
  review: '审核结果',
  comment: '评论回复',
  system: '系统消息'
}

export const PROFILE_SHORTCUTS = [
  { key: 'published', title: '我的发布', hint: '管理你发起的活动' },
  { key: 'signups', title: '我的报名', hint: '查看当前参与进度' },
  { key: 'favorites', title: '我的收藏', hint: '保留感兴趣的活动' },
  { key: 'profile', title: '资料维护', hint: '更新昵称和简介' }
]
