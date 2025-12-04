<template>
  <div class="app-container">
    <!-- 页面标题和操作栏 -->
    <div class="title-action-container">
      <!-- 页面标题 -->
      <div class="page-title">
        <h1>文件管理</h1>
        <p class="subtitle">集中管理所有技术文档与资料</p>
      </div>

      <!-- 上传文件按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="openUploadDialog">
          <el-icon><Upload /></el-icon>
          上传文件
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选表单 -->
    <div class="search-form-container">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="文件名称">
          <el-input
            v-model="searchForm.fileName"
            placeholder="搜索文件名称..."
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
            placeholder="全部分类"
            class="search-select"
            clearable
          >
            <el-option label="全部分类" value="" />
            <el-option label="CF - 离心机" value="CF" />
            <el-option label="PM - 电力电子" value="PM" />
            <el-option label="MX - 混合设备" value="MX" />
            <el-option label="CH - 底盘" value="CH" />
          </el-select>
        </el-form-item>

        <el-form-item label="文档语言">
          <el-select
            v-model="searchForm.language"
            placeholder="全部语言"
            class="search-select"
            clearable
          >
            <el-option label="全部语言" value="" />
            <el-option label="中文（简体）" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否关联">
          <el-select
            v-model="searchForm.isLinked"
            placeholder="全部"
            class="search-select"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="true" />
            <el-option label="否" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="选择日期"
            class="search-date"
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

    <!-- 文件列表表格 -->
    <div class="file-table-container">
      <el-table
        :data="fileList"
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{
          backgroundColor: '#fafafa',
          fontWeight: '600',
          color: '#303133',
        }"
      >
        <el-table-column prop="fileName" label="文件名称" min-width="200" align="left">
          <template #default="scope">
            <div class="file-name-cell" @click="handleViewDetail(scope.row)">
              <el-icon class="file-icon"><Document /></el-icon>
              <span class="file-name-text">{{ scope.row.fileName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="language" label="语言" width="140" align="center">
          <template #default="scope">
            <span v-if="scope.row.language === 'zh-CN'">中文（简体）</span>
            <span v-else-if="scope.row.language === 'en-US'">-</span>
            <span v-else>{{ scope.row.language }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="简码" width="100" align="center" />

        <el-table-column prop="isLinked" label="关联" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isLinked" type="success" size="small" effect="plain">
              <el-icon><Link /></el-icon>
              是
            </el-tag>
            <el-tag v-else type="info" size="small" effect="plain">否</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="deviceCategory"
          label="绑定设备分类"
          width="140"
          align="center"
        />

        <el-table-column
          prop="deviceModel"
          label="绑定设备型号"
          width="140"
          align="center"
        />

        <el-table-column
          prop="uploadDate"
          label="上传日期"
          width="130"
          align="center"
        />

        <el-table-column prop="uploader" label="上传人" width="120" align="center" />

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-tooltip content="预览文件" placement="top">
                <el-button
                  type="primary"
                  text
                  @click="handlePreview(scope.row)"
                  class="action-btn"
                >
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip content="关联设备" placement="top">
                <el-button
                  type="success"
                  text
                  @click="handleLinkDevice(scope.row)"
                  class="action-btn"
                >
                  <el-icon><Connection /></el-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip content="更新文件" placement="top">
                <el-button
                  type="warning"
                  text
                  @click="handleUpdate(scope.row)"
                  class="action-btn"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
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

    <!-- 上传文件弹窗 -->
    <el-dialog
      v-model="uploadDialogVisible"
      :title="dialogTitle"
      width="1000px"
      class="upload-dialog"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <!-- 文件命名规范提示 -->
        <div class="naming-rule-tip">
          <el-icon class="tip-icon"><Document /></el-icon>
          <div class="tip-content">
            <div class="tip-title">文件命名规范</div>
            <div class="tip-text">
              格式：TD-RND-{Category}-{Seq}-{Lang} (例如: TD-RND-CF-001-cn)<br/>
              系统将自动校验分类简码与语言后缀的一致性。
            </div>
          </div>
        </div>

        <!-- 文件表单 -->
        <el-form
          :model="uploadForm"
          :rules="uploadRules"
          ref="uploadFormRef"
          label-width="130px"
          class="upload-form"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文件名称" prop="fileName" required>
                <el-input
                  v-model="uploadForm.fileName"
                  placeholder="输入文件名..."
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备分类（筛选）">
                <el-select
                  v-model="uploadForm.deviceCategory"
                  placeholder="-- 请先选择分类 --"
                  style="width: 100%"
                  clearable
                  @change="handleCategoryChange"
                >
                  <el-option label="CF - 离心机" value="CF" />
                  <el-option label="CH - 底盘" value="CH" />
                  <el-option label="IH - 感应加热" value="IH" />
                  <el-option label="PM - 电力电子" value="PM" />
                  <el-option label="MX - 混合设备" value="MX" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文档语言">
                <el-select
                  v-model="uploadForm.language"
                  placeholder="-- 选择语言 --"
                  style="width: 100%"
                  clearable
                >
                  <el-option label="中文（简体）" value="zh-CN" />
                  <el-option label="English" value="en-US" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="语言简码">
                <el-input
                  v-model="uploadForm.code"
                  placeholder="自动生成"
                  readonly
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="关联设备名称">
                <el-select
                  v-model="uploadForm.linkedDevice"
                  placeholder="-- 选择具体设备 --"
                  style="width: 100%"
                  clearable
                  :disabled="!uploadForm.deviceCategory"
                >
                  <el-option label="设备示例-1" value="device-1" />
                  <el-option label="设备示例-2" value="device-2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件类型">
                <el-select
                  v-model="uploadForm.fileType"
                  placeholder="操作手册"
                  style="width: 100%"
                >
                  <el-option label="操作手册" value="操作手册" />
                  <el-option label="技术文档" value="技术文档" />
                  <el-option label="使用说明" value="使用说明" />
                  <el-option label="维护手册" value="维护手册" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="版本号">
                <el-input
                  v-model.number="uploadForm.version"
                  placeholder="v1.0"
                  type="number"
                  :min="1"
                  :step="1"
                  @input="handleVersionInput"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上传人">
                <el-input
                  v-model="uploadForm.uploader"
                  placeholder="系统管理员"
                  readonly
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上传时间">
                <el-input
                  v-model="uploadForm.uploadTime"
                  placeholder="2025-12-04"
                  readonly
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="footer-left">
            <el-upload
              ref="uploadRef"
              class="file-select-upload"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              :show-file-list="false"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            >
              <el-button size="default">
                <el-icon><Document /></el-icon>
                选择文件
              </el-button>
            </el-upload>
            <span v-if="uploadForm.file" class="file-name-display">
              {{ uploadForm.file.name }}
            </span>
          </div>
          <div class="footer-right">
            <el-button size="default" @click="uploadDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              size="default" 
              @click="handleUploadSubmit" 
              :loading="uploading"
            >
              <el-icon v-if="isUpdateMode"><Check /></el-icon>
              <el-icon v-else><Upload /></el-icon>
              {{ isUpdateMode ? '确认更新' : '确认上传' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();

// 搜索表单
const searchForm = reactive({
  fileName: "",
  deviceCategory: "",
  language: "",
  isLinked: "",
  startDate: "",
});

// 加载状态
const loading = ref(false);

// 文件列表数据
const fileList = ref([
  {
    id: 1,
    fileName: "TD-RND-CF-001-cn",
    language: "zh-CN",
    code: "cn",
    isLinked: true,
    deviceCategory: "CF",
    deviceModel: "CF-5000",
    uploadDate: "2024-01-20",
    uploader: "Admin",
  },
  {
    id: 2,
    fileName: "TD-RND-CF-001-en",
    language: "en-US",
    code: "en",
    isLinked: true,
    deviceCategory: "CF",
    deviceModel: "CF-5000",
    uploadDate: "2024-01-20",
    uploader: "Admin",
  },
  {
    id: 3,
    fileName: "TD-RND-PM-001-cn",
    language: "zh-CN",
    code: "cn",
    isLinked: true,
    deviceCategory: "PM",
    deviceModel: "PM-3000",
    uploadDate: "2024-01-21",
    uploader: "Admin",
  },
  {
    id: 4,
    fileName: "TD-RND-MX-001-cn",
    language: "zh-CN",
    code: "cn",
    isLinked: true,
    deviceCategory: "MX",
    deviceModel: "MX-2000",
    uploadDate: "2024-01-22",
    uploader: "Admin",
  },
]);

// 分页数据
const pagination = reactive({
  total: 4,
  currentPage: 1,
  pageSize: 10,
});

// 上传弹窗
const uploadDialogVisible = ref(false);
const uploading = ref(false);
const uploadFormRef = ref(null);
const uploadRef = ref(null);
const dialogTitle = ref("上传文件");
const isUpdateMode = ref(false);
const currentFileId = ref(null);

// 上传表单
const uploadForm = reactive({
  fileName: "",
  deviceCategory: "",
  language: "",
  code: "",
  linkedDevice: "",
  fileType: "操作手册",
  version: 1,
  uploader: "系统管理员",
  uploadTime: new Date().toISOString().split("T")[0],
  file: null,
});

// 文件名称校验器
const validateFileName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入文件名称"));
    return;
  }

  // 检查是否以 TD-RND- 开头
  if (value.startsWith("TD-RND-")) {
    // 提取 Category 部分，格式：TD-RND-{Category}-...
    const match = value.match(/^TD-RND-([A-Z]+)-/);
    
    if (!match) {
      callback(new Error("文件名格式不正确，应为：TD-RND-{Category}-{Seq}-{Lang}"));
      return;
    }

    const categoryInFileName = match[1];
    
    // 检查是否选择了设备分类
    if (!uploadForm.deviceCategory) {
      callback(new Error("请先选择设备分类"));
      return;
    }

    // 检查文件名中的分类与选择的设备分类是否一致
    if (categoryInFileName !== uploadForm.deviceCategory) {
      callback(new Error(`文件名中的分类 "${categoryInFileName}" 与所选设备分类 "${uploadForm.deviceCategory}" 不一致`));
      return;
    }
  }

  callback();
};

// 表单验证规则
const uploadRules = {
  fileName: [
    { required: true, message: "请输入文件名称", trigger: "blur" },
    { validator: validateFileName, trigger: "blur" }
  ],
  language: [{ required: true, message: "请选择文档语言", trigger: "change" }],
  code: [{ required: true, message: "请输入简码", trigger: "blur" }],
  deviceCategory: [
    { required: true, message: "请选择设备分类", trigger: "change" },
  ],
};


// 打开上传弹窗
const openUploadDialog = () => {
  // 重置表单
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields();
  }
  uploadForm.fileName = "";
  uploadForm.deviceCategory = "";
  uploadForm.language = "";
  uploadForm.code = "";
  uploadForm.linkedDevice = "";
  uploadForm.fileType = "操作手册";
  uploadForm.version = 1;
  uploadForm.uploader = "系统管理员";
  uploadForm.uploadTime = new Date().toISOString().split("T")[0];
  uploadForm.file = null;

  dialogTitle.value = "上传文件";
  isUpdateMode.value = false;
  currentFileId.value = null;
  uploadDialogVisible.value = true;
};

// 设备分类改变
const handleCategoryChange = (value) => {
  // 分类改变时清空关联设备
  uploadForm.linkedDevice = "";
  
  // 重新校验文件名称（如果文件名已填写）
  if (uploadForm.fileName && uploadFormRef.value) {
    uploadFormRef.value.validateField("fileName");
  }
};

// 文件改变
const handleFileChange = (file) => {
  uploadForm.file = file;
  // 自动填充文件名
  if (!uploadForm.fileName) {
    const fileName = file.name.substring(0, file.name.lastIndexOf("."));
    uploadForm.fileName = fileName;
  }
};

// 文件超出限制
const handleExceed = () => {
  ElMessage.warning("最多只能上传1个文件");
};

// 版本号输入处理
const handleVersionInput = (value) => {
  // 确保只接受正整数
  if (value !== '' && value !== null) {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      uploadForm.version = 1;
    } else {
      uploadForm.version = Math.floor(num); // 确保是整数
    }
  }
};

// 提交上传
const handleUploadSubmit = async () => {
  if (!uploadFormRef.value) return;

  await uploadFormRef.value.validate((valid) => {
    if (valid) {
      // 新增模式必须选择文件，更新模式文件可选
      if (!isUpdateMode.value && !uploadForm.file) {
        ElMessage.warning("请选择要上传的文件");
        return;
      }

      uploading.value = true;

      // 模拟上传/更新
      setTimeout(() => {
        if (isUpdateMode.value) {
          // 更新模式：更新现有文件
          const index = fileList.value.findIndex((item) => item.id === currentFileId.value);
          if (index > -1) {
            fileList.value[index] = {
              ...fileList.value[index],
              fileName: uploadForm.fileName,
              language: uploadForm.language,
              code: uploadForm.code,
              isLinked: uploadForm.deviceCategory ? true : false,
              deviceCategory: uploadForm.deviceCategory,
              uploadDate: uploadForm.uploadTime,
              uploader: uploadForm.uploader,
            };
            ElMessage.success("文件更新成功");
          }
        } else {
          // 新增模式：添加到列表
          fileList.value.unshift({
            id: fileList.value.length + 1,
            fileName: uploadForm.fileName,
            language: uploadForm.language,
            code: uploadForm.code,
            isLinked: uploadForm.deviceCategory ? true : false,
            deviceCategory: uploadForm.deviceCategory,
            uploadDate: new Date().toISOString().split("T")[0],
            uploader: "Admin",
          });
          pagination.total = fileList.value.length;
          ElMessage.success("文件上传成功");
        }

        uploading.value = false;
        uploadDialogVisible.value = false;

        // 清空上传组件
        if (uploadRef.value) {
          uploadRef.value.clearFiles();
        }
      }, 1500);
    }
  });
};

// 查看详情
const handleViewDetail = (row) => {
  router.push({
    name: "FileDetail",
    params: { id: row.id },
    query: { fileName: row.fileName },
  });
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
  searchForm.fileName = "";
  searchForm.deviceCategory = "";
  searchForm.language = "";
  searchForm.isLinked = "";
  searchForm.startDate = "";
  ElMessage.info("已重置搜索条件");
};

// 预览文件
const handlePreview = (row) => {
  // 这里可以根据文件类型打开不同的预览方式
  // 示例：在新窗口打开文件预览
  const previewUrl = `https://example.com/preview/${row.id}`;
  window.open(previewUrl, '_blank');
  
  // 或者打开一个预览对话框
  ElMessage.info(`正在打开文件预览: ${row.fileName}`);
};

// 关联设备
const handleLinkDevice = (row) => {
  router.push({
    name: "LinkDevice",
    params: { fileId: row.id },
    query: { fileName: row.fileName },
  });
};

// 更新文件
const handleUpdate = (row) => {
  // 重置表单
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields();
  }

  // 填充表单数据
  uploadForm.fileName = row.fileName;
  uploadForm.deviceCategory = row.deviceCategory;
  uploadForm.language = row.language;
  uploadForm.code = row.code;
  uploadForm.linkedDevice = ""; // 如果有具体设备数据，可以在这里填充
  uploadForm.fileType = "操作手册"; // 如果表格有该字段，使用 row.fileType
  uploadForm.version = row.version || 1; // 如果表格有该字段，使用 row.version
  uploadForm.uploader = row.uploader || "系统管理员";
  uploadForm.uploadTime = row.uploadDate || new Date().toISOString().split("T")[0];
  uploadForm.file = null; // 更新时文件可选

  // 设置为更新模式
  dialogTitle.value = "更新文件";
  isUpdateMode.value = true;
  currentFileId.value = row.id;
  uploadDialogVisible.value = true;
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

// 初始化
onMounted(() => {
  // 可以在这里加载数据
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

