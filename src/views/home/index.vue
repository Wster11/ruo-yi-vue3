<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 设备总量卡片 -->
      <el-col :span="6">
        <el-card class="info-card">
          <div class="card-content">
            <div class="card-header">
              <span class="card-title">设备总量</span>
            </div>
            <div class="card-main">
              <el-icon class="card-icon"><List /></el-icon>
              <div class="card-number">
                <span class="card-value">{{ userCountInfo.deviceCount }}</span>
                <span class="card-unit">台</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 文档总量卡片 -->
      <el-col :span="6">
        <el-card class="info-card">
          <div class="card-content">
            <div class="card-header">
              <span class="card-title">文档总量</span>
            </div>
            <div class="card-main">
              <el-icon class="card-icon"><Document /></el-icon>
              <div class="card-number">
                <span class="card-value">{{ userCountInfo.fileCount }}</span>
                <span class="card-unit">份</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 关联覆盖率卡片 -->
      <el-col :span="6">
        <el-card class="info-card">
          <div class="card-content">
            <div class="card-header">
              <span class="card-title">关联覆盖率</span>
              <span class="card-subtitle">已关联文档的设备</span>
            </div>
            <div class="card-main">
              <el-icon class="card-icon"><Connection /></el-icon>
              <div class="card-number">
                <span class="card-value">{{ userCountInfo.relatedRate }}</span>
                <span class="card-unit">%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 今日扫码卡片 -->
      <el-col :span="6">
        <el-card class="info-card">
          <div class="card-content">
            <div class="card-header">
              <span class="card-title">今日扫码</span>
              <span class="card-subtitle">现场查阅热度</span>
            </div>
            <div class="card-main">
              <el-icon class="card-icon">
                <img
                  src="./qrcode-flipped.svg"
                  alt="二维码"
                  style="width: 1em; height: 1em"
                />
              </el-icon>
              <div class="card-number">
                <span class="card-value">{{ userCountInfo.scanTotal }}</span>
                <span class="card-unit">次</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作区域 -->
    <div class="quick-actions">
      <h3 class="actions-title">快捷操作</h3>
      <div class="actions-container">
        <div class="action-card">
          <div class="action-icon purple">
            <el-icon><Plus /></el-icon>
          </div>
          <div class="action-content">
            <h4 class="action-title">注册新设备</h4>
            <p class="action-desc">录入新的硬件资产并生成唯一标识</p>
          </div>
          <el-icon class="action-arrow"><ArrowRight /></el-icon>
        </div>

        <div class="action-card">
          <div class="action-icon blue">
            <el-icon><Upload /></el-icon>
          </div>
          <div class="action-content">
            <h4 class="action-title">上传文档</h4>
            <p class="action-desc">添加技术手册、图纸或维护指南</p>
          </div>
          <el-icon class="action-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 最新设备表格区域 -->
    <div class="latest-devices">
      <div class="section-header">
        <h3 class="section-title">
          最新设备 (Top 5)<span class="badge">1</span>
        </h3>
        <a href="#" class="view-all">查看全部</a>
      </div>
      <el-table :data="userCountInfo.deviceNewList" stripe style="width: 100%">
        <el-table-column prop="deviceName" label="设备名称" min-width="150">
          <template #default="scope">
            <div class="device-name-with-icon">
              <el-icon class="device-icon"><Document /></el-icon>
              {{ scope.row.deviceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryLabel" label="设备分类" min-width="120">
          <template #default="scope">
            <el-button type="text" size="small">{{
              scope.row.categoryLabel
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deviceModelName" label="设备型号" min-width="150" />
        <el-table-column prop="documentLinked" label="文档关联" min-width="100">
          <template #default="scope">
            <span
              class="status-indicator"
              :class="scope.row.documentLinked ? 'linked' : 'unlinked'"
            >
              {{ scope.row.devicebindFile === 'Y' ? "是" : "否" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column prop="createBy" label="创建人" min-width="100" />
      </el-table>
    </div>
    <!-- 最新设备表格区域 -->
    <div class="latest-devices">
      <div class="section-header">
        <h3 class="section-title">
          最新文件 (Top 5)<span class="badge">1</span>
        </h3>
        <a href="#" class="view-all">查看全部</a>
      </div>
      <el-table :data="userCountInfo.fileNewList" stripe style="width: 100%">
        <el-table-column prop="deviceName" label="文件名称" min-width="200">
          <template #default="scope">
            <div class="device-name-with-icon">
              <el-icon class="device-icon"><Document /></el-icon>
              {{ scope.row.deviceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryLabel" label="关联设备分类" min-width="120">
          <template #default="scope">
            <el-button type="text" size="small">{{
              scope.row.categoryLabel
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" min-width="100" />
        <el-table-column prop="documentLinked" label="关联状态" min-width="100">
          <template #default="scope">
            <span
              class="status-indicator"
              :class="scope.row.documentLinked ? 'linked' : 'unlinked'"
            >
              {{ scope.row.fileBoundDevices === 'Y' ? "已关联" : "未关联" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column prop="createBy" label="创建人" min-width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHomeData } from '@/api/home'

  const userCountInfo = ref({
    deviceNewList: [],
    fileNewList: [],
    deviceCount: 0,
    fileCount: 0,
    relatedRate: '0%',
    scanTotal: 0,
    categoryCount: 0,
    languageCount: 0,
  })


// 加载状态
const loading = ref(false)

// 获取首页数据
const fetchHomeData = async () => {
  loading.value = true
  try {
    const res = await getHomeData()
    console.log(res,'ressss')
    if (res.code === 200) {
      userCountInfo.value = res.data
      console.log(userCountInfo.value,'userCountInfo.value');
      
    }
  } catch (error) {
    console.error('获取首页数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchHomeData()
})
</script>

<style lang="scss" scoped>
@use "./home.scss";
</style>
