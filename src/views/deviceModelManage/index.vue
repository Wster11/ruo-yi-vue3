<template>
  <div class="app-container">
    <!-- 页面标题和操作栏 -->
    <div class="title-action-container">
      <!-- 页面标题 -->
      <div class="page-title">
        <h1>设备型号管理</h1>
        <p class="subtitle">管理系统设备型号信息</p>
      </div>

      <!-- 新建按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新建型号
        </el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-form :inline="true" class="search-form">
      <el-form-item label="设备分类">
        <el-select
          v-model="searchForm.categoryId"
          placeholder="请选择设备分类"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="category in categoryList"
            :key="category.categoryId"
            :label="category.categoryName"
            :value="category.categoryId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input
          v-model="searchForm.deviceModelName"
          placeholder="请输入设备型号"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 型号表格 -->
    <div class="language-table">
      <el-table 
        :data="modelList" 
        style="width: 100%"
        v-loading="loading"
        border
        stripe
      >
        <el-table-column 
          prop="categoryName" 
          label="设备分类" 
          width="200" 
          align="left" 
        />
        <el-table-column 
          prop="deviceModelName" 
          label="设备型号" 
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

    <!-- 新建/编辑型号弹窗 -->
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
        <el-form-item label="设备分类" prop="categoryId">
          <el-select
            v-model="formData.categoryId"
            placeholder="请选择设备分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categoryList"
              :key="category.categoryId"
              :label="category.categoryName"
              :value="category.categoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModelName">
          <el-input
            v-model="formData.deviceModelName"
            placeholder="请输入设备型号，如：PLC-2000"
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
  getDeviceModelList,
  getCategoryList,
  addDeviceModel,
  editDeviceModel,
  deleteDeviceModel
} from '@/api/deviceModelManage';

// 搜索表单
const searchForm = reactive({
  categoryId: '',
  deviceModelName: ''
});

// 加载状态
const loading = ref(false);

// 型号列表
const modelList = ref([]);

// 分类列表
const categoryList = ref([]);

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
const currentModelId = ref(null);

// 对话框标题
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑型号' : '新建型号';
});

// 表单引用
const formRef = ref(null);

// 表单数据
const formData = reactive({
  categoryId: '',
  deviceModelName: '',
  remark: ''
});

// 表单验证规则
const formRules = {
  categoryId: [
    { required: true, message: '请选择设备分类', trigger: 'change' }
  ],
  deviceModelName: [
    { required: true, message: '请输入设备型号', trigger: 'blur' }
  ]
};

// 获取分类列表
const fetchCategoryList = async () => {
  try {
    const res = await getCategoryList();
    if (res.code === 200) {
      categoryList.value = res.data || [];
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
};

// 获取型号列表
const fetchModelList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      categoryId: searchForm.categoryId || undefined,
      deviceModelName: searchForm.deviceModelName || undefined
    };
    
    const res = await getDeviceModelList(params);
    
    if (res.code === 200) {
      modelList.value = res.rows || [];
      pagination.total = res.total || 0;
    } else {
      ElMessage.error(res.msg || '获取型号列表失败');
    }
  } catch (error) {
    console.error('获取型号列表失败:', error);
    ElMessage.error('获取型号列表失败');
  } finally {
    loading.value = false;
  }
};

// 查询
const handleSearch = () => {
  pagination.currentPage = 1;
  fetchModelList();
};

// 重置
const handleReset = () => {
  searchForm.categoryId = '';
  searchForm.deviceModelName = '';
  pagination.currentPage = 1;
  fetchModelList();
};

// 打开新增弹窗
const openAddDialog = () => {
  // 设置为新增模式
  isEditMode.value = false;
  currentModelId.value = null;
  
  // 重置表单数据
  formData.categoryId = '';
  formData.deviceModelName = '';
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
  formData.categoryId = row.categoryId;
  formData.deviceModelName = row.deviceModelName;
  formData.remark = row.remark || '';
  
  // 设置为编辑模式
  isEditMode.value = true;
  currentModelId.value = row.deviceModelId;
  
  // 显示弹窗
  dialogVisible.value = true;
};

// 删除型号
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除型号 "${row.deviceModelName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    loading.value = true;
    const res = await deleteDeviceModel(row.deviceModelId);
    
    if (res.code === 200) {
      ElMessage.success('删除成功');
      fetchModelList();
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除型号失败:', error);
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
          categoryId: formData.categoryId,
          deviceModelName: formData.deviceModelName,
          remark: formData.remark
        };
        
        let res;
        if (isEditMode.value) {
          submitData.deviceModelId = currentModelId.value;
          res = await editDeviceModel(submitData);
        } else {
          res = await addDeviceModel(submitData);
        }
        
        if (res.code === 200) {
          ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
          
          // 关闭弹窗
          dialogVisible.value = false;
          
          // 刷新列表
          fetchModelList();
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
  fetchModelList();
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  fetchModelList();
};

// 初始化
onMounted(() => {
  fetchCategoryList();
  fetchModelList();
});
</script>

<style lang="scss" scoped>
@use '../languageManage/index.scss';
</style>
