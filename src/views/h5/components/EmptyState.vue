<template>
  <div class="empty-state">
    <slot name="icon">
      <svg class="empty-icon" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#F0F4F8"/>
        <path d="M45 50h30M45 60h20M45 70h25" stroke="#CBD5E0" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </slot>
    <p class="empty-text">{{ text }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '暂无数据'
  }
})
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  .empty-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
  }

  .empty-text {
    margin: 0 0 16px 0;
    font-size: 15px;
    color: #8492a6;
  }

  // 手机适配
  @media (max-width: 480px) {
    padding: 40px 20px;

    .empty-icon {
      width: 80px;
      height: 80px;
    }

    .empty-text {
      font-size: 14px;
    }
  }
}
</style>

