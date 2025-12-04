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
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 分类表格 -->
    <div class="category-table">
      <el-table :data="categoryList" style="width: 100%">
        <el-table-column label="分类名称" width="100" align="left">
          <template #default="scope">
            <div class="category-name">
              {{ scope.row.code }}
              <el-icon class="right-arrow"><ArrowRight /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类描述" align="left" />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
          align="center"
        />
        <el-table-column
          prop="creator"
          label="创建人"
          width="120"
          align="center"
        />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button
                type="primary"
                plain
                size="small"
                class="modify-btn"
                icon="Edit"
              >
                修改
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
    <!-- 新建设备分类弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新建设备分类"
      width="900px"
      class="device-category-dialog"
      :center="false"
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
                    <el-option label="长度" value="长度" />
                    <el-option label="宽度" value="宽度" />
                    <el-option label="高度" value="高度" />
                    <el-option label="重量" value="重量" />
                    <el-option label="功率" value="功率" />
                    <el-option label="电压" value="电压" />
                    <el-option label="电流" value="电流" />
                    <el-option label="温度" value="温度" />
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
          <el-button size="default" @click="addDialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" size="default" @click="submitForm"
            >提交保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import {
  Plus,
  Search,
  Edit,
  Delete,
  ArrowRight,
  Operation,
  DataAnalysis,
} from "@element-plus/icons-vue";

// 搜索查询
const searchQuery = ref("");

// 分类列表
const categoryList = ref([
  {
    code: "CF",
    name: "离心机 (Centrifuge)",
    createTime: "2023-01-01",
    creator: "系统管理员",
  },
  {
    code: "CH",
    name: "底盘 (Chassis)",
    createTime: "2023-01-01",
    creator: "系统管理员",
  },
  {
    code: "IH",
    name: "感应加热 (Induction Heating)",
    createTime: "2023-01-01",
    creator: "系统管理员",
  },
  {
    code: "PE",
    name: "电力电子 (Power Electronics)",
    createTime: "2023-01-01",
    creator: "系统管理员",
  },
  {
    code: "SA",
    name: "频谱分析仪 (Spectrum Analyzer)",
    createTime: "2023-01-01",
    creator: "系统管理员",
  },
]);

// 弹窗显示状态
const addDialogVisible = ref(false);

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

// 打开新增弹窗
const openAddDialog = () => {
  // 重置表单数据
  formData.categoryName = "";
  formData.categoryDesc = "";
  formData.createTime = new Date();
  // 清空参数列表
  paramList.value = [];
  // 显示弹窗
  addDialogVisible.value = true;
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
const submitForm = () => {
  // 验证表单
  if (!formData.categoryName.trim()) {
    ElMessage.warning("请输入分类名称");
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

  // 模拟提交数据
  console.log("表单数据:", formData);
  console.log("参数列表:", paramList.value);

  // 关闭弹窗
  addDialogVisible.value = false;

  // 显示成功消息
  ElMessage.success("设备分类创建成功");
};
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
