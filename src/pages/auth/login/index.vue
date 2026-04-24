<template>
  <view class="page-shell">
    <PageHeader title="登录" fallback-url="/pages/profile/index" />
    <view class="page-hero">
      <view class="page-kicker">欢迎回来</view>
      <view class="page-title">先登录，再把活动生活拼完整</view>
      <view class="page-subtitle">演示账号已经帮你准备好了，直接体验核心链路就行。</view>
    </view>

    <view class="section-card stack-md">
      <view>
        <view class="cg-label">手机号</view>
        <input v-model="phone" class="cg-field" placeholder="18800001111" />
      </view>

      <view>
        <view class="cg-label">密码</view>
        <input v-model="password" class="cg-field" password placeholder="123456" />
      </view>

      <view class="login-hint">
        演示账号：18800001111 / 123456
      </view>

      <view class="cg-button" @click="handleLogin">
        {{ userStore.loading ? '登录中...' : '立即登录' }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import PageHeader from '../../../components/PageHeader/index.vue'
import { userStore } from '../../../stores/user'
import { DEMO_PASSWORD, DEMO_PHONE } from '../../../utils/constants'

const phone = ref(DEMO_PHONE)
const password = ref(DEMO_PASSWORD)

async function handleLogin() {
  try {
    await userStore.login(phone.value, password.value)
    Taro.showToast({ title: '登录成功', icon: 'success' })

    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack()
      return
    }

    Taro.switchTab({ url: '/pages/profile/index' })
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败'
    Taro.showToast({ title: message, icon: 'none' })
  }
}
</script>

<style lang="scss">
.login-hint {
  padding: 18px 22px;
  border-radius: 22px;
  background: rgba(14, 165, 233, 0.08);
  color: #0369a1;
  font-size: 22px;
}
</style>
