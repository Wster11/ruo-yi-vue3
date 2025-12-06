<template>
  <div>
    <div class="link-file-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <el-button type="text" class="back-button" @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <div class="header-content">
            <h1 class="page-title">关联文件文档</h1>
            <p class="page-subtitle">
              当前设备: <span class="device-name">{{ deviceName }}</span>
            </p>
          </div>
        </div>
        <div class="header-actions">
          <el-button size="default" @click="handleCancel">取消</el-button>
          <el-button
            type="primary"
            size="default"
            @click="handleSave"
            :disabled="selectedFiles.length === 0"
          >
            <el-icon><Check /></el-icon>
            保存关联 ({{ selectedFiles.length }})
          </el-button>
          <el-button type="primary" size="default" @click="handleBatchUpload"
            >批量上传文件</el-button
          >
        </div>
      </div>

      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <el-form :inline="true" class="search-form">
          <el-form-item>
            <el-input
              v-model="searchForm.fileName"
              placeholder="搜索文件名称..."
              class="search-input"
              clearable
              style="width: 300px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="searchForm.category"
              placeholder="全部分类"
              class="search-select"
              clearable
              style="width: 200px"
            >
              <el-option label="全部分类" value="" />
              <el-option
                v-for="category in categoryList"
                :key="category.id"
                :label="category.categoryName"
                :value="category.categoryName"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="searchForm.language"
              placeholder="全部语言"
              class="search-select"
              clearable
              style="width: 200px"
            >
              <el-option label="全部语言" value="" />
              <el-option
                v-for="lang in languageList"
                :key="lang.id"
                :label="lang.languageName"
                :value="lang.languageName"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 文件列表表格 -->
      <div class="file-table-container">
        <el-table
          ref="fileTableRef"
          :data="fileList"
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            backgroundColor: '#fafafa',
            fontWeight: '600',
            color: '#303133'
          }"
        >
          <el-table-column type="selection" width="55" align="center" />

          <el-table-column
            prop="fileName"
            label="文件名称"
            min-width="300"
            align="left"
          >
            <template #default="scope">
              <div class="file-name-cell">
                <el-icon class="file-icon"><Document /></el-icon>
                <span class="file-name-text">{{ scope.row.fileName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="fileLanguage"
            label="语言"
            width="150"
            align="center"
          >
            <template #default="scope">
              <el-tag type="success" effect="plain" size="small">
                {{ scope.row.fileLanguage }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="documentType"
            label="类型"
            width="150"
            align="center"
          >
            <template #default="scope">
              <el-tag type="info" effect="plain" size="small">
                {{ scope.row.documentType }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="createTime"
            label="上传时间"
            width="180"
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
          <span>批量上传的文件将自动关联到当前设备：{{ deviceName }}</span>
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
                    <el-option
                      v-for="type in documentTypeList"
                      :key="type.id"
                      :label="type.typeName"
                      :value="type.typeName"
                    />
                  </el-select>
                </td>
                <td>
                  <el-select
                    v-model="file.language"
                    placeholder="选择语言"
                    size="small"
                  >
                    <el-option
                      v-for="lang in languageList"
                      :key="lang.id"
                      :label="lang.languageName"
                      :value="lang.languageName"
                    />
                  </el-select>
                </td>
                <td>
                  <div class="device-info">
                    <div class="input-item">
                      <label class="input-label">设备</label>
                      <el-input
                        v-model="file.deviceName"
                        placeholder="设备名称"
                        size="small"
                        disabled
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <el-upload
                    :auto-upload="false"
                    :on-change="(uploadFile) => handleFileSelect(index, uploadFile)"
                    :show-file-list="false"
                  >
                    <el-button size="small" type="primary">
                      <el-icon><UploadFilled /></el-icon>
                      {{ file.file ? file.file.name : '选择文件' }}
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
  </div>
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
  Document,
  RefreshLeft
} from "@element-plus/icons-vue";
import {
  getDeviceFileList,
  bindSelectFile,
  uploadFileList,
  getLanguageList,
  getDocumentTypeList
} from '@/api/deviceManage';
import { getCategoryList } from '@/api/fileManage';

const route = useRoute();
const router = useRouter();

// 设备信息
const deviceId = ref('');
const deviceName = ref("");

// 加载状态
const loading = ref(false);

// 搜索表单
const searchForm = reactive({
  fileName: "",
  category: "",
  language: ""
});

// 选中的文件
const selectedFiles = ref([]);
const fileTableRef = ref(null);

// 文件列表数据
const fileList = ref([]);

// 分类列表
const categoryList = ref([]);

// 语言列表
const languageList = ref([]);

// 文件类型列表
const documentTypeList = ref([]);

// 分页数据
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10
});

// 获取文件列表
const getFileList = async () => {
  loading.value = true;
  try {
    const params = {
      fileName: searchForm.fileName || undefined,
      fileType: searchForm.category || undefined,
      fileLanguage: searchForm.language || undefined
    };
    
    const res = await getDeviceFileList(params);
    
    if (res.code === 200) {
      fileList.value = res.data || [];
      pagination.total = res.data?.length || 0;
    } else {
      ElMessage.error(res.msg || '获取文件列表失败');
    }
  } catch (error) {
    console.error('获取文件列表失败:', error);
    ElMessage.error('获取文件列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取分类列表
const loadCategories = async () => {
  try {
    const res = await getCategoryList();
    if (res.code === 200) {
      categoryList.value = res.data || [];
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
};

// 获取语言列表
const loadLanguages = async () => {
  try {
    const res = await getLanguageList();
    if (res.code === 200) {
      languageList.value = res.data || [];
    }
  } catch (error) {
    console.error('获取语言列表失败:', error);
  }
};

// 获取文件类型列表
const loadDocumentTypes = async () => {
  try {
    const res = await getDocumentTypeList();
    if (res.code === 200) {
      documentTypeList.value = res.data || [];
    }
  } catch (error) {
    console.error('获取文件类型列表失败:', error);
  }
};

// 返回
const handleBack = () => {
  router.back();
};

// 取消
const handleCancel = () => {
  router.back();
};

// 保存关联
const handleSave = async () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning("请至少选择一个文件");
    return;
  }

  try {
    loading.value = true;
    
    const fileIds = selectedFiles.value.map(file => file.id);
    const res = await bindSelectFile({
      deviceId: deviceId.value,
      fileIds: fileIds
    });
    
    if (res.code === 200) {
      ElMessage.success(`成功关联 ${selectedFiles.value.length} 个文件`);
      // 返回详情页
      setTimeout(() => {
        router.back();
      }, 500);
    } else {
      ElMessage.error(res.msg || '关联失败');
    }
  } catch (error) {
    console.error('保存关联失败:', error);
    ElMessage.error('保存关联失败');
  } finally {
    loading.value = false;
  }
};

// 选择改变
const handleSelectionChange = (selection) => {
  selectedFiles.value = selection;
};

// 查询
const handleSearch = () => {
  pagination.currentPage = 1;
  getFileList();
};

// 重置
const handleReset = () => {
  searchForm.fileName = "";
  searchForm.category = "";
  searchForm.language = "";
  pagination.currentPage = 1;
  getFileList();
};

// 页码改变
const handlePageChange = (page) => {
  pagination.currentPage = page;
  getFileList();
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  getFileList();
};

// 批量上传相关
const batchUploadVisible = ref(false);
const uploadFiles = ref([
  {
    id: 1,
    fileName: "",
    fileType: "",
    language: "",
    deviceName: deviceName.value,
    file: null
  }
]);

// 打开批量上传modal
const handleBatchUpload = () => {
  // 重置上传文件列表
  uploadFiles.value = [
    {
      id: Date.now(),
      fileName: "",
      fileType: documentTypeList.value[0]?.typeName || "",
      language: languageList.value[0]?.languageName || "",
      deviceName: deviceName.value,
      file: null
    }
  ];
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
    fileType: documentTypeList.value[0]?.typeName || "",
    language: languageList.value[0]?.languageName || "",
    deviceName: deviceName.value,
    file: null
  };
  uploadFiles.value.push(newFile);
};

// 删除文件
const handleDeleteFile = (index) => {
  uploadFiles.value.splice(index, 1);
};

// 选择文件
const handleFileSelect = (index, uploadFile) => {
  uploadFiles.value[index].file = uploadFile.raw;
};

// 开始上传
const handleStartUpload = async () => {
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

  // 检查文件名是否为空
  const hasEmptyFileName = uploadFiles.value.some((file) => !file.fileName);
  if (hasEmptyFileName) {
    ElMessage.warning("请填写所有文件的名称");
    return;
  }

  try {
    loading.value = true;
    
    // 准备上传数据
    const formData = new FormData();
    uploadFiles.value.forEach((file, index) => {
      formData.append(`files[${index}]`, file.file);
      formData.append(`fileNames[${index}]`, file.fileName);
      formData.append(`fileTypes[${index}]`, file.fileType);
      formData.append(`languages[${index}]`, file.language);
    });
    formData.append('deviceId', deviceId.value);
    
    const res = await uploadFileList(formData);
    
    if (res.code === 200) {
      ElMessage.success("文件上传成功");
      batchUploadVisible.value = false;
      // 刷新文件列表
      getFileList();
    } else {
      ElMessage.error(res.msg || '上传失败');
    }
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error('上传失败');
  } finally {
    loading.value = false;
  }
};

// 初始化
onMounted(() => {
  // 从路由参数获取设备信息
  deviceId.value = route.params.fileId || route.query.deviceId;
  deviceName.value = route.query.fileName || route.query.deviceName || "未知设备";

  if (deviceId.value) {
    console.log("设备ID:", deviceId.value);
  }

  // 加载数据
  getFileList();
  loadCategories();
  loadLanguages();
  loadDocumentTypes();
});
</script>

<style lang="scss" scoped>
.link-file-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  font-size: 20px;
  padding: 8px;
  
  &:hover {
    color: #409eff;
  }
}

.header-content {
  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 4px 0;
  }

  .page-subtitle {
    font-size: 14px;
    color: #909399;
    margin: 0;

    .device-name {
      color: #409eff;
      font-weight: 500;
    }
  }
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-section {
  padding: 16px 24px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-form {
  margin: 0;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.file-table-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.file-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .file-icon {
    font-size: 18px;
    color: #409eff;
  }

  .file-name-text {
    color: #303133;
    font-weight: 500;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

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
    width: 180px;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 150px;
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

  .el-input {
    flex: 1;
  }
}

.input-label {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  min-width: 40px;
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
