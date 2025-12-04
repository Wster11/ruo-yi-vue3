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
          <p class="page-subtitle">当前文件: <span class="file-name">{{ fileName }}</span></p>
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
        
        <el-table-column prop="deviceName" label="设备名称" min-width="180" align="left">
          <template #default="scope">
            <div class="device-name-cell">
              <el-icon class="device-icon"><Box /></el-icon>
              <span class="device-name-text">{{ scope.row.deviceName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="分类" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.category" type="info" effect="plain" size="small">
              {{ scope.row.category }}
            </el-tag>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="model" label="型号" width="150" align="center" />

        <el-table-column prop="serialNumber" label="序列号" width="180" align="center" />

        <el-table-column prop="createTime" label="创建时间" width="150" align="center" />
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
</style>

