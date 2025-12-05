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
            v-model="searchForm.categoryName"
            placeholder="全部分类"
            class="search-select"
            clearable
          >
            <el-option label="全部分类" value="" />
            <el-option
              v-for="category in categoryOptions"
              :key="category.id"
              :label="category.categoryName"
              :value="category.categoryName"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文档语言">
          <el-select
            v-model="searchForm.fileLanguage"
            placeholder="全部语言"
            class="search-select"
            clearable
          >
            <el-option label="全部语言" value="" />
            <el-option
              v-for="lang in languageOptions"
              :key="lang.id"
              :label="lang.languageName"
              :value="lang.languageName"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否关联">
          <el-select
            v-model="searchForm.isAssociated"
            placeholder="全部"
            class="search-select"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker
            v-model="searchForm.beginCreateTime"
            type="date"
            placeholder="选择日期"
            class="search-date"
            clearable
            value-format="YYYY-MM-DD"
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

        <el-table-column prop="fileLanguage" label="语言" width="140" align="center">
          <template #default="scope">
            <span>{{ scope.row.fileLanguage || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="languageCode" label="简码" width="100" align="center">
          <template #default="scope">
            <span>{{ scope.row.languageCode || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="isAssociated" label="关联" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isAssociated === '1'" type="success" size="small" effect="plain">
              <el-icon><Link /></el-icon>
              是
            </el-tag>
            <el-tag v-else type="info" size="small" effect="plain">否</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="categoryName"
          label="绑定设备分类"
          width="140"
          align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.categoryName || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="documentType"
          label="文档类型"
          width="140"
          align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.documentType || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="上传日期"
          width="180"
          align="center"
        />

        <el-table-column prop="createBy" label="上传人" width="120" align="center" />

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
                  <el-option
                    v-for="category in categoryOptions"
                    :key="category.id"
                    :label="category.categoryName"
                    :value="category.id"
                  />
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
                  <el-option
                    v-for="lang in languageOptions"
                    :key="lang.id"
                    :label="lang.languageName"
                    :value="lang.languageCode"
                  />
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
                  <el-option
                    v-for="device in deviceOptions"
                    :key="device.id"
                    :label="device.deviceName"
                    :value="device.id"
                  />
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
                  <el-option
                    v-for="docType in documentTypeOptions"
                    :key="docType.id"
                    :label="docType.typeName"
                    :value="docType.typeCode"
                  />
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
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { 
  getFileList, 
  getLanguageList, 
  getDocumentTypeList, 
  getCategoryList, 
  getDeviceList,
  addFile,
  updateFileVersion
} from '@/api/fileManage';

const router = useRouter();

// 搜索表单
const searchForm = reactive({
  fileName: "",
  categoryName: "", // 改为 categoryName 以匹配后端
  fileLanguage: "", // 改为 fileLanguage 以匹配后端
  isAssociated: "", // 改为 isAssociated 以匹配后端
  beginCreateTime: "", // 改为 beginCreateTime 以匹配后端
  endCreateTime: "", // 可选的结束时间
});

// 加载状态
const loading = ref(false);

// 文件列表数据
const fileList = ref([]);

// 分页数据
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

// 下拉列表数据
const languageOptions = ref([]);
const documentTypeOptions = ref([]);
const categoryOptions = ref([]);
const deviceOptions = ref([]);

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

  uploadFormRef.value.validate(async (valid) => {
    if (valid) {
      // 新增模式必须选择文件，更新模式文件可选
      if (!isUpdateMode.value && !uploadForm.file) {
        ElMessage.warning("请选择要上传的文件");
        return;
      }

      uploading.value = true;

      try {
        if (isUpdateMode.value) {
          // 更新模式：调用更新接口
          const params = {
            fileId: currentFileId.value,
            fileName: uploadForm.fileName,
            languageCode: uploadForm.language,
            categoryId: uploadForm.deviceCategory,
            documentTypeCode: uploadForm.fileType,
            version: uploadForm.version,
          };
          
          const res = await updateFileVersion(params);
          
          if (res.code === 200) {
            ElMessage.success("文件更新成功");
            uploadDialogVisible.value = false;
            // 刷新列表
            fetchFileList();
          } else {
            ElMessage.error(res.msg || "文件更新失败");
          }
        } else {
          // 新增模式：调用新增接口
          const formData = {
            fileName: uploadForm.fileName,
            languageCode: uploadForm.language,
            categoryId: uploadForm.deviceCategory,
            deviceId: uploadForm.linkedDevice,
            documentTypeCode: uploadForm.fileType,
            version: uploadForm.version,
            // 实际项目中需要处理文件上传
            file: uploadForm.file,
          };
          
          const res = await addFile(formData);
          
          if (res.code === 200) {
            ElMessage.success("文件上传成功");
            uploadDialogVisible.value = false;
            // 刷新列表
            pagination.currentPage = 1;
            fetchFileList();
          } else {
            ElMessage.error(res.msg || "文件上传失败");
          }
        }

        // 清空上传组件
        if (uploadRef.value) {
          uploadRef.value.clearFiles();
        }
      } catch (error) {
        console.error('提交失败:', error);
        ElMessage.error(isUpdateMode.value ? "文件更新失败" : "文件上传失败");
      } finally {
        uploading.value = false;
      }
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

// 获取文件列表
const fetchFileList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      fileName: searchForm.fileName || undefined,
      categoryName: searchForm.categoryName || undefined,
      fileLanguage: searchForm.fileLanguage || undefined,
      isAssociated: searchForm.isAssociated || undefined,
      beginCreateTime: searchForm.beginCreateTime || undefined,
      endCreateTime: searchForm.endCreateTime || undefined,
    };
    
    const res = await getFileList(params);
    
    if (res.code === 200) {
      fileList.value = res.rows || [];
      pagination.total = res.total || 0;
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

// 查询
const handleSearch = () => {
  pagination.currentPage = 1; // 重置到第一页
  fetchFileList();
};

// 重置
const handleReset = () => {
  searchForm.fileName = "";
  searchForm.categoryName = "";
  searchForm.fileLanguage = "";
  searchForm.isAssociated = "";
  searchForm.beginCreateTime = "";
  searchForm.endCreateTime = "";
  pagination.currentPage = 1;
  fetchFileList();
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
  uploadForm.deviceCategory = row.categoryId || ""; // 使用分类ID
  uploadForm.language = row.languageCode || ""; // 使用语言代码
  uploadForm.code = row.languageCode || "";
  uploadForm.linkedDevice = ""; // 如果有具体设备数据，可以在这里填充
  uploadForm.fileType = row.documentTypeCode || "MANUAL"; // 使用文档类型代码
  uploadForm.version = parseFloat(row.fileVersion?.replace('v', '')) || 1; // 解析版本号
  uploadForm.uploader = row.createBy || "系统管理员";
  uploadForm.uploadTime = row.createTime?.split(' ')[0] || new Date().toISOString().split("T")[0];
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
  fetchFileList();
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  fetchFileList();
};

// 获取语言列表
const fetchLanguageList = async () => {
  try {
    const res = await getLanguageList();
    if (res.code === 200) {
      languageOptions.value = res.data || [];
    }
  } catch (error) {
    console.error('获取语言列表失败:', error);
  }
};

// 获取文件类型列表
const fetchDocumentTypeList = async () => {
  try {
    const res = await getDocumentTypeList();
    if (res.code === 200) {
      documentTypeOptions.value = res.data || [];
    }
  } catch (error) {
    console.error('获取文件类型列表失败:', error);
  }
};

// 获取分类列表
const fetchCategoryList = async () => {
  try {
    const res = await getCategoryList();
    if (res.code === 200) {
      categoryOptions.value = res.data || [];
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
};

// 获取设备列表
const fetchDeviceList = async () => {
  try {
    const res = await getDeviceList();
    if (res.code === 200) {
      deviceOptions.value = res.data || [];
    }
  } catch (error) {
    console.error('获取设备列表失败:', error);
  }
};

// 监听语言选择，自动生成简码
watch(() => uploadForm.language, (newVal) => {
  if (newVal === 'zh-CN') {
    uploadForm.code = 'cn';
  } else if (newVal === 'en-US') {
    uploadForm.code = 'en';
  } else if (newVal === 'ja-JP') {
    uploadForm.code = 'ja';
  } else if (newVal === 'de-DE') {
    uploadForm.code = 'de';
  } else if (newVal === 'fr-FR') {
    uploadForm.code = 'fr';
  } else {
    uploadForm.code = '';
  }
});

// 初始化
onMounted(() => {
  // 加载文件列表
  fetchFileList();
  
  // 加载下拉列表数据
  fetchLanguageList();
  fetchDocumentTypeList();
  fetchCategoryList();
  fetchDeviceList();
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

