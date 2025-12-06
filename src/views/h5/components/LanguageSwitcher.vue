<template>
  <div class="language-switcher" :class="variant">
    <button 
      :class="['lang-btn', { active: modelValue === 'zh' }]" 
      @click="$emit('update:modelValue', 'zh')"
    >
      中文
    </button>
    <button 
      :class="['lang-btn', { active: modelValue === 'en' }]" 
      @click="$emit('update:modelValue', 'en')"
    >
      En
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'zh'
  },
  variant: {
    type: String,
    default: 'default', // default | floating
    validator: (value) => ['default', 'floating'].includes(value)
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.language-switcher {
  display: flex;
  border-radius: 10px;
  overflow: hidden;

  &.default {
    background: #f5f7fa;
  }

  &.floating {
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  .lang-btn {
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: #666;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;

    &.active {
      background: #fff;
      color: #4F5FF7;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(79, 95, 247, 0.1);
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  // 手机适配
  @media (max-width: 480px) {
    .lang-btn {
      padding: 5px 12px;
      font-size: 12px;
    }
  }
}
</style>

