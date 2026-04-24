import type { UserProfile } from '../types/user'

export const demoUser: UserProfile = {
  id: 'user-demo',
  nickname: '林小跃',
  avatar: createAvatar('林', '#f97316'),
  college: '信息工程学院',
  grade: '大三',
  bio: '周末球局、自习搭子、摄影扫街都能约。',
  phone: '18800001111'
}

function createAvatar(label: string, background: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="28" fill="${background}" />
      <text x="60" y="72" text-anchor="middle" font-size="48" fill="white" font-family="Arial, sans-serif">${label}</text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
