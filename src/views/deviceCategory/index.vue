<template>
  <div class="app-container">
    <!-- 页面标题和操作栏 -->
    <div class="title-action-container">
      <!-- 页面标题 -->
      <div class="page-title">
        <h1>设备分类管理</h1>
        <p class="subtitle">定义设备类型及关联属性规范</p>
      </div>

      <!-- 新建分类按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新建分类
        </el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-form :inline="true" class="search-form">
      <el-form-item label="">
        <el-input
          v-model="searchQuery"
          placeholder="搜索分类名称..."
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 分类表格 -->
    <div class="category-table">
      <el-table 
        :data="categoryList" 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="分类代码" width="120" align="left">
          <template #default="scope">
            <div class="category-name">
              {{ scope.row.categoryCode }}
              <el-icon class="right-arrow"><ArrowRight /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类名称" width="180" align="left" />
        <el-table-column prop="categoryDes" label="分类描述" align="left" />
        <el-table-column
          prop="deviceCount"
          label="设备数量"
          width="100"
          align="center"
        >
          <template #default="scope">
            <el-tag type="info" size="small">{{ scope.row.deviceCount || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="attributeCount"
          label="参数数量"
          width="100"
          align="center"
        >
          <template #default="scope">
            <el-tag type="success" size="small">{{ scope.row.attributeCount || 0 }}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button
                type="primary"
                plain
                size="small"
                class="modify-btn"
                icon="Edit"
                @click="openEditDialog(scope.row)"
              >
                修改
              </el-button>
              <el-button
                type="danger"
                plain
                size="small"
                icon="Delete"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
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
    <!-- 新建/编辑设备分类弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="dialogTitle"
      width="900px"
      class="device-category-dialog"
      :center="false"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon class="section-icon"><Operation /></el-icon>
            <h3>基本信息</h3>
          </div>
          <el-divider style="margin: 8px 0 20px 0" />
          <el-form
            :model="formData"
            label-width="120px"
            class="base-info-form"
            size="default"
          >
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="分类名称" required>
                  <el-input
                    v-model="formData.categoryName"
                    placeholder="请输入分类名称"
                    style="width: 100%"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备分类描述" required>
                  <el-input
                    v-model="formData.categoryCode"
                    placeholder="请输入分类代码（如：CF、CH）"
                    style="width: 100%"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="分类描述">
                  <el-input
                    v-model="formData.categoryDesc"
                    placeholder="请输入该分类的详细描述，如：离心机 (Centrifuge)"
                    type="textarea"
                    :rows="4"
                    style="width: 100%"
                    resize="vertical"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="创建人">
                  <el-input
                    v-model="formData.creator"
                    placeholder="系统管理员"
                    readonly
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="formData.createTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%"
                    readonly
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 参数定义 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon class="section-icon"><DataAnalysis /></el-icon>
            <h3>参数定义</h3>
            <el-button
              type="success"
              size="small"
              @click="addParam"
              class="add-param-btn"
            >
              <el-icon><Plus /></el-icon>
              新增参数
            </el-button>
          </div>
          <el-divider style="margin: 8px 0 20px 0" />
          <div class="param-table-container">
            <el-table
              v-if="paramList.length > 0"
              :data="paramList"
              style="width: 100%; min-width: 750px"
              border
              size="default"
              :header-cell-style="{
                backgroundColor: '#f5f7fa',
                fontWeight: '600',
              }"
            >
              <el-table-column
                prop="index"
                label="序号"
                width="60"
                align="center"
                type="index"
              />
              <el-table-column
                prop="paramName"
                label="参数名称"
                min-width="200"
                align="center"
              >
                <template #default="scope">
                  <el-select
                    v-model="scope.row.paramName"
                    placeholder="请选择或输入参数名称"
                    size="small"
                    style="width: 180px"
                    filterable
                    allow-create
                  >
                    <el-option 
                      v-for="attr in availableAttributes" 
                      :key="attr.id" 
                      :label="attr.categoryAttributeName" 
                      :value="attr.categoryAttributeName" 
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="unit"
                label="单位"
                width="160"
                align="center"
              >
                <template #default="scope">
                  <el-input
                    v-model="scope.row.unit"
                    placeholder="如：台、kg"
                    size="small"
                    style="width: 120px"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="language"
                label="语言"
                width="160"
                align="center"
              >
                <template #default="scope">
                  <el-select
                    v-model="scope.row.language"
                    placeholder="请选择语言"
                    size="small"
                    style="width: 150px"
                  >
                    <el-option label="中文" value="zh-CN" />
                    <el-option label="English" value="en-US" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="isVisible"
                label="是否显示"
                width="100"
                align="center"
              >
                <template #default="scope">
                  <el-switch v-model="scope.row.isVisible" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button
                    type="danger"
                    size="small"
                    @click="deleteParam(scope.$index)"
                    circle
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="empty-state" v-if="paramList.length === 0">
              <el-empty description="暂无自定义参数" image-size="100">
                <el-button type="success" size="small" @click="addParam">
                  <el-icon><Plus /></el-icon>
                  新增第一个参数
                </el-button>
              </el-empty>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="default" @click="addDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            size="default" 
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
import { ref, onMounted, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Search,
  Edit,
  Delete,
  ArrowRight,
  Operation,
  DataAnalysis,
} from "@element-plus/icons-vue";
import {
  getCategoryList,
  getAttributeList,
  addCategory,
  editCategory,
  deleteCategory,
  getCategoryDetail
} from '@/api/deviceCategory';

// 搜索查询
const searchQuery = ref("");

// 加载状态
const loading = ref(false);

// 分类列表
const categoryList = ref([]);

// 分页数据
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

// 弹窗显示状态
const addDialogVisible = ref(false);

// 编辑模式标识
const isEditMode = ref(false);
const currentCategoryId = ref(null);

// 对话框标题
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑设备分类' : '新建设备分类';
});

// 表单数据
const formData = reactive({
  categoryName: "",
  categoryCode: "",
  categoryDesc: "",
  creator: "系统管理员",
  createTime: new Date(),
});

// 参数列表
const paramList = ref([]);

// 可选参数列表（从后端获取）
const availableAttributes = ref([]);

// 获取分类列表
const fetchCategoryList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      categoryName: searchQuery.value || undefined,
    };
    
    const res = await getCategoryList(params);
    
    if (res.code === 200) {
      categoryList.value = res.rows || [];
      pagination.total = res.total || 0;
    } else {
      ElMessage.error(res.msg || '获取分类列表失败');
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    ElMessage.error('获取分类列表失败');
  } finally {
    loading.value = false;
  }
};

// 查询
const handleSearch = () => {
  pagination.currentPage = 1;
  fetchCategoryList();
};

// 获取可选属性列表
const fetchAvailableAttributes = async () => {
  try {
    const res = await getAttributeList({});
    if (res.code === 200) {
      availableAttributes.value = res.data || [];
    }
  } catch (error) {
    console.error('获取属性列表失败:', error);
  }
};

// 打开新增弹窗
const openAddDialog = () => {
  // 重置表单数据
  formData.categoryName = "";
  formData.categoryCode = "";
  formData.categoryDesc = "";
  formData.createTime = new Date();
  formData.creator = "系统管理员";
  
  // 清空参数列表
  paramList.value = [];
  
  // 设置为新增模式
  isEditMode.value = false;
  currentCategoryId.value = null;
  
  // 显示弹窗
  addDialogVisible.value = true;
};

// 打开编辑弹窗
const openEditDialog = async (row) => {
  try {
    loading.value = true;
    
    // 获取分类详情
    const res = await getCategoryDetail(row.id);
    
    if (res.code === 200) {
      const detail = res.data;
      
      // 填充表单数据
      formData.categoryName = detail.categoryName || "";
      formData.categoryCode = detail.categoryCode || "";
      formData.categoryDesc = detail.categoryDes || "";
      formData.createTime = detail.createTime || new Date();
      formData.creator = detail.createBy || "系统管理员";
      
      // 填充参数列表
      if (detail.attributes && detail.attributes.length > 0) {
        paramList.value = detail.attributes.map(attr => ({
          id: attr.id,
          paramName: attr.categoryAttributeName,
          unit: attr.attributeUnit || "",
          language: "zh-CN", // 默认中文
          isVisible: true,
          attributeType: attr.attributeType,
        }));
      } else {
        paramList.value = [];
      }
      
      // 设置为编辑模式
      isEditMode.value = true;
      currentCategoryId.value = row.id;
      
      // 显示弹窗
      addDialogVisible.value = true;
    } else {
      ElMessage.error(res.msg || '获取分类详情失败');
    }
  } catch (error) {
    console.error('获取分类详情失败:', error);
    ElMessage.error('获取分类详情失败');
  } finally {
    loading.value = false;
  }
};

// 删除分类
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${row.categoryName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    loading.value = true;
    const res = await deleteCategory(row.id);
    
    if (res.code === 200) {
      ElMessage.success('删除成功');
      // 刷新列表
      fetchCategoryList();
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error);
      ElMessage.error('删除失败');
    }
  } finally {
    loading.value = false;
  }
};

// 添加参数
const addParam = () => {
  paramList.value.push({
    paramName: "",
    unit: "",
    language: "zh-CN",
    isVisible: true,
  });
};

// 删除参数
const deleteParam = (index) => {
  paramList.value.splice(index, 1);
};

// 提交表单
const submitForm = async () => {
  // 验证表单
  if (!formData.categoryName.trim()) {
    ElMessage.warning("请输入分类名称");
    return;
  }
  
  if (!formData.categoryCode.trim()) {
    ElMessage.warning("请输入设备分类描述");
    return;
  }

  // 验证参数名称
  const emptyParamName = paramList.value.find(
    (param) => !param.paramName.trim()
  );
  if (emptyParamName) {
    ElMessage.warning("请填写所有参数的名称");
    return;
  }

  try {
    loading.value = true;
    
    // 准备提交数据
    const submitData = {
      categoryName: formData.categoryName,
      categoryCode: formData.categoryCode,
      categoryDes: formData.categoryDesc,
      remark: formData.categoryDesc,
      attributes: paramList.value.map(param => ({
        categoryAttributeName: param.paramName,
        attributeUnit: param.unit,
        attributeType: param.attributeType || 'text',
        isRequired: false,
        defaultValue: '',
      })),
    };
    
    let res;
    if (isEditMode.value) {
      // 编辑模式
      submitData.id = currentCategoryId.value;
      res = await editCategory(submitData);
    } else {
      // 新增模式
      res = await addCategory(submitData);
    }
    
    if (res.code === 200) {
      ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
      
      // 关闭弹窗
      addDialogVisible.value = false;
      
      // 刷新列表
      if (isEditMode.value) {
        fetchCategoryList();
      } else {
        pagination.currentPage = 1;
        fetchCategoryList();
      }
    } else {
      ElMessage.error(res.msg || '操作失败');
    }
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('操作失败');
  } finally {
    loading.value = false;
  }
};

// 页码改变
const handlePageChange = (page) => {
  pagination.currentPage = page;
  fetchCategoryList();
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  fetchCategoryList();
};

// 初始化
onMounted(() => {
  fetchCategoryList();
  fetchAvailableAttributes();
});
</script>

<style lang="scss" scoped>
@use "./device.scss";

.category-name {
  color: var(--el-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.category-name:hover {
  color: var(--el-color-primary-light-3);
  background-color: var(--el-color-primary-light-9);
}

.category-name .right-arrow {
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 12px;
}

.category-name:hover .right-arrow {
  opacity: 1;
}
</style>
