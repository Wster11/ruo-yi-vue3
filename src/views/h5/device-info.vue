<template>
  <div class="device-info-container">
    <!-- 顶部导航栏 -->
    <H5Navbar 
      :title="pageTitle" 
      v-model:language="currentLang"
    />

    <!-- 设备信息列表 -->
    <div class="device-content">
      <div class="info-card">
        <div class="info-item" v-for="item in deviceInfo" :key="item.key">
          <div class="info-label">{{ item.label }}</div>
          <div class="info-value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { H5Navbar } from './components'

// 当前语言
const currentLang = ref('zh')

// 页面标题
const pageTitle = computed(() => {
  return currentLang.value === 'zh' ? '设备信息' : 'Device Information'
})

// 设备信息数据（根据语言动态显示）
const deviceInfo = computed(() => {
  const isZh = currentLang.value === 'zh'
  
  return [
    {
      key: 'name',
      label: isZh ? '设备名称' : 'Device Name',
      value: 'High-Precision CNC'
    },
    {
      key: 'category',
      label: isZh ? '设备分类' : 'Category',
      value: 'Industrial Automation'
    },
    {
      key: 'model',
      label: isZh ? '设备型号' : 'Model',
      value: 'RND-WM07-X'
    },
    {
      key: 'length',
      label: isZh ? '长' : 'Length',
      value: '1200 mm'
    },
    {
      key: 'width',
      label: isZh ? '宽' : 'Width',
      value: '800 mm'
    },
    {
      key: 'height',
      label: isZh ? '高' : 'Height',
      value: '1500 mm'
    },
    {
      key: 'weight',
      label: isZh ? '重量' : 'Weight',
      value: '450 kg'
    }
  ]
})
</script>

<style scoped lang="scss">
.device-info-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #dce9f5 0%, #e8f0f7 50%, #f5f8fa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

// 导航栏样式已在组件中定义

// 设备信息内容区
.device-content {
  padding: 20px;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.info-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8f9fa;
  }

  .info-label {
    flex: 0 0 120px;
    font-size: 15px;
    color: #8492a6;
    font-weight: 500;
  }

  .info-value {
    flex: 1;
    font-size: 16px;
    color: #2c3e50;
    font-weight: 600;
    text-align: right;
  }
}

// 平板适配
@media (max-width: 768px) and (min-width: 481px) {
  .device-content {
    padding: 18px;
  }

  .info-item {
    padding: 18px 20px;

    .info-label {
      flex: 0 0 110px;
      font-size: 14px;
    }

    .info-value {
      font-size: 15px;
    }
  }
}

// 手机适配
@media (max-width: 480px) {

  .device-content {
    padding: 16px;
  }

  .info-card {
    border-radius: 12px;
  }

  .info-item {
    padding: 16px 18px;

    .info-label {
      flex: 0 0 100px;
      font-size: 14px;
    }

    .info-value {
      font-size: 15px;
    }
  }
}

// 小屏手机适配
@media (max-width: 375px) {
  .device-content {
    padding: 14px;
  }

  .info-item {
    padding: 14px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .info-label {
      flex: none;
      font-size: 13px;
    }

    .info-value {
      text-align: left;
      font-size: 15px;
      width: 100%;
    }
  }
}
</style>

