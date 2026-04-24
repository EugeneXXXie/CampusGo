<template>
  <view class="search-bar" :class="{ 'search-bar--disabled': disabled }" @click="handleContainerClick">
    <text class="search-bar__icon">⌕</text>
    <input
      class="search-bar__input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
    />
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
}>(), {
  placeholder: '搜索活动',
  disabled: false
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'focus-proxy'): void
}>()

function handleInput(event: { detail: { value: string } }) {
  emit('update:modelValue', event.detail.value)
}

function handleContainerClick() {
  if (props.disabled) {
    emit('focus-proxy')
  }
}
</script>

<style lang="scss">
.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border: 2px solid rgba(15, 23, 42, 0.08);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);

  &--disabled {
    opacity: 0.9;
  }

  &__icon {
    color: #475569;
    font-size: 28px;
  }

  &__input {
    flex: 1;
    min-width: 0;
    color: #0f172a;
    font-size: 28px;
  }
}
</style>
