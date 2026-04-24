import type { ActivityItem } from '../types/activity'
import { demoUser } from './user'

function createCover(title: string, accent: string, subAccent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${subAccent}" />
        </linearGradient>
      </defs>
      <rect width="960" height="640" fill="url(#bg)" rx="48" />
      <circle cx="800" cy="140" r="120" fill="rgba(255,255,255,0.18)" />
      <circle cx="180" cy="520" r="150" fill="rgba(255,255,255,0.12)" />
      <text x="72" y="260" font-size="72" fill="white" font-family="Arial, sans-serif" font-weight="700">${title}</text>
      <text x="72" y="330" font-size="28" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif">CampusGo 校园约搭局</text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const activityCollection: ActivityItem[] = [
  {
    id: 'activity-1',
    title: '南操夜跑搭子局',
    category: '骑行',
    cover: createCover('Night Run', '#ef4444', '#fb7185'),
    summary: '晚饭后 6 公里轻松跑，配速友好，新手也能跟上。',
    description: '集合后先热身，路线绕南操和图书馆外围，结束后一起喝冰豆浆。希望找到稳定运动搭子，跑步节奏轻松，不卷成绩。',
    activityTime: '2026-04-26 19:10',
    location: '南操场北门',
    maxParticipants: 8,
    currentParticipants: 5,
    auditRequired: false,
    status: 'open',
    contactInfo: '微信：campusgo-run',
    organizer: demoUser,
    isFavorite: true,
    signupStatus: 'none',
    tags: ['运动', '轻松局', '饭后消食'],
    comments: [
      { id: 'comment-1', userName: '阿泽', content: '我平时 6 分半配速，可以一起吗？', createdAt: '2026-04-24 13:20' },
      { id: 'comment-2', userName: '小白', content: '女生友好吗？', replyTo: '阿泽', createdAt: '2026-04-24 14:10' }
    ]
  },
  {
    id: 'activity-2',
    title: '图书馆四楼期中自习搭子',
    category: '自习',
    cover: createCover('Study Crew', '#0f766e', '#14b8a6'),
    summary: '备战期中考试，番茄钟模式，两小时专注复习互相监督。',
    description: '计划从下午两点到五点，大家自带学习任务和耳机。中途每 50 分钟休息 10 分钟，适合需要有人陪着进入状态的同学。',
    activityTime: '2026-04-27 14:00',
    location: '图书馆四楼东区',
    maxParticipants: 6,
    currentParticipants: 4,
    auditRequired: true,
    status: 'open',
    contactInfo: 'QQ：1254001',
    organizer: {
      ...demoUser,
      id: 'user-study',
      nickname: '夏知',
      avatar: createCover('X', '#1d4ed8', '#38bdf8'),
      bio: '四六级和专业课双线作战中，想找高质量自习搭子。'
    },
    isFavorite: false,
    signupStatus: 'pending',
    tags: ['期中', '番茄钟', '监督学习'],
    comments: [
      { id: 'comment-3', userName: '考研人', content: '会不会太吵？', createdAt: '2026-04-24 11:20' }
    ]
  },
  {
    id: 'activity-3',
    title: '周末羽毛球混双上分',
    category: '羽毛球',
    cover: createCover('Badminton', '#2563eb', '#60a5fa'),
    summary: '体育馆 3 号场地，强度中等，来 3 到 5 个人轮换打。',
    description: '适合有一点基础的同学，球拍可以互借。我们更偏娱乐局，但会认真打每一球，想找能长期约球的人。',
    activityTime: '2026-04-28 16:30',
    location: '校体育馆羽毛球馆',
    maxParticipants: 6,
    currentParticipants: 6,
    auditRequired: false,
    status: 'full',
    contactInfo: '微信：fly-smash',
    organizer: {
      ...demoUser,
      id: 'user-badminton',
      nickname: '周洲',
      avatar: createCover('Z', '#4f46e5', '#a78bfa'),
      bio: '球龄三年，喜欢打完球一起去吃烤冷面。'
    },
    isFavorite: false,
    signupStatus: 'approved',
    tags: ['混双', '校内场地', '可借球拍'],
    comments: [
      { id: 'comment-4', userName: 'Luna', content: '周末下午我能到，缺搭档吗？', createdAt: '2026-04-23 21:08' }
    ]
  },
  {
    id: 'activity-4',
    title: '傍晚校园扫街摄影互拍',
    category: '摄影',
    cover: createCover('Photo Walk', '#f59e0b', '#f97316'),
    summary: '趁日落前走一圈教学楼和湖边，互拍人像和环境照。',
    description: '欢迎手机党和相机党。想拍校内春末光影，互相帮忙看构图，也会顺便找几个适合出片的角落。',
    activityTime: '2026-04-29 17:40',
    location: '行政楼台阶集合',
    maxParticipants: 10,
    currentParticipants: 3,
    auditRequired: false,
    status: 'open',
    contactInfo: '微信：frames-on-campus',
    organizer: {
      ...demoUser,
      id: 'user-photo',
      nickname: '迟迟',
      avatar: createCover('C', '#f43f5e', '#fb7185'),
      bio: '偏爱傍晚自然光，拍照也拍胶片感。'
    },
    isFavorite: true,
    signupStatus: 'none',
    tags: ['互拍', '日落', '出片'],
    comments: [
      { id: 'comment-5', userName: '七七', content: '可以带朋友一起来吗？', createdAt: '2026-04-24 16:28' }
    ]
  },
  {
    id: 'activity-5',
    title: '宿舍楼下桌游破冰夜',
    category: '桌游',
    cover: createCover('Board Game', '#7c3aed', '#ec4899'),
    summary: '阿瓦隆和谁是卧底轮换，适合认识新朋友。',
    description: '这是轻社交局，主要目的是认识人。会准备简单零食，规则现场讲，不需要有经验。',
    activityTime: '2026-04-30 20:00',
    location: '二食堂旁活动室',
    maxParticipants: 12,
    currentParticipants: 7,
    auditRequired: true,
    status: 'open',
    contactInfo: 'QQ：7391002',
    organizer: {
      ...demoUser,
      id: 'user-board',
      nickname: '多比',
      avatar: createCover('D', '#0ea5e9', '#22d3ee'),
      bio: '桌游是最快的破冰器，希望你也能玩开心。'
    },
    isFavorite: false,
    signupStatus: 'none',
    tags: ['破冰', '社交', '零门槛'],
    comments: []
  }
]
