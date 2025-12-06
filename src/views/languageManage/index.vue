<template>
  <div class="app-container">
    <!-- 页面标题和操作栏 -->
    <div class="title-action-container">
      <!-- 页面标题 -->
      <div class="page-title">
        <h1>语言管理</h1>
        <p class="subtitle">管理系统支持的语言类型及其描述</p>
      </div>

      <!-- 新建按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新建语言
        </el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-form :inline="true" class="search-form">
      <el-form-item label="语言类型">
        <el-input
          v-model="searchForm.languageCode"
          placeholder="请输入语言类型"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="语言描述">
        <el-input
          v-model="searchForm.languageName"
          placeholder="请输入语言描述"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 语言表格 -->
    <div class="language-table">
      <el-table 
        :data="languageList" 
        style="width: 100%"
        v-loading="loading"
        border
        stripe
      >
        <el-table-column 
          prop="languageCode" 
          label="语言类型" 
          width="150" 
          align="center" 
        />
        <el-table-column 
          prop="languageName" 
          label="语言描述" 
          min-width="200" 
          align="left" 
        />
        <el-table-column 
          prop="chineseStr" 
          label="中文解释" 
          min-width="200" 
          align="left" 
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
          align="center"
        />
        <el-table-column
          prop="createBy"
          label="创建人"
          width="120"
          align="center"
        />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-tooltip content="修改" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  circle
                  @click="openEditDialog(scope.row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="danger"
                  size="small"
                  circle
                  @click="handleDelete(scope.row)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
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

    <!-- 新建/编辑语言弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="120px"
      >
        <el-form-item label="语言类型" prop="languageCode">
          <el-input
            v-model="formData.languageCode"
            placeholder="请输入语言类型，如：zh-CN、en-US"
            clearable
          />
        </el-form-item>
        <el-form-item label="语言描述" prop="languageName">
          <el-input
            v-model="formData.languageName"
            placeholder="请输入语言描述，如：中文、English"
            clearable
          />
        </el-form-item>
        <el-form-item label="中文解释" prop="chineseStr">
          <el-input
            v-model="formData.chineseStr"
            placeholder="请输入中文解释"
            type="textarea"
            :rows="3"
            clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitForm"
            :loading="loading"
          >
            {{ isEditMode ? '保存修改' : '提交保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue';
import {
  getLanguageList,
  addLanguage,
  editLanguage,
  deleteLanguage
} from '@/api/languageManage';


// 搜索表单
const searchForm = reactive({
  languageCode: '',
  languageName: ''
});

// 加载状态
const loading = ref(false);

// 语言列表
const languageList = ref([]);

// 分页数据
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

// 弹窗显示状态
const dialogVisible = ref(false);

// 编辑模式标识
const isEditMode = ref(false);
const currentLanguageId = ref(null);

// 对话框标题
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑语言' : '新建语言';
});

// 表单引用
const formRef = ref(null);

// 表单数据
const formData = reactive({
  languageCode: '',
  languageName: '',
  chineseStr: ''
});

// 表单验证规则
const formRules = {
  languageCode: [
    { required: true, message: '请输入语言类型', trigger: 'blur' }
  ],
  languageName: [
    { required: true, message: '请输入语言描述', trigger: 'blur' }
  ],
  chineseStr: [
    { required: true, message: '请输入中文解释', trigger: 'blur' }
  ]
};

// 获取语言列表
const fetchLanguageList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      languageCode: searchForm.languageCode || undefined,
      languageName: searchForm.languageName || undefined
    };
    
    const res = await getLanguageList(params);
    
    if (res.code === 200) {
      languageList.value = res.rows || [];
      pagination.total = res.total || 0;
    } else {
      ElMessage.error(res.msg || '获取语言列表失败');
    }
  } catch (error) {
    console.error('获取语言列表失败:', error);
    ElMessage.error('获取语言列表失败');
  } finally {
    loading.value = false;
  }
};

// 查询
const handleSearch = () => {
  pagination.currentPage = 1;
  fetchLanguageList();
};

// 重置
const handleReset = () => {
  searchForm.languageCode = '';
  searchForm.languageName = '';
  pagination.currentPage = 1;
  fetchLanguageList();
};

// 打开新增弹窗
const openAddDialog = () => {
  // 设置为新增模式
  isEditMode.value = false;
  currentLanguageId.value = null;
  
  // 重置表单数据
  formData.languageCode = '';
  formData.languageName = '';
  formData.chineseStr = '';
  
  // 显示弹窗
  dialogVisible.value = true;
  
  // 使用 nextTick 确保弹窗已渲染后再重置表单验证
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate();
    }
  });
};

// 打开编辑弹窗
const openEditDialog = (row) => {
  // 填充表单数据
  formData.languageCode = row.languageCode;
  formData.languageName = row.languageName;
  formData.chineseStr = row.chineseStr;
  
  // 设置为编辑模式
  isEditMode.value = true;
  currentLanguageId.value = row.languageId;
  
  // 显示弹窗
  dialogVisible.value = true;
};

// 删除语言
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除语言 "${row.languageName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    loading.value = true;
    const res = await deleteLanguage(row.languageId);
    
    if (res.code === 200) {
      ElMessage.success('删除成功');
      fetchLanguageList();
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除语言失败:', error);
      ElMessage.error('删除失败');
    }
  } finally {
    loading.value = false;
  }
};

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        
        const submitData = {
          languageCode: formData.languageCode,
          languageName: formData.languageName,
          chineseStr: formData.chineseStr
        };
        
        let res;
        if (isEditMode.value) {
          submitData.languageId = currentLanguageId.value;
          res = await editLanguage(submitData);
        } else {
          res = await addLanguage(submitData);
        }
        
        if (res.code === 200) {
          ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
          
          // 关闭弹窗
          dialogVisible.value = false;
          
          // 刷新列表
          fetchLanguageList();
        } else {
          ElMessage.error(res.msg || '操作失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        ElMessage.error('操作失败');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 页码改变
const handlePageChange = (page) => {
  pagination.currentPage = page;
  fetchLanguageList();
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  fetchLanguageList();
};

// 初始化
onMounted(() => {
  fetchLanguageList();
});
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
