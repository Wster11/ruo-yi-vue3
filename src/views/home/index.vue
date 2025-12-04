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
                <span class="card-value">100</span>
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
                <span class="card-value">500</span>
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
                <span class="card-value">89.9</span>
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
                <span class="card-value">1000</span>
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
      <el-table :data="latestDevices" stripe style="width: 100%">
        <el-table-column prop="deviceName" label="设备名称" min-width="150">
          <template #default="scope">
            <div class="device-name-with-icon">
              <el-icon class="device-icon"><Document /></el-icon>
              {{ scope.row.deviceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceCategory" label="设备分类" min-width="120">
          <template #default="scope">
            <el-button type="text" size="small">{{
              scope.row.deviceCategory
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deviceModel" label="设备型号" min-width="150" />
        <el-table-column prop="documentLinked" label="文档关联" min-width="100">
          <template #default="scope">
            <span
              class="status-indicator"
              :class="scope.row.documentLinked ? 'linked' : 'unlinked'"
            >
              {{ scope.row.documentLinked ? "是" : "否" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column prop="creator" label="创建人" min-width="100" />
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
      <el-table :data="latestDevices" stripe style="width: 100%">
        <el-table-column prop="deviceName" label="设备名称" min-width="150">
          <template #default="scope">
            <div class="device-name-with-icon">
              <el-icon class="device-icon"><Document /></el-icon>
              {{ scope.row.deviceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceCategory" label="设备分类" min-width="120">
          <template #default="scope">
            <el-button type="text" size="small">{{
              scope.row.deviceCategory
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deviceModel" label="设备型号" min-width="150" />
        <el-table-column prop="documentLinked" label="文档关联" min-width="100">
          <template #default="scope">
            <span
              class="status-indicator"
              :class="scope.row.documentLinked ? 'linked' : 'unlinked'"
            >
              {{ scope.row.documentLinked ? "是" : "否" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column prop="creator" label="创建人" min-width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
// 最新设备数据
const latestDevices = [
  {
    deviceName: "温度传感器A",
    deviceCategory: "传感器",
    deviceModel: "",
    documentLinked: false,
    createTime: "2025-12-02 13:32:07",
    creator: "admin",
  },
  {
    deviceName: "压力传感器B",
    deviceCategory: "传感器",
    deviceModel: "PS-100",
    documentLinked: true,
    createTime: "2025-12-02 12:15:30",
    creator: "admin",
  },
  {
    deviceName: "PLC控制器C",
    deviceCategory: "控制器",
    deviceModel: "PLC-2000",
    documentLinked: true,
    createTime: "2025-12-01 15:45:22",
    creator: "user1",
  },
  {
    deviceName: "电机驱动器D",
    deviceCategory: "驱动器",
    deviceModel: "MD-500",
    documentLinked: false,
    createTime: "2025-12-01 10:30:15",
    creator: "user2",
  },
  {
    deviceName: "触摸屏E",
    deviceCategory: "人机界面",
    deviceModel: "HMI-10",
    documentLinked: true,
    createTime: "2025-11-30 14:20:08",
    creator: "admin",
  },
];
</script>

<style lang="scss" scoped>
@use "./home.scss";
</style>
