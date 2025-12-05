<template>
  <div class="device-detail-container">
    <!-- 页面头部 -->
    <div class="detail-header">
      <el-button type="text" class="back-button" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="header-info">
        <h1 class="device-title">
          {{ deviceData.deviceName }}
          <el-tag type="info" size="small">maintenance</el-tag>
        </h1>
      </div>
      <p class="device-subtitle">设备详细信息与文档库</p>
    </div>

    <!-- 设备基本信息卡片 -->
    <div class="detail-card">
      <div class="card-header">
        <div class="card-title">
          <div class="title-bar"></div>
          <h2>设备基本信息</h2>
        </div>
      </div>
      <div class="card-content">
        <div class="info-qr-wrapper">
          <div class="info-left">
            <div class="device-info-grid">
              <div class="info-item">
                <label class="info-label">设备分类</label>
                <div class="info-value">{{ deviceData.deviceCategory }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">设备型号</label>
                <div class="info-value">{{ deviceData.deviceModel }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">序列号(SN)</label>
                <div class="info-value">{{ deviceData.serialNumber }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">版本号</label>
                <div class="info-value">{{ deviceData.deviceVersion }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">创建人</label>
                <div class="info-value">{{ deviceData.creator }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">创建时间</label>
                <div class="info-value">{{ deviceData.createTime }}</div>
              </div>
            </div>
          </div>
          <div class="qr-right">
            <div class="qrcode-preview">
              <div class="qrcode-image">
                <!-- 这里可以替换为实际的二维码图片 -->
                <div class="qr-placeholder">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="120"
                      height="120"
                      fill="#f0f0f0"
                      stroke="#ddd"
                      stroke-width="2"
                    />
                    <path
                      d="M30 30h20v20h-20zM70 30h20v20h-20zM30 70h20v20h-20zM50 50h20v20h-20zM70 70h20v20h-20z"
                      fill="#999"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 关联文档列表卡片 -->
    <div class="detail-card">
      <div class="card-header">
        <div class="card-title">
          <div class="title-bar"></div>
          <h2>关联文档列表 ({{ relatedDocs.length }})</h2>
        </div>
        <div class="card-header-actions">
          <div class="language-filter">
            <el-select
              v-model="selectedLanguage"
              placeholder="所有语言"
              size="small"
            >
              <el-option label="所有语言" value="all" />
              <el-option label="中文(简体)" value="zh-cn" />
              <el-option label="英语(美国)" value="en-us" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="card-content">
        <el-table
          :data="filteredDocs"
          style="width: 100%"
          :header-cell-style="{
            backgroundColor: '#fafafa',
            fontWeight: '600',
            color: '#303133',
          }"
        >
          <el-table-column
            prop="fileName"
            label="文件名称"
            min-width="200"
            align="left"
          />
          <el-table-column
            prop="fileType"
            label="文件类型"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-tag type="info" effect="plain" size="small">{{
                scope.row.fileType
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="language"
            label="语言"
            width="150"
            align="center"
          />
          <el-table-column
            prop="fileSize"
            label="大小"
            width="100"
            align="center"
          />
          <el-table-column label="操作" width="120" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                link
                @click="handleReadDoc(scope.row)"
              >
                阅读
              </el-button>
              <el-button
                type="primary"
                size="small"
                link
                @click="handleDocDetail(scope.row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="relatedDocs.length === 0" class="empty-state">
          <el-empty description="暂无关联文档" :image-size="120" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

// 设备数据
const deviceData = ref({
  deviceName: "CF-200-1",
  deviceCategory: "CF",
  deviceModel: "CF-200",
  deviceVersion: "v1.0",
  serialNumber: "SN2023001",
  createTime: "2023-10-15",
  creator: "张三",
  qrDescription: "主离心机",
});

// 关联文档列表
const relatedDocs = ref([
  {
    id: 1,
    fileName: "TD-RND-CF-001-cn",
    fileType: "操作手册",
    language: "中文(简体)",
    fileSize: "2.4 MB",
  },
  {
    id: 2,
    fileName: "TD-RND-CF-003-en",
    fileType: "实施手册",
    language: "英语(美国)",
    fileSize: "500 KB",
  },
]);

// 语言筛选
const selectedLanguage = ref("all");

// 过滤后的文档列表
const filteredDocs = computed(() => {
  if (selectedLanguage.value === "all") {
    return relatedDocs.value;
  }
  return relatedDocs.value.filter((doc) =>
    doc.language.includes(selectedLanguage.value)
  );
});

// 返回
const handleBack = () => {
  router.back();
};

// 阅读文档
const handleReadDoc = (doc) => {
  ElMessage.info(`正在打开文档: ${doc.fileName}`);
  // 这里可以添加实际的文档阅读逻辑
};

// 查看文档详情
const handleDocDetail = (doc) => {
  // 跳转到文件管理的详情页
  router.push(`/file/detail/${doc.id}`);
};

// 初始化
onMounted(() => {
  // 从路由参数获取设备ID
  const deviceId = route.params.id || route.query.id;
  if (deviceId) {
    // 这里可以根据ID加载设备详情
    console.log("加载设备详情:", deviceId);
    // 模拟加载数据
    loadDeviceDetail(deviceId);
  }
});

// 模拟加载设备详情
const loadDeviceDetail = (deviceId) => {
  // 这里可以替换为实际的API调用
  setTimeout(() => {
    console.log("设备详情加载完成");
  }, 500);
};
</script>

<style lang="scss" scoped>
.device-detail-container {
  padding: 20px;
}

.detail-header {
  margin-bottom: 30px;
  position: relative;
  padding-left: 50px;
  padding-top: 10px;

  .back-button {
    position: absolute;
    left: 0;
    top: 10px;
  }

  .device-title {
    font-size: 28px;
    margin-bottom: 5px;
    color: #303133;
  }

  .device-subtitle {
    color: #909399;
    font-size: 14px;
  }
}

.detail-card {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-title {
    display: flex;
    align-items: center;

    .title-bar {
      width: 4px;
      height: 20px;
      background-color: #409eff;
      margin-right: 10px;
    }

    h2 {
      margin: 0;
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }
  }
}

.card-content {
  padding: 20px;
}

.info-qr-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.info-left {
  flex: 1;
  margin-right: 40px;
}

.device-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.info-item {
  .info-label {
    display: block;
    margin-bottom: 3px;
    color: #909399;
    font-size: 14px;
  }

  .info-value {
    color: #303133;
    font-size: 16px;
  }
}

.qr-right {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-preview {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrcode-preview {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-filter {
  display: flex;
  align-items: center;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
