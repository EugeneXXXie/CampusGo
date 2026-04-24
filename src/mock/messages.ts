import type { MessageItem } from '../types/message'

export const messageCollection: MessageItem[] = [
  {
    id: 'message-1',
    type: 'signup',
    title: '有人报名了你的活动',
    content: '阿泽 报名了「南操夜跑搭子局」，记得去看看。',
    isRead: false,
    createdAt: '2026-04-24 18:10',
    relatedActivityId: 'activity-1'
  },
  {
    id: 'message-2',
    type: 'review',
    title: '报名审核通过',
    content: '你报名的「周末羽毛球混双上分」已经通过审核。',
    isRead: false,
    createdAt: '2026-04-24 15:02',
    relatedActivityId: 'activity-3'
  },
  {
    id: 'message-3',
    type: 'comment',
    title: '有人回复了你的评论',
    content: '小白 回复了你在「南操夜跑搭子局」下的留言。',
    isRead: true,
    createdAt: '2026-04-24 14:10',
    relatedActivityId: 'activity-1'
  },
  {
    id: 'message-4',
    type: 'system',
    title: 'CampusGo MVP 已上线',
    content: '这是一版面向课程展示的前端原型，祝你验收顺利。',
    isRead: true,
    createdAt: '2026-04-24 09:30'
  }
]
