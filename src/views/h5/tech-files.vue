<template>
  <div class="tech-files-container">
    <!-- 顶部导航栏 -->
    <H5Navbar 
      :title="pageTitle" 
      v-model:language="currentLang"
    />

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <!-- 搜索框 -->
      <div class="search-row">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="#999" stroke-width="2"/>
            <path d="M20 20L16 16" stroke="#999" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input 
            v-model="searchKeyword" 
            type="text" 
            :placeholder="searchPlaceholder"
            class="search-input"
          />
        </div>
      </div>

      <!-- 筛选框 -->
      <div class="filter-row">
        <div class="filter-box" @click="toggleFilterDropdown">
          <svg class="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M7 12h10M10 18h4" stroke="#666" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="filter-text">{{ currentFilterText }}</span>
          <svg class="arrow-icon" :class="{ open: showFilterDropdown }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- 类型筛选下拉框 -->
          <div v-if="showFilterDropdown" class="filter-dropdown">
            <div 
              v-for="option in filterOptions" 
              :key="option.value"
              :class="['filter-option', { active: currentFilter === option.value }]"
              @click.stop="selectFilter(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <div class="filter-box" @click="toggleLanguageDropdown">
          <svg class="lang-filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#666" stroke-width="2"/>
            <path d="M12 3c2.5 0 4.5 4 4.5 9s-2 9-4.5 9-4.5-4-4.5-9 2-9 4.5-9z" stroke="#666" stroke-width="2"/>
            <path d="M3 12h18" stroke="#666" stroke-width="2"/>
          </svg>
          <span class="filter-text">{{ currentLanguageFilterText }}</span>
          <svg class="arrow-icon" :class="{ open: showLanguageDropdown }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- 语言筛选下拉框 -->
          <div v-if="showLanguageDropdown" class="filter-dropdown">
            <div 
              v-for="option in languageFilterOptions" 
              :key="option.value"
              :class="['filter-option', { active: currentLanguageFilter === option.value }]"
              @click.stop="selectLanguageFilter(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档列表 -->
    <div class="files-list">
      <div 
        v-for="file in filteredFiles" 
        :key="file.id"
        class="file-card"
      >
        <div class="file-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="6" width="28" height="36" rx="3" fill="#E8F0FF"/>
            <path d="M10 6h18l10 10v26a3 3 0 01-3 3H10a3 3 0 01-3-3V9a3 3 0 013-3z" fill="#4F7BF7"/>
            <path d="M28 6v10h10" stroke="#E8F0FF" stroke-width="1.5"/>
            <line x1="15" y1="22" x2="33" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="15" y1="28" x2="33" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="15" y1="34" x2="27" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        
        <div class="file-info">
          <h3 class="file-name">{{ file.name }}</h3>
          <p class="file-code">{{ file.code }}</p>
        </div>
        
        <button class="download-btn" @click="downloadFile(file)">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 空状态 -->
      <EmptyState v-if="filteredFiles.length === 0" :text="emptyText" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { H5Navbar, EmptyState } from './components'

// 当前语言
const currentLang = ref('zh')

// 搜索关键词
const searchKeyword = ref('')

// 当前筛选类型
const currentFilter = ref('all')

// 当前语言筛选
const currentLanguageFilter = ref('all')

// 筛选下拉框显示状态
const showFilterDropdown = ref(false)

// 语言筛选下拉框显示状态
const showLanguageDropdown = ref(false)

// 切换筛选下拉框
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
  showLanguageDropdown.value = false
}

// 切换语言筛选下拉框
const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
  showFilterDropdown.value = false
}

// 选择筛选类型
const selectFilter = (value) => {
  currentFilter.value = value
  showFilterDropdown.value = false
}

// 选择语言筛选
const selectLanguageFilter = (value) => {
  currentLanguageFilter.value = value
  showLanguageDropdown.value = false
}

// 下载文件
const downloadFile = (file) => {
  console.log('下载文件:', file)
  // 这里可以添加实际的下载逻辑
}

// 多语言文本
const pageTitle = computed(() => {
  return currentLang.value === 'zh' ? '技术文库' : 'Technical Files'
})

const searchPlaceholder = computed(() => {
  return currentLang.value === 'zh' ? '文件名称' : 'File Name'
})

const emptyText = computed(() => {
  return currentLang.value === 'zh' ? '暂无文档' : 'No Documents'
})

// 筛选选项
const filterOptions = computed(() => {
  const isZh = currentLang.value === 'zh'
  return [
    { value: 'all', label: isZh ? '全部类型' : 'All Types' },
    { value: 'operation', label: isZh ? '操作手册' : 'Operation Manual' },
    { value: 'maintenance', label: isZh ? '运维手册' : 'Maintenance Manual' },
    { value: 'installation', label: isZh ? '安装手册' : 'Installation Manual' },
    { value: 'implementation', label: isZh ? '实施手册' : 'Implementation Manual' },
    { value: 'troubleshooting', label: isZh ? '故障排查' : 'Troubleshooting' }
  ]
})

// 当前筛选文本
const currentFilterText = computed(() => {
  const option = filterOptions.value.find(opt => opt.value === currentFilter.value)
  return option ? option.label : filterOptions.value[0].label
})

// 语言筛选选项
const languageFilterOptions = computed(() => {
  const isZh = currentLang.value === 'zh'
  return [
    { value: 'all', label: isZh ? '全部语言' : 'All Languages' },
    { value: 'zh', label: isZh ? '中文' : 'Chinese' },
    { value: 'en', label: isZh ? '英文' : 'English' }
  ]
})

// 当前语言筛选文本
const currentLanguageFilterText = computed(() => {
  const option = languageFilterOptions.value.find(opt => opt.value === currentLanguageFilter.value)
  return option ? option.label : languageFilterOptions.value[0].label
})

// 文档数据（包含语言版本）
const filesData = computed(() => {
  const isZh = currentLang.value === 'zh'
  
  return [
    {
      id: 1,
      name: isZh ? '操作手册' : 'Operation Manual',
      code: 'TD-RND-WM07-123-zh',
      type: 'operation',
      language: 'zh'
    },
    {
      id: 2,
      name: isZh ? '运维手册' : 'Maintenance Manual',
      code: 'TD-RND-WM07-124-zh',
      type: 'maintenance',
      language: 'zh'
    },
    {
      id: 3,
      name: isZh ? '安装手册' : 'Installation Manual',
      code: 'TD-RND-WM07-125-zh',
      type: 'installation',
      language: 'zh'
    },
    {
      id: 4,
      name: isZh ? '实施手册' : 'Implementation Manual',
      code: 'TD-RND-WM07-126-zh',
      type: 'implementation',
      language: 'zh'
    },
    {
      id: 5,
      name: isZh ? '故障排查' : 'Troubleshooting Guide',
      code: 'TD-RND-WM07-127-zh',
      type: 'troubleshooting',
      language: 'zh'
    },
    {
      id: 6,
      name: isZh ? '操作手册' : 'Operation Manual',
      code: 'TD-RND-WM07-130-en',
      type: 'operation',
      language: 'en'
    },
    {
      id: 7,
      name: isZh ? '运维手册' : 'Maintenance Manual',
      code: 'TD-RND-WM07-131-en',
      type: 'maintenance',
      language: 'en'
    },
    {
      id: 8,
      name: isZh ? '安装手册' : 'Installation Manual',
      code: 'TD-RND-WM07-132-en',
      type: 'installation',
      language: 'en'
    },
    {
      id: 9,
      name: isZh ? '故障排查' : 'Troubleshooting Guide',
      code: 'TD-RND-WM07-133-en',
      type: 'troubleshooting',
      language: 'en'
    }
  ]
})

// 过滤后的文档列表
const filteredFiles = computed(() => {
  let result = filesData.value

  // 按类型筛选
  if (currentFilter.value !== 'all') {
    result = result.filter(file => file.type === currentFilter.value)
  }

  // 按语言筛选
  if (currentLanguageFilter.value !== 'all') {
    result = result.filter(file => file.language === currentLanguageFilter.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(file => 
      file.name.toLowerCase().includes(keyword) || 
      file.code.toLowerCase().includes(keyword)
    )
  }

  return result
})
</script>

<style scoped lang="scss">
.tech-files-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #dce9f5 0%, #e8f0f7 50%, #f5f8fa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  padding-bottom: 20px;
}

// 导航栏样式已在组件中定义

// 搜索和筛选区域
.search-filter-section {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-row {
  width: 100%;
}

.filter-row {
  display: flex;
  gap: 12px;
}

.search-box {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .search-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    color: #2c3e50;
    background: transparent;
    padding: 12px 0;

    &::placeholder {
      color: #999;
    }
  }
}

.filter-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  flex: 1;
  z-index: 10;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .filter-icon,
  .lang-filter-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .filter-text {
    font-size: 14px;
    color: #2c3e50;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: transform 0.3s ease;

    &.open {
      transform: rotate(180deg);
    }
  }
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  min-width: 160px;
  z-index: 1000;

  .filter-option {
    padding: 12px 16px;
    font-size: 14px;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
    }

    &.active {
      background: #f0f4ff;
      color: #4F5FF7;
      font-weight: 600;
    }
  }
}

// 文档列表
.files-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .file-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    background: #f0f4ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  .file-info {
    flex: 1;
    min-width: 0;

    .file-name {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-code {
      margin: 0;
      font-size: 13px;
      color: #8492a6;
    }
  }

  .download-btn {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border: none;
    background: #4F7BF7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    svg {
      width: 22px;
      height: 22px;
    }

    &:hover {
      background: #3d68e0;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

// 空状态样式已在组件中定义

// 平板适配
@media (max-width: 768px) and (min-width: 481px) {
  .search-filter-section {
    padding: 14px 18px;
    gap: 10px;
  }

  .filter-row {
    gap: 10px;
  }

  .files-list {
    padding: 0 18px;
  }
}

// 手机适配
@media (max-width: 480px) {
  .search-filter-section {
    padding: 12px 16px;
    gap: 10px;
  }

  .filter-row {
    gap: 8px;
  }

  .search-box {
    padding: 0 12px;

    .search-input {
      font-size: 14px;
      padding: 10px 0;
    }
  }

  .filter-box {
    padding: 10px 12px;

    .filter-text {
      font-size: 13px;
    }
  }

  .files-list {
    padding: 0 16px;
    gap: 10px;
  }

  .file-card {
    padding: 14px;
    gap: 12px;

    .file-icon {
      width: 42px;
      height: 42px;

      svg {
        width: 28px;
        height: 28px;
      }
    }

    .file-info {
      .file-name {
        font-size: 15px;
      }

      .file-code {
        font-size: 12px;
      }
    }

    .download-btn {
      width: 40px;
      height: 40px;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}

// 小屏手机适配
@media (max-width: 375px) {
  .search-filter-section {
    gap: 8px;
  }

  .filter-row {
    gap: 8px;
  }

  .filter-box {
    padding: 8px 10px;

    .filter-text {
      font-size: 12px;
    }
  }

  .file-card {
    padding: 12px;

    .file-icon {
      width: 38px;
      height: 38px;

      svg {
        width: 26px;
        height: 26px;
      }
    }

    .file-info {
      .file-name {
        font-size: 14px;
      }
    }

    .download-btn {
      width: 38px;
      height: 38px;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>

