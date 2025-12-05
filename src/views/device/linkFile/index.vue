<template>
  <div class="link-device-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button type="text" class="back-button" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-content">
          <h1 class="page-title">关联技术文档</h1>
          <p class="page-subtitle">
            当前文件: <span class="file-name">{{ fileName }}</span>
          </p>
        </div>
      </div>
      <div class="header-actions">
        <el-button size="default" @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          size="default"
          @click="handleSave"
          :disabled="selectedDevices.length === 0"
        >
          <el-icon><Check /></el-icon>
          保存关联 ({{ selectedDevices.length }})
        </el-button>
        <el-button type="primary" size="default" @click="handleBatchUpload"
          >批量上传</el-button
        >
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-section">
      <el-form :inline="true" class="search-form">
        <el-form-item label="设备名称">
          <el-input
            v-model="searchForm.deviceName"
            placeholder="搜索设备名..."
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="设备分类">
          <el-select
            v-model="searchForm.deviceCategory"
            placeholder="全部"
            class="search-select"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="CF" value="CF" />
            <el-option label="CH" value="CH" />
            <el-option label="IH" value="IH" />
            <el-option label="PE" value="PE" />
            <el-option label="SA" value="SA" />
            <el-option label="WM" value="WM" />
          </el-select>
        </el-form-item>

        <el-form-item label="设备型号">
          <el-input
            v-model="searchForm.deviceModel"
            placeholder="搜索型号..."
            class="search-input"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 设备列表表格 -->
    <div class="device-table-container">
      <el-table
        ref="deviceTableRef"
        :data="deviceList"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :header-cell-style="{
          backgroundColor: '#fafafa',
          fontWeight: '600',
          color: '#303133',
        }"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column
          prop="deviceName"
          label="设备名称"
          min-width="180"
          align="left"
        >
          <template #default="scope">
            <div class="device-name-cell">
              <el-icon class="device-icon"><Box /></el-icon>
              <span class="device-name-text">{{ scope.row.deviceName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="category"
          label="分类"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.category"
              type="info"
              effect="plain"
              size="small"
            >
              {{ scope.row.category }}
            </el-tag>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="model" label="型号" width="150" align="center" />

        <el-table-column
          prop="serialNumber"
          label="序列号"
          width="180"
          align="center"
        />

        <el-table-column
          prop="createTime"
          label="创建时间"
          width="150"
          align="center"
        />
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>

  <!-- 批量上传modal -->
  <el-dialog
    v-model="batchUploadVisible"
    title="批量上传文件"
    width="1000px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="batch-upload-container">
      <!-- 提示信息 -->
      <div class="upload-tip">
        <el-icon class="tip-icon"><CircleCheck /></el-icon>
        <span>批量上传的文件将自动关联到当前设备：{{ fileName }}</span>
      </div>

      <!-- 文件命名规范 -->
      <div class="naming-rule-tip">
        <el-icon class="tip-icon"><CircleCheck /></el-icon>
        <span
          >文件命名规范 格式: TD-RND-{Category}-{Seq}-{Lang} (例如:
          TD-RND-CF-001-cn) 系统将自动校验分类简码与语言后缀的一致性。</span
        >
      </div>

      <!-- 文件列表 -->
      <div class="file-list-container">
        <table class="file-list-table">
          <thead>
            <tr>
              <th>文件名称(CODE)</th>
              <th>类型</th>
              <th>语言</th>
              <th>关联设备(默认当前)</th>
              <th>物理文件</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in uploadFiles" :key="file.id">
              <td>
                <el-input
                  v-model="file.fileName"
                  placeholder="请输入文件名称"
                  size="small"
                />
              </td>
              <td>
                <el-select
                  v-model="file.fileType"
                  placeholder="选择类型"
                  size="small"
                >
                  <el-option label="操作手" value="操作手" />
                  <el-option label="维护手册" value="维护手册" />
                  <el-option label="安装指南" value="安装指南" />
                </el-select>
              </td>
              <td>
                <el-select
                  v-model="file.language"
                  placeholder="选择语言"
                  size="small"
                >
                  <el-option label="中文(简体)" value="中文(简体)" />
                  <el-option label="中文(繁体)" value="中文(繁体)" />
                  <el-option label="English" value="English" />
                </el-select>
              </td>
              <td>
                <div class="device-info">
                  <div class="input-item">
                    <label class="input-label">分类</label>
                    <el-input
                      v-model="file.category"
                      placeholder="分类"
                      size="small"
                      disabled
                    />
                  </div>
                  <div class="input-item">
                    <label class="input-label">名称</label>
                    <el-input
                      v-model="file.deviceName"
                      placeholder="名称"
                      size="small"
                      disabled
                    />
                  </div>
                </div>
              </td>
              <td>
                <el-upload
                  :auto-upload="false"
                  :on-change="(uploadFile) => (file.file = uploadFile.raw)"
                  :show-file-list="false"
                >
                  <el-button size="small" type="primary">
                    <el-icon><UploadFilled /></el-icon>
                    选择文件
                  </el-button>
                </el-upload>
              </td>
              <td class="delete-column">
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  @click="handleDeleteFile(index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 添加文件按钮 -->
      <div class="add-file-button">
        <el-button type="success" size="small" @click="handleAddFile">
          <el-icon><Plus /></el-icon>
          添加文件
        </el-button>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseBatchUpload">取消</el-button>
        <el-button type="primary" @click="handleStartUpload"
          >开始上传 ({{ uploadFiles.length }})</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  UploadFilled,
  Check,
  CircleCheck,
  CircleCheckFilled,
  Plus,
  Delete,
  ArrowLeft,
  Search,
  Box,
  RefreshLeft,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

// 文件名称
const fileName = ref("TD-RND-CF-001-cn");

// 加载状态
const loading = ref(false);

// 搜索表单
const searchForm = reactive({
  deviceName: "",
  deviceCategory: "",
  deviceModel: "",
});

// 选中的设备
const selectedDevices = ref([]);
const deviceTableRef = ref(null);

// 设备列表数据
const deviceList = ref([
  {
    id: 1,
    deviceName: "CF-200-1",
    category: "",
    model: "CF-200",
    serialNumber: "SN2023001",
    createTime: "2023-10-15",
  },
  {
    id: 2,
    deviceName: "CH-Alpha-1",
    category: "CH",
    model: "CH-Alpha",
    serialNumber: "SN2023002",
    createTime: "2023-11-01",
  },
  {
    id: 3,
    deviceName: "IH-Core-1",
    category: "IH",
    model: "IH-Core",
    serialNumber: "SN998877",
    createTime: "2023-01-20",
  },
  {
    id: 4,
    deviceName: "PE-Unit-1",
    category: "PE",
    model: "PE-Unit",
    serialNumber: "SN-S001",
    createTime: "2024-03-01",
  },
  {
    id: 5,
    deviceName: "SA-Scope-1",
    category: "SA",
    model: "SA-Scope",
    serialNumber: "RB-009",
    createTime: "2022-05-20",
  },
  {
    id: 6,
    deviceName: "WM-001-1",
    category: "WM",
    model: "WM-001",
    serialNumber: "WM-001-SN",
    createTime: "2024-01-15",
  },
  {
    id: 7,
    deviceName: "CF-Lite-1",
    category: "",
    model: "CF-Lite",
    serialNumber: "SN-L002",
    createTime: "2024-02-10",
  },
  {
    id: 8,
    deviceName: "CH-Beta-1",
    category: "CH",
    model: "CH-Beta",
    serialNumber: "SN-B003",
    createTime: "2024-03-05",
  },
]);

// 分页数据
const pagination = reactive({
  total: 8,
  currentPage: 1,
  pageSize: 10,
});

// 返回
const handleBack = () => {
  router.back();
};

// 取消
const handleCancel = () => {
  router.back();
};

// 保存关联
const handleSave = () => {
  if (selectedDevices.value.length === 0) {
    ElMessage.warning("请至少选择一个设备");
    return;
  }

  // 这里应该调用API保存关联关系
  console.log("保存关联的设备:", selectedDevices.value);

  ElMessage.success(`成功关联 ${selectedDevices.value.length} 个设备`);

  // 返回详情页
  setTimeout(() => {
    router.back();
  }, 500);
};

// 选择改变
const handleSelectionChange = (selection) => {
  selectedDevices.value = selection;
};

// 查询
const handleSearch = () => {
  loading.value = true;
  // 模拟查询
  setTimeout(() => {
    ElMessage.success("查询成功");
    loading.value = false;
  }, 500);
};

// 重置
const handleReset = () => {
  searchForm.deviceName = "";
  searchForm.deviceCategory = "";
  searchForm.deviceModel = "";
  ElMessage.info("已重置搜索条件");
};

// 页码改变
const handlePageChange = (page) => {
  pagination.currentPage = page;
  // 加载数据
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  // 加载数据
};

// 批量上传相关
const batchUploadVisible = ref(false);
const uploadFiles = ref([
  {
    id: 1,
    fileName: "TD-RND-CF-001-cn",
    fileType: "操作手",
    language: "中文(简体)",
    category: "CF",
    deviceName: "CF-200-1",
    file: null,
  },
]);

// 打开批量上传modal
const handleBatchUpload = () => {
  batchUploadVisible.value = true;
};

// 关闭批量上传modal
const handleCloseBatchUpload = () => {
  batchUploadVisible.value = false;
};

// 添加文件
const handleAddFile = () => {
  const newFile = {
    id: Date.now(),
    fileName: "",
    fileType: "操作手",
    language: "中文(简体)",
    category: "CF",
    deviceName: "CF-200-1",
    file: null,
  };
  uploadFiles.value.push(newFile);
};

// 删除文件
const handleDeleteFile = (index) => {
  uploadFiles.value.splice(index, 1);
};

// 选择文件
const handleFileChange = (index, event) => {
  const file = event.target.files[0];
  if (file) {
    uploadFiles.value[index].file = file;
  }
};

// 开始上传
const handleStartUpload = () => {
  if (uploadFiles.value.length === 0) {
    ElMessage.warning("请添加文件");
    return;
  }

  // 检查是否所有文件都已选择
  const hasEmptyFile = uploadFiles.value.some((file) => !file.file);
  if (hasEmptyFile) {
    ElMessage.warning("请为所有文件选择物理文件");
    return;
  }

  // 模拟上传
  console.log("上传文件:", uploadFiles.value);
  ElMessage.success("文件上传成功");
  batchUploadVisible.value = false;
};

// 初始化
onMounted(() => {
  // 从路由参数获取文件信息
  const fileId = route.params.fileId || route.query.fileId;
  fileName.value = route.query.fileName || "TD-RND-CF-001-cn";

  if (fileId) {
    console.log("文件ID:", fileId);
    // 这里可以加载已关联的设备，并在表格中预选
  }

  // 如果有已关联的设备，可以预选
  // nextTick(() => {
  //   deviceTableRef.value.toggleRowSelection(deviceList.value[0], true);
  // });
});
</script>

<style lang="scss" scoped>
@use "./index.scss";

// 批量上传样式
.batch-upload-container {
  padding: 10px 0;
}

.upload-tip,
.naming-rule-tip {
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  color: #67c23a;

  .tip-icon {
    margin-right: 8px;
    font-size: 16px;
    margin-top: 2px;
  }
}

.upload-tip {
  background-color: #f0f9eb;
  border: 1px solid #d9f7be;
}

.naming-rule-tip {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.file-list-container {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.file-list-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ebeef5;
  }

  th {
    background-color: #fafafa;
    font-weight: 600;
    color: #303133;
    white-space: nowrap;
  }

  td {
    padding: 15px 10px;

    .el-input,
    .el-select {
      width: 100%;
    }
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 120px;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 60px;
    text-align: center;
  }
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-item {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
}

.input-label {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.delete-column {
  text-align: center;
}

.add-file-button {
  text-align: right;
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
