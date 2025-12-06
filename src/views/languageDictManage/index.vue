<template>
  <div class="app-container">
    <!-- 页面标题和操作栏 -->
    <div class="title-action-container">
      <!-- 页面标题 -->
      <div class="page-title">
        <h1>语言字典管理</h1>
        <p class="subtitle">管理系统多语言字典配置</p>
      </div>

      <!-- 新建按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新建字典
        </el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-form :inline="true" class="search-form">
      <el-form-item label="字典键">
        <el-input
          v-model="searchForm.dicKey"
          placeholder="请输入字典键"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="语言类型">
        <el-input
          v-model="searchForm.languageCode"
          placeholder="请输入语言类型"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="模块">
        <el-input
          v-model="searchForm.module"
          placeholder="请输入模块"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 字典表格 -->
    <div class="language-table">
      <el-table 
        :data="dicList" 
        style="width: 100%"
        v-loading="loading"
        border
        stripe
      >
        <el-table-column 
          prop="dicKey" 
          label="字典键" 
          width="200" 
          align="left" 
        />
        <el-table-column 
          prop="dicValue" 
          label="字典值" 
          min-width="150" 
          align="left" 
        />
        <el-table-column 
          prop="languageCode" 
          label="语言类型" 
          width="120" 
          align="center" 
        />
        <el-table-column 
          prop="languageName" 
          label="语言名称" 
          width="120" 
          align="center" 
        />
        <el-table-column 
          prop="module" 
          label="模块" 
          width="120" 
          align="center" 
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

    <!-- 新建/编辑字典弹窗 -->
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
        <el-form-item label="字典键" prop="dicKey">
          <el-input
            v-model="formData.dicKey"
            placeholder="请输入字典键，如：common.save"
            clearable
          />
        </el-form-item>
        <el-form-item label="字典值" prop="dicValue">
          <el-input
            v-model="formData.dicValue"
            placeholder="请输入字典值，如：保存"
            clearable
          />
        </el-form-item>
        <el-form-item label="语言类型" prop="languageCode">
          <el-input
            v-model="formData.languageCode"
            placeholder="请输入语言类型，如：zh-CN"
            clearable
          />
        </el-form-item>
        <el-form-item label="语言名称" prop="languageName">
          <el-input
            v-model="formData.languageName"
            placeholder="请输入语言名称，如：中文简体"
            clearable
          />
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <el-input
            v-model="formData.module"
            placeholder="请输入模块，如：common"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注"
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
  getLanguageDicList,
  addLanguageDic,
  editLanguageDic,
  deleteLanguageDic
} from '@/api/languageDicManage';

// 搜索表单
const searchForm = reactive({
  dicKey: '',
  languageCode: '',
  module: ''
});

// 加载状态
const loading = ref(false);

// 字典列表
const dicList = ref([]);

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
const currentDicId = ref(null);

// 对话框标题
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑字典' : '新建字典';
});

// 表单引用
const formRef = ref(null);

// 表单数据
const formData = reactive({
  dicKey: '',
  dicValue: '',
  languageCode: '',
  languageName: '',
  module: '',
  remark: ''
});

// 表单验证规则
const formRules = {
  dicKey: [
    { required: true, message: '请输入字典键', trigger: 'blur' }
  ],
  dicValue: [
    { required: true, message: '请输入字典值', trigger: 'blur' }
  ],
  languageCode: [
    { required: true, message: '请输入语言类型', trigger: 'blur' }
  ],
  languageName: [
    { required: true, message: '请输入语言名称', trigger: 'blur' }
  ],
  module: [
    { required: true, message: '请输入模块', trigger: 'blur' }
  ]
};

// 获取字典列表
const fetchDicList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      dicKey: searchForm.dicKey || undefined,
      languageCode: searchForm.languageCode || undefined,
      module: searchForm.module || undefined
    };
    
    const res = await getLanguageDicList(params);
    
    if (res.code === 200) {
      dicList.value = res.rows || [];
      pagination.total = res.total || 0;
    } else {
      ElMessage.error(res.msg || '获取字典列表失败');
    }
  } catch (error) {
    console.error('获取字典列表失败:', error);
    ElMessage.error('获取字典列表失败');
  } finally {
    loading.value = false;
  }
};

// 查询
const handleSearch = () => {
  pagination.currentPage = 1;
  fetchDicList();
};

// 重置
const handleReset = () => {
  searchForm.dicKey = '';
  searchForm.languageCode = '';
  searchForm.module = '';
  pagination.currentPage = 1;
  fetchDicList();
};

// 打开新增弹窗
const openAddDialog = () => {
  // 设置为新增模式
  isEditMode.value = false;
  currentDicId.value = null;
  
  // 重置表单数据
  formData.dicKey = '';
  formData.dicValue = '';
  formData.languageCode = '';
  formData.languageName = '';
  formData.module = '';
  formData.remark = '';
  
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
  formData.dicKey = row.dicKey;
  formData.dicValue = row.dicValue;
  formData.languageCode = row.languageCode;
  formData.languageName = row.languageName;
  formData.module = row.module;
  formData.remark = row.remark || '';
  
  // 设置为编辑模式
  isEditMode.value = true;
  currentDicId.value = row.languageDicId;
  
  // 显示弹窗
  dialogVisible.value = true;
};

// 删除字典
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除字典 "${row.dicKey}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    loading.value = true;
    const res = await deleteLanguageDic(row.languageDicId);
    
    if (res.code === 200) {
      ElMessage.success('删除成功');
      fetchDicList();
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除字典失败:', error);
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
          dicKey: formData.dicKey,
          dicValue: formData.dicValue,
          languageCode: formData.languageCode,
          languageName: formData.languageName,
          module: formData.module,
          remark: formData.remark
        };
        
        let res;
        if (isEditMode.value) {
          submitData.languageDicId = currentDicId.value;
          res = await editLanguageDic(submitData);
        } else {
          res = await addLanguageDic(submitData);
        }
        
        if (res.code === 200) {
          ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
          
          // 关闭弹窗
          dialogVisible.value = false;
          
          // 刷新列表
          fetchDicList();
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
  fetchDicList();
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  fetchDicList();
};

// 初始化
onMounted(() => {
  fetchDicList();
});
</script>

<style lang="scss" scoped>
@use '../languageManage/index.scss';
</style>
