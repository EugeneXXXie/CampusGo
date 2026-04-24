export default {
  pages: [
    'pages/home/index',
    'pages/square/index',
    'pages/publish/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/auth/login/index',
    'pages/activity/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f8fafc',
    navigationBarTitleText: 'CampusGo',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#64748b',
    selectedColor: '#f97316',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/square/index',
        text: '广场',
        iconPath: './assets/tabbar/square.png',
        selectedIconPath: './assets/tabbar/square-active.png'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布',
        iconPath: './assets/tabbar/publish.png',
        selectedIconPath: './assets/tabbar/publish-active.png'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息',
        iconPath: './assets/tabbar/message.png',
        selectedIconPath: './assets/tabbar/message-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/profile.png',
        selectedIconPath: './assets/tabbar/profile-active.png'
      }
    ]
  }
}
