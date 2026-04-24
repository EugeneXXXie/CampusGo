<template>
  <view class="page-shell">
    <view class="page-hero">
      <view class="page-kicker">发起一个新活动</view>
      <view class="page-title">把“想约人”变成一个可报名的局</view>
      <view class="page-subtitle">这版先做最核心字段，够你交作业，也够老师看出业务闭环。</view>
    </view>

    <view class="section-card stack-md">
      <view>
        <view class="cg-label">活动标题</view>
        <input v-model="form.title" class="cg-field" placeholder="比如：周五羽毛球双打局" />
      </view>

      <view>
        <view class="cg-label">活动分类</view>
        <view class="chip-row">
          <view
            v-for="category in categories"
            :key="category"
            class="chip"
            :class="{ 'chip--active': form.category === category }"
            @click="form.category = category"
          >
            {{ category }}
          </view>
        </view>
      </view>

      <view>
        <view class="cg-label">活动时间</view>
        <input v-model="form.activityTime" class="cg-field" placeholder="2026-05-01 18:30" />
      </view>

      <view>
        <view class="cg-label">活动地点</view>
        <input v-model="form.location" class="cg-field" placeholder="例如：校体育馆 3 号场地" />
      </view>

      <view class="cg-grid">
        <view>
          <view class="cg-label">人数上限</view>
          <input v-model="form.maxParticipants" class="cg-field" type="number" placeholder="8" />
        </view>
        <view>
          <view class="cg-label">联系方式</view>
          <input v-model="form.contactInfo" class="cg-field" placeholder="微信 / QQ" />
        </view>
      </view>

      <view class="publish-switch">
        <view>
          <view class="cg-label">是否需要审核</view>
          <view class="cg-muted">开启后，报名会先进入待审核状态。</view>
        </view>
        <switch :checked="form.auditRequired" color="#f97316" @change="handleAuditChange" />
      </view>

      <view>
        <view class="cg-label">活动描述</view>
        <textarea
          v-model="form.description"
          class="cg-field cg-textarea"
          maxlength="240"
          placeholder="写清楚活动节奏、适合谁参加、需要准备什么。"
        />
      </view>

      <view class="cg-button" @click="submitForm">立即发布</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { reactive } from 'vue'
import { activityStore } from '../../stores/activity'
import { userStore } from '../../stores/user'
import { ACTIVITY_CATEGORIES } from '../../utils/constants'

const categories = ACTIVITY_CATEGORIES
const form = reactive({
  title: '',
  category: categories[0],
  activityTime: '',
  location: '',
  maxParticipants: '6',
  auditRequired: false,
  contactInfo: '',
  description: ''
})

function handleAuditChange(event: { detail: { value: boolean } }) {
  form.auditRequired = event.detail.value
}

async function submitForm() {
  if (!userStore.loggedIn) {
    Taro.navigateTo({ url: '/pages/auth/login/index' })
    return
  }

  if (!form.title || !form.activityTime || !form.location || !form.contactInfo || !form.description) {
    Taro.showToast({ title: '先把关键信息填完整', icon: 'none' })
    return
  }

  const maxParticipants = Number(form.maxParticipants)

  if (!Number.isFinite(maxParticipants) || maxParticipants <= 1) {
    Taro.showToast({ title: '人数上限至少填 2', icon: 'none' })
    return
  }

  try {
    await activityStore.submitPublish({
      title: form.title,
      category: form.category,
      activityTime: form.activityTime,
      location: form.location,
      maxParticipants,
      auditRequired: form.auditRequired,
      contactInfo: form.contactInfo,
      description: form.description
    })

    Taro.showToast({ title: '活动已发布', icon: 'success' })
    Object.assign(form, {
      title: '',
      category: categories[0],
      activityTime: '',
      location: '',
      maxParticipants: '6',
      auditRequired: false,
      contactInfo: '',
      description: ''
    })
    Taro.switchTab({ url: '/pages/square/index' })
  } catch (error) {
    const message = error instanceof Error ? error.message : '发布失败'
    Taro.showToast({ title: message, icon: 'none' })
  }
}
</script>

<style lang="scss">
.publish-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 0 4px;
}
</style>
