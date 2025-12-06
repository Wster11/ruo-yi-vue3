<template>
  <div class="document-container">
    <!-- 语言切换 -->
    <LanguageSwitcher 
      v-model="currentLang" 
      variant="floating"
      class="floating-lang-switcher"
    />

    <!-- Logo 和标题 -->
    <div class="header-section">
      <div class="logo-icon">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="12" fill="#4F5FF7"/>
          <rect x="14" y="16" width="20" height="5" rx="1.5" fill="white"/>
          <circle cx="18" cy="18.5" r="1.5" fill="#4F5FF7"/>
          <rect x="14" y="26" width="20" height="5" rx="1.5" fill="white"/>
          <circle cx="18" cy="28.5" r="1.5" fill="#4F5FF7"/>
        </svg>
      </div>
      <h1 class="main-title">{{ title }}</h1>
      <p class="sub-title">High-Precision CNC</p>
    </div>

    <!-- 文档图片展示区 -->
    <div class="document-preview">
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 280'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23f0f7f4%7D.cls-2%7Bfill:%23e8f5ee%7D.cls-3%7Bfill:%23d4e8dd%7D.cls-4%7Bfill:%2367c29d%7D.cls-5%7Bfill:%23ffd5ce%7D.cls-6%7Bfill:%23ff9f8d%7D.cls-7%7Bfill:%2344546a%7D.cls-8%7Bfill:%2334424e%7D.cls-9%7Bfill:%23e8e8e8%7D.cls-10%7Bfill:%23c4c4c4%7D%3C/style%3E%3C/defs%3E%3Crect class='cls-1' width='400' height='280'/%3E%3Cellipse class='cls-2' cx='200' cy='180' rx='150' ry='80'/%3E%3Cpath class='cls-3' d='M100 120h80v100h-80zM220 120h80v100h-80z'/%3E%3Cpath class='cls-4' d='M110 130h60v25h-60zM230 130h60v25h-60z'/%3E%3Ccircle class='cls-5' cx='170' cy='100' r='25'/%3E%3Cpath class='cls-6' d='M160 100c0-5.5 4.5-10 10-10s10 4.5 10 10'/%3E%3Cpath class='cls-7' d='M155 105h30v50c0 8.3-6.7 15-15 15s-15-6.7-15-15v-50z'/%3E%3Ccircle class='cls-5' cx='240' cy='100' r='25'/%3E%3Cpath class='cls-6' d='M230 100c0-5.5 4.5-10 10-10s10 4.5 10 10'/%3E%3Cpath class='cls-8' d='M225 105h30v50c0 8.3-6.7 15-15 15s-15-6.7-15-15v-50z'/%3E%3Cpath class='cls-7' d='M170 155v15l-10 8v17h-5v-20l10-8v-12zM240 155v15l10 8v17h5v-20l-10-8v-12z'/%3E%3Cpath class='cls-8' d='M155 195h5v25h-5zM170 195h5v25h-5zM225 195h5v25h-5zM240 195h5v25h-5z'/%3E%3Crect class='cls-9' x='115' y='135' width='15' height='15' rx='2'/%3E%3Crect class='cls-9' x='235' y='135' width='15' height='15' rx='2'/%3E%3Crect class='cls-10' x='120' y='165' width='40' height='3' rx='1'/%3E%3Crect class='cls-10' x='120' y='172' width='40' height='3' rx='1'/%3E%3Crect class='cls-10' x='240' y='165' width='40' height='3' rx='1'/%3E%3Crect class='cls-10' x='240' y='172' width='40' height='3' rx='1'/%3E%3C/svg%3E" 
        alt="Document Preview"
        class="preview-image"
      />
    </div>

    <!-- 功能按钮区 -->
    <div class="function-buttons">
      <div class="function-card" @click="handleDeviceInfo">
        <div class="card-icon device-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="12" width="24" height="24" rx="4" stroke="#4F5FF7" stroke-width="2.5"/>
            <rect x="18" y="18" width="5" height="5" fill="#4F5FF7"/>
            <rect x="25" y="18" width="5" height="5" fill="#4F5FF7"/>
            <rect x="18" y="25" width="5" height="5" fill="#4F5FF7"/>
            <rect x="25" y="25" width="5" height="5" fill="#4F5FF7"/>
          </svg>
        </div>
        <span class="card-label">{{ deviceInfoText }}</span>
      </div>

      <div class="function-card" @click="handleTechFiles">
        <div class="card-icon file-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8h14l6 6v24a2 2 0 01-2 2H14a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5B9FD8" stroke-width="2.5"/>
            <path d="M28 8v6h6" stroke="#5B9FD8" stroke-width="2.5"/>
            <line x1="18" y1="22" x2="30" y2="22" stroke="#5B9FD8" stroke-width="2"/>
            <line x1="18" y1="28" x2="30" y2="28" stroke="#5B9FD8" stroke-width="2"/>
            <line x1="18" y1="34" x2="26" y2="34" stroke="#5B9FD8" stroke-width="2"/>
          </svg>
        </div>
        <span class="card-label">{{ techFilesText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LanguageSwitcher } from './components'

const router = useRouter()

// 当前语言
const currentLang = ref('zh')

// 多语言文本
const title = computed(() => {
  return currentLang.value === 'zh' 
    ? '文档管理系统自助终端' 
    : 'Document Management Terminal'
})

const deviceInfoText = computed(() => {
  return currentLang.value === 'zh' ? '设备信息' : 'Device Info'
})

const techFilesText = computed(() => {
  return currentLang.value === 'zh' ? '技术文件' : 'Tech Files'
})

// 功能按钮点击事件
const handleDeviceInfo = () => {
  router.push('/document/device')
}

const handleTechFiles = () => {
  router.push('/document/files')
}
</script>

<style scoped lang="scss">
.document-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #dce9f5 0%, #e8f0f7 50%, #f5f8fa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  position: relative;
  padding: 20px;
  padding-top: 70px;
}

// 浮动语言切换器
.floating-lang-switcher {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 10;
}

// Logo 和标题区域
.header-section {
  text-align: center;
  margin-bottom: 40px;

  .logo-icon {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin-bottom: 20px;

    svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 12px rgba(79, 95, 247, 0.25));
    }
  }

  .main-title {
    margin: 0 0 8px 0;
    font-size: 26px;
    font-weight: 600;
    color: #4e5a7a;
    letter-spacing: 0.5px;
  }

  .sub-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #4F5FF7;
    background: #f0f4ff;
    display: inline-block;
    padding: 6px 20px;
    border-radius: 20px;
  }
}

// 文档预览区
.document-preview {
  max-width: 500px;
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  .preview-image {
    width: 100%;
    height: auto;
    display: block;
  }
}

// 功能按钮区
.function-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 600px;
  margin: 0 auto 60px;
  padding: 0 10px;
}

.function-card {
  background: #fff;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(-2px);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: #f5f7fa;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  &:hover .card-icon {
    transform: scale(1.05);
  }

  &:first-child .card-icon {
    background: #f0f4ff;
  }

  &:last-child .card-icon {
    background: #f0f7fc;
  }

  .card-label {
    display: block;
    font-size: 17px;
    font-weight: 500;
    color: #2c3e50;
  }
}

// 页面指示器
.page-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #cbd5e0;
    transition: all 0.3s ease;

    &.active {
      width: 24px;
      border-radius: 4px;
      background: #5bc49f;
    }
  }
}

// 平板适配
@media (max-width: 768px) and (min-width: 481px) {
  .document-container {
    padding-top: 60px;
  }

  .header-section {
    .main-title {
      font-size: 24px;
    }
    .sub-title {
      font-size: 15px;
    }
  }

  .function-buttons {
    max-width: 500px;
    gap: 16px;
  }
}

// 手机适配
@media (max-width: 480px) {
  .document-container {
    padding: 15px;
    padding-top: 60px;
  }

  .floating-lang-switcher {
    top: 20px;
    right: 20px;
  }

  .header-section {
    margin-bottom: 30px;

    .logo-icon {
      width: 70px;
      height: 70px;
      margin-bottom: 16px;
    }

    .main-title {
      font-size: 20px;
    }

    .sub-title {
      font-size: 14px;
      padding: 5px 16px;
    }
  }

  .document-preview {
    margin-bottom: 40px;
    border-radius: 16px;
  }

  .function-buttons {
    gap: 15px;
    margin-bottom: 50px;
    padding: 0;
  }

  .function-card {
    padding: 24px 16px;
    border-radius: 16px;

    .card-icon {
      width: 56px;
      height: 56px;
      margin-bottom: 12px;

      svg {
        width: 36px;
        height: 36px;
      }
    }

    .card-label {
      font-size: 15px;
    }
  }

  .page-indicator {
    bottom: 20px;
  }
}

// 小屏手机适配
@media (max-width: 375px) {
  .header-section {
    .logo-icon {
      width: 60px;
      height: 60px;
    }

    .main-title {
      font-size: 18px;
    }
  }

  .function-card {
    padding: 20px 12px;

    .card-icon {
      width: 50px;
      height: 50px;

      svg {
        width: 32px;
        height: 32px;
      }
    }

    .card-label {
      font-size: 14px;
    }
  }
}
</style>

