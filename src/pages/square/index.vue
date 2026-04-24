<template>
  <view class="page-shell">
    <view class="page-hero">
      <view class="page-kicker">活动广场</view>
      <view class="page-title">把今天的空档塞满一点</view>
      <view class="page-subtitle">搜活动、按分类筛，先找到一个愿意出门的理由。</view>
    </view>

    <view class="section-card stack-md">
      <SearchBar v-model="keyword" placeholder="搜索球局、自习、探店..." />
      <view class="chip-row">
        <view
          class="chip"
          :class="{ 'chip--active': activeCategory === '' }"
          @click="setCategory('')"
        >
          全部
        </view>
        <view
          v-for="category in categories"
          :key="category"
          class="chip"
          :class="{ 'chip--active': activeCategory === category }"
          @click="setCategory(category)"
        >
          {{ category }}
        </view>
      </view>
      <view class="chip-row">
        <view
          v-for="item in statuses"
          :key="item.value"
          class="chip"
          :class="{ 'chip--active': activeStatus === item.value }"
          @click="setStatus(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <view v-if="squareList.length" class="stack-lg">
      <ActivityCard
        v-for="item in squareList"
        :key="item.id"
        :activity="item"
        @select="goDetail"
      />
    </view>
    <view v-else class="section-card">
      <EmptyState title="暂时没搜到合适的活动" />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, ref, watch } from 'vue'
import ActivityCard from '../../components/ActivityCard/index.vue'
import EmptyState from '../../components/EmptyState/index.vue'
import SearchBar from '../../components/SearchBar/index.vue'
import { activityStore } from '../../stores/activity'
import { ACTIVITY_CATEGORIES } from '../../utils/constants'

const categories = ACTIVITY_CATEGORIES
const statuses = [
  { label: '全部状态', value: 'all' as const },
  { label: '招募中', value: 'open' as const },
  { label: '已满员', value: 'full' as const },
  { label: '已结束', value: 'ended' as const }
]

const keyword = ref(activityStore.filters.keyword)
const activeCategory = ref(activityStore.filters.category)
const activeStatus = ref(activityStore.filters.status)
const squareList = computed(() => activityStore.squareList)

useDidShow(() => {
  keyword.value = activityStore.filters.keyword
  activeCategory.value = activityStore.filters.category
  activeStatus.value = activityStore.filters.status
  void activityStore.loadSquareActivities()
})

watch(keyword, (value) => {
  void activityStore.loadSquareActivities({
    keyword: value,
    category: activeCategory.value,
    status: activeStatus.value
  })
})

function setCategory(category: string) {
  activeCategory.value = category
  void activityStore.loadSquareActivities({
    keyword: keyword.value,
    category,
    status: activeStatus.value
  })
}

function setStatus(status: typeof activeStatus.value) {
  activeStatus.value = status
  void activityStore.loadSquareActivities({
    keyword: keyword.value,
    category: activeCategory.value,
    status
  })
}

function goDetail(id: string) {
  Taro.navigateTo({ url: `/pages/activity/detail/index?id=${id}` })
}
</script>
