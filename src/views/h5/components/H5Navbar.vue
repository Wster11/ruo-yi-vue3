<template>
  <div class="h5-navbar">
    <button v-if="showBack" class="back-btn" @click="handleBack">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <h2 class="page-title">{{ title }}</h2>
    
    <div class="right-actions">
      <slot name="actions">
        <LanguageSwitcher 
          v-if="showLanguage"
          v-model="currentLang" 
          variant="default"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSwitcher from './LanguageSwitcher.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showBack: {
    type: Boolean,
    default: true
  },
  showLanguage: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'zh'
  }
})

const emit = defineEmits(['update:language', 'back'])

const router = useRouter()

const currentLang = computed({
  get: () => props.language,
  set: (value) => emit('update:language', value)
})

const handleBack = () => {
  emit('back')
  if (!emit('back')) {
    router.back()
  }
}
</script>

<style scoped lang="scss">
.h5-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .back-btn {
    width: 36px;
    height: 36px;
    border: none;
    background: #f5f7fa;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #4e5a7a;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: #e8ecf0;
      transform: translateX(-2px);
    }

    &:active {
      transform: translateX(-1px);
    }
  }

  .page-title {
    flex: 1;
    margin: 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
  }

  .right-actions {
    flex-shrink: 0;
  }

  // 平板适配
  @media (max-width: 768px) and (min-width: 481px) {
    padding: 14px 18px;
  }

  // 手机适配
  @media (max-width: 480px) {
    padding: 12px 16px;

    .back-btn {
      width: 32px;
      height: 32px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .page-title {
      font-size: 16px;
      margin: 0 12px;
    }
  }

  // 小屏手机适配
  @media (max-width: 375px) {
    padding: 10px 14px;

    .page-title {
      font-size: 15px;
    }
  }
}
</style>

