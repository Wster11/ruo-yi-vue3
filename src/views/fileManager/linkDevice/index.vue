<template>
  <div class="link-device-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button type="text" class="back-button" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-content">
          <h1 class="page-title">关联更多设备</h1>
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
            v-model="searchForm.categoryName"
            placeholder="全部"
            class="search-select"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="category in categoryOptions"
              :key="category.id"
              :label="category.categoryName"
              :value="category.categoryName"
            />
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
          prop="categoryName"
          label="分类"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.categoryName"
              type="info"
              effect="plain"
              size="small"
            >
              {{ scope.row.categoryName }}
            </el-tag>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column 
          prop="deviceModelName" 
          label="型号" 
          width="150" 
          align="center" 
        />

        <el-table-column
          prop="deviceSerialAdd"
          label="序列号"
          width="180"
          align="center"
        />

        <el-table-column
          prop="createTime"
          label="创建时间"
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
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  ArrowLeft,
  Check,
  Box,
  Search,
  RefreshLeft,
} from "@element-plus/icons-vue";
import {
  getDeviceAllList,
  bindSelectDevice,
  getCategoryList
} from '@/api/fileManage';

const route = useRoute();
const router = useRouter();

// 文件ID和名称
const fileId = ref(null);
const fileName = ref("");

// 加载状态
const loading = ref(false);

// 搜索表单
const searchForm = reactive({
  deviceName: "",
  categoryName: "", // 改为 categoryName 匹配后端
  deviceModel: "",
});

// 选中的设备
const selectedDevices = ref([]);
const deviceTableRef = ref(null);

// 分类列表
const categoryOptions = ref([]);

// 设备列表数据（从后端加载）
const deviceList = ref([]);

// 分页数据
const pagination = reactive({
  total: 0,
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

// 获取设备列表
const fetchDeviceList = async () => {
  loading.value = true;
  try {
    const params = {
      fileId: fileId.value,
    };
    
    const res = await getDeviceAllList(params);
    
    if (res.code === 200) {
      deviceList.value = res.data?.deviceList || [];
      // 如果后端返回了已绑定的设备，可以预选
      // const boundDevices = deviceList.value.filter(d => d.isBind);
      // 预选逻辑...
    } else {
      ElMessage.error(res.msg || '获取设备列表失败');
    }
  } catch (error) {
    console.error('获取设备列表失败:', error);
    ElMessage.error('获取设备列表失败');
  } finally {
    loading.value = false;
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

// 保存关联
const handleSave = async () => {
  if (selectedDevices.value.length === 0) {
    ElMessage.warning("请至少选择一个设备");
    return;
  }

  try {
    loading.value = true;
    
    // 提取设备ID列表
    const deviceIds = selectedDevices.value.map(d => d.id).join(',');
    
    const res = await bindSelectDevice({
      fileId: fileId.value,
      deviceId: deviceIds
    });
    
    if (res.code === 200) {
      ElMessage.success(`成功关联 ${selectedDevices.value.length} 个设备`);
      
      // 返回详情页
      setTimeout(() => {
        router.back();
      }, 500);
    } else {
      ElMessage.error(res.msg || '关联失败');
    }
  } catch (error) {
    console.error('关联设备失败:', error);
    ElMessage.error('关联失败');
  } finally {
    loading.value = false;
  }
};

// 选择改变
const handleSelectionChange = (selection) => {
  selectedDevices.value = selection;
};

// 查询
const handleSearch = () => {
  pagination.currentPage = 1;
  fetchDeviceList();
};

// 重置
const handleReset = () => {
  searchForm.deviceName = "";
  searchForm.categoryName = "";
  searchForm.deviceModel = "";
  pagination.currentPage = 1;
  fetchDeviceList();
};

// 页码改变
const handlePageChange = (page) => {
  pagination.currentPage = page;
  fetchDeviceList();
};

// 每页条数改变
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  fetchDeviceList();
};

// 初始化
onMounted(() => {
  // 从路由参数获取文件信息
  fileId.value = route.params.fileId || route.query.fileId;
  fileName.value = route.query.fileName || "";

  if (!fileId.value) {
    ElMessage.error('缺少文件ID参数');
    return;
  }

  // 加载数据
  fetchDeviceList();
  fetchCategoryList();
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
