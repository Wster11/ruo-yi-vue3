<template>
  <div class="file-detail-container">
    <!-- 页面头部 -->
    <div class="detail-header">
      <el-button
        type="text"
        class="back-button"
        @click="handleBack"
      >
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="header-info">
        <h1 class="file-title">{{ fileInfo.fileName }}</h1>
        <el-tag type="info" size="small" class="version-tag">{{ fileInfo.version }}</el-tag>
      </div>
      <p class="file-subtitle">文档详细信息与设备关联管理</p>
    </div>

    <!-- 基本属性卡片 -->
    <div class="detail-card">
      <div class="card-header">
        <div class="card-title">
          <div class="title-bar"></div>
          <h2>基本属性</h2>
        </div>
      </div>
      <div class="card-content">
        <el-row :gutter="40" class="info-row">
          <el-col :span="6">
            <div class="info-item">
              <label class="info-label">文件类型</label>
              <div class="info-value">{{ fileInfo.fileType }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label class="info-label">语言</label>
              <div class="info-value">{{ fileInfo.language }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label class="info-label">文件大小</label>
              <div class="info-value">{{ fileInfo.fileSize }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label class="info-label">版本</label>
              <div class="info-value">{{ fileInfo.version }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" class="info-row">
          <el-col :span="6">
            <div class="info-item">
              <label class="info-label">上传人</label>
              <div class="info-value">{{ fileInfo.uploader }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label class="info-label">上传时间</label>
              <div class="info-value">{{ fileInfo.uploadTime }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 关联设备概览卡片 -->
    <div class="detail-card">
      <div class="card-header">
        <div class="card-title">
          <div class="title-bar"></div>
          <h2>关联设备概览 ({{ deviceList.length }})</h2>
        </div>
        <el-button type="primary" size="default" @click="handleLinkMore">
          <el-icon><Connection /></el-icon>
          关联更多设备
        </el-button>
      </div>
      <div class="card-content">
        <el-table
          :data="deviceList"
          style="width: 100%"
          :header-cell-style="{
            backgroundColor: '#fafafa',
            fontWeight: '600',
            color: '#303133',
          }"
        >
          <el-table-column prop="deviceName" label="设备名称" min-width="150" align="left" />
          <el-table-column prop="deviceCategory" label="设备分类" width="150" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.deviceCategory" type="info" effect="plain" size="small">
                {{ scope.row.deviceCategory }}
              </el-tag>
              <span v-else class="empty-text">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceModel" label="设备型号" width="150" align="center" />
          <el-table-column prop="createTime" label="创建时间" width="150" align="center" />
          <el-table-column prop="creator" label="创建人" width="120" align="center" />
        </el-table>

        <!-- 空状态 -->
        <div v-if="deviceList.length === 0" class="empty-state">
          <el-empty description="暂无关联设备" :image-size="120">
            <el-button type="primary" @click="handleLinkMore">
              <el-icon><Connection /></el-icon>
              关联设备
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 文件信息
const fileInfo = ref({
  id: 1,
  fileName: "TD-RND-CF-001-cn",
  fileType: "PDF (操作手册)",
  language: "中文 (简体) (cn)",
  fileSize: "2.4 MB",
  version: "v1.0",
  uploader: "张三",
  uploadTime: "2023-10-15",
});

// 关联设备列表
const deviceList = ref([
  {
    id: 1,
    deviceName: "CF-200-1",
    deviceCategory: "",
    deviceModel: "CF-200",
    createTime: "2023-10-15",
    creator: "张三",
  },
]);


// 返回
const handleBack = () => {
  router.back();
};

// 关联更多设备
const handleLinkMore = () => {
  // 跳转到关联设备页面
  router.push({
    name: "LinkDevice",
    params: { fileId: fileInfo.value.id },
    query: { fileName: fileInfo.value.fileName },
  });
};


// 初始化
onMounted(() => {
  // 从路由参数获取文件ID
  const fileId = route.params.id || route.query.id;
  if (fileId) {
    // 这里可以根据ID加载文件详情
    console.log("加载文件详情:", fileId);
  }
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>


