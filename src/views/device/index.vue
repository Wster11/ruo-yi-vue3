<template>
  <div class="app-container">
    <!-- 页面标题和操作栏 -->
    <div class="title-action-container">
      <!-- 页面标题 -->
      <div class="page-title">
        <h1>设备管理</h1>
        <p class="subtitle">监控设备状态管理文档关联</p>
      </div>

      <!-- 新建设备按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新建设备
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="设备分类">
          <el-input
            v-model="searchForm.deviceCategory"
            placeholder="分类名称"
          />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.deviceName" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="searchForm.deviceModel" placeholder="型号" />
        </el-form-item>
        <el-form-item label="关联文档">
          <el-select v-model="searchForm.relatedDoc" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="是" value="true" />
            <el-option label="否" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="年/月/日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="年/月/日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 设备列表表格 -->

    <el-table
      v-loading="loading"
      :data="deviceList"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column label="设备名称" width="140">
        <template #default="scope">
          <div class="device-name">
            <router-link
              :to="`/device/detail/${scope.row.id}`"
              class="device-name-link"
            >
              {{ scope.row.deviceName }}
            </router-link>
            <el-icon class="right-arrow"><ArrowRight /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceCategory"
        label="设备分类"
        width="80"
        align="center"
      />
      <el-table-column
        prop="deviceModel"
        label="设备型号"
        width="120"
        align="center"
      />
      <el-table-column
        prop="serialNumber"
        label="序列号"
        width="150"
        align="center"
      />
      <el-table-column
        prop="relatedDoc"
        label="关联文档"
        width="100"
        align="center"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.relatedDoc ? 'success' : 'danger'"
            effect="light"
          >
            {{ scope.row.relatedDoc ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
        align="center"
      />
      <el-table-column
        prop="creator"
        label="创建人"
        width="100"
        align="center"
      />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            @click="handleQrCode(scope.row)"
          >
            <el-icon><View /></el-icon> 二维码
          </el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon> 修改
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="handleRelate(scope.row)"
          >
            <el-icon><Link /></el-icon> 关联
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新建设备弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      class="device-dialog"
    >
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="120px"
      >
        <!-- 基本信息分组 -->
        <div class="form-group">
          <div class="group-title">
            <el-tag type="primary" size="small">Group 1</el-tag>
            <h3>基本信息</h3>
          </div>
          <div class="form-row">
            <el-form-item label="设备分类" prop="deviceCategory">
              <el-select
                v-model="formData.deviceCategory"
                placeholder="-- 请选择分类 --"
                @change="handleCategoryChange"
                style="width: 100%"
              >
                <el-option
                  v-for="category in deviceCategories"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="设备编码"
              prop="deviceModel"
              :disabled="!formData.deviceCategory"
            >
              <el-select
                v-model="formData.deviceModel"
                placeholder="请输入或选择编码"
                @change="handleModelChange"
                style="width: 100%"
              >
                <el-option
                  v-for="model in filteredModels"
                  :key="model.value"
                  :label="model.label"
                  :value="model.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称(自动)">
              <el-input
                v-model="formData.deviceName"
                placeholder="自动生成"
                readonly
                disabled
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item
              label="设备版本号"
              :disabled="!formData.deviceCategory"
            >
              <el-input
                v-model="formData.deviceVersion"
                placeholder="如 v1.0"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="设备型号"
              prop="serialNumber"
              :disabled="!formData.deviceCategory"
            >
              <el-select
                v-model="formData.serialNumber"
                placeholder="请输入或选择设备型号"
                @change="handleSerialNumberChange"
                style="width: 100%"
                filterable
                allow-create
              >
                <el-option
                  v-for="model in filteredModels"
                  :key="model.value"
                  :label="model.label"
                  :value="model.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <!-- 设备参数设置分组 -->
        <div class="form-group">
          <div class="group-title">
            <el-tag type="warning" size="small">Group 2</el-tag>
            <h3>设备参数设置</h3>
          </div>
          <div class="param-settings">
            <div v-if="!formData.deviceCategory" class="param-hint">
              <el-tag type="warning" effect="light">
                请先选择分类以加载参数
              </el-tag>
            </div>
            <div v-else-if="currentParams.length === 0" class="no-params">
              <el-empty description="该分类暂无参数定义" image-size="100" />
            </div>
            <div v-else class="params-container">
              <div
                v-for="(param, index) in currentParams"
                :key="index"
                class="param-item"
              >
                <div class="param-header">
                  <span class="param-name">{{ param.paramName }}</span>
                  <el-tag type="success" size="small" effect="light"
                    >Visible</el-tag
                  >
                </div>
                <div class="param-input-group">
                  <el-input
                    v-model="param.paramValue"
                    placeholder="输入参数值"
                    style="width: 200px"
                  />
                  <span class="param-unit">{{ param.unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 二维码配置分组 -->
        <div class="form-group">
          <div class="group-title">
            <el-tag type="info" size="small">Group 4</el-tag>
            <h3>二维码配置</h3>
            <span class="immutable-hint">生成后不可变</span>
          </div>
          <div class="qr-code-container">
            <div class="qr-preview">
              <!-- 二维码预览区域 -->
              <div class="qr-placeholder">
                <div class="qr-dot-container">
                  <div class="qr-dot"></div>
                  <div class="qr-dot"></div>
                  <div class="qr-dot"></div>
                  <div class="qr-dot"></div>
                </div>
              </div>
            </div>
            <div class="qr-form">
              <el-form-item label="序列化地址(自动生成)">
                <el-input
                  v-model="qrConfig.serializedAddress"
                  placeholder="待输入设备名称和SN以生成..."
                  readonly
                  disabled
                />
              </el-form-item>
              <el-form-item label="二维码描述信息">
                <el-input
                  v-model="qrConfig.description"
                  placeholder="请输入扫描二维码后显示的描述信息"
                  type="textarea"
                  rows="2"
                  :disabled="!formData.deviceCategory"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 二维码下载弹窗 -->
    <el-dialog
      v-model="qrDialogVisible"
      title="下载二维码"
      width="400px"
      :close-on-click-modal="false"
      class="qr-download-dialog"
    >
      <div class="qr-download-container">
        <!-- 二维码预览 -->
        <div class="qr-code-preview">
          <div class="qr-placeholder">
            <div class="qr-dot-container">
              <div class="qr-dot"></div>
              <div class="qr-dot"></div>
              <div class="qr-dot"></div>
              <div class="qr-dot"></div>
            </div>
          </div>
          <!-- 设备信息 -->
          <div class="device-info">
            <div class="device-name">{{ qrDialogData.deviceName }}</div>
            <div class="serial-number">{{ qrDialogData.serialNumber }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="qrDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDownloadQrCode">
            <el-icon><Download /></el-icon> 下载
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Search,
  View,
  Edit,
  Link,
  Delete,
  ArrowRight,
  Download,
} from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

// 搜索表单数据
const searchForm = reactive({
  deviceCategory: "",
  deviceName: "",
  deviceModel: "",
  relatedDoc: "",
  startDate: "",
  endDate: "",
});

// 表格数据
const deviceList = ref([]);
const loading = ref(false);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);

// 弹窗数据
const dialogVisible = ref(false);
const dialogTitle = ref("新建设备");
const formRef = ref(null);
const formData = reactive({
  deviceName: "",
  deviceCategory: "",
  deviceModel: "",
  deviceVersion: "v1.0",
  serialNumber: "",
  relatedDoc: false,
  createTime: "",
  creator: "",
});

// 二维码配置
const qrConfig = reactive({
  serializedAddress: "",
  description: "",
});

// 设备分类列表
const deviceCategories = ref([
  { value: "CF", label: "离心机" },
  { value: "CH", label: "底盘" },
  { value: "IH", label: "感应加热" },
  { value: "PE", label: "电力电子" },
  { value: "SA", label: "频谱分析仪" },
]);

// 设备型号列表（按分类分组）
const deviceModels = ref([
  { category: "CF", value: "CF-200", label: "CF-200" },
  { category: "CF", value: "CF-300", label: "CF-300" },
  { category: "CH", value: "CH-Alpha", label: "CH-Alpha" },
  { category: "CH", value: "CH-Beta", label: "CH-Beta" },
  { category: "IH", value: "IH-Core", label: "IH-Core" },
  { category: "PE", value: "PE-Unit", label: "PE-Unit" },
  { category: "SA", value: "SA-Scope", label: "SA-Scope" },
]);

// 过滤后的型号列表
const filteredModels = ref([]);

// 设备参数定义（按分类分组）
const deviceParams = ref([
  {
    category: "CF",
    params: [
      {
        paramName: "转速",
        paramValue: "",
        unit: "rpm",
        description: "设备最大转速",
      },
      {
        paramName: "容量",
        paramValue: "",
        unit: "ml",
        description: "设备最大容量",
      },
      {
        paramName: "温度范围",
        paramValue: "",
        unit: "°C",
        description: "工作温度范围",
      },
    ],
  },
  {
    category: "CH",
    params: [
      {
        paramName: "尺寸",
        paramValue: "",
        unit: "mm",
        description: "底盘尺寸",
      },
      {
        paramName: "重量",
        paramValue: "",
        unit: "kg",
        description: "底盘重量",
      },
      { paramName: "材质", paramValue: "", unit: "", description: "底盘材质" },
    ],
  },
]);

// 当前参数列表
const currentParams = ref([]);

// 二维码下载弹窗数据
const qrDialogVisible = ref(false);
const qrDialogData = reactive({
  deviceName: "",
  serialNumber: "",
  serializedAddress: "",
});

// 表单验证规则
const formRules = reactive({
  deviceCategory: [
    { required: true, message: "请选择设备分类", trigger: "change" },
  ],
  deviceModel: [
    { required: true, message: "请选择设备型号", trigger: "change" },
  ],
  serialNumber: [
    { required: true, message: "请输入设备序列号", trigger: "blur" },
  ],
});

// 获取设备列表
const getDeviceList = () => {
  loading.value = true;
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    const mockData = [
      {
        deviceName: "CF-200-1",
        deviceCategory: "CF",
        deviceModel: "CF-200",
        serialNumber: "SN2023001",
        relatedDoc: true,
        createTime: "2023-10-15",
        creator: "张三",
        id: 1,
      },
      {
        deviceName: "CH-Alpha-1",
        deviceCategory: "CH",
        deviceModel: "CH-Alpha",
        serialNumber: "SN2023002",
        relatedDoc: false,
        createTime: "2023-11-01",
        creator: "李四",
        id: 2,
      },
      {
        deviceName: "IH-Core-1",
        deviceCategory: "IH",
        deviceModel: "IH-Core",
        serialNumber: "SN2023003",
        relatedDoc: false,
        createTime: "2023-12-20",
        creator: "王五",
        id: 3,
      },
      {
        deviceName: "PE-Unit-1",
        deviceCategory: "PE",
        deviceModel: "PE-Unit",
        serialNumber: "SN2024001",
        relatedDoc: false,
        createTime: "2024-03-01",
        creator: "张三",
        id: 4,
      },
      {
        deviceName: "SA-Scope-1",
        deviceCategory: "SA",
        deviceModel: "SA-Scope",
        serialNumber: "SN2022001",
        relatedDoc: false,
        createTime: "2022-05-20",
        creator: "赵六",
        id: 5,
      },
    ];
    deviceList.value = mockData;
    total.value = mockData.length;
    loading.value = false;
  }, 500);
};

// 查询设备
const handleSearch = () => {
  pageNum.value = 1;
  getDeviceList();
};

// 重置搜索条件
const handleReset = () => {
  Object.assign(searchForm, {
    deviceCategory: "",
    deviceName: "",
    deviceModel: "",
    relatedDoc: "",
    startDate: "",
    endDate: "",
  });
  pageNum.value = 1;
  getDeviceList();
};

// 生成设备名称和二维码序列化地址
const generateDeviceName = () => {
  if (formData.deviceModel && formData.serialNumber) {
    // 设备名称 = 设备分类 + '-' + 设备编码
    formData.deviceName = `${formData.deviceCategory}-${formData.serialNumber}`;
    // 生成序列化地址
    qrConfig.serializedAddress = `device://${formData.deviceCategory}/${formData.deviceModel}/${formData.serialNumber}`;
    // 自动生成二维码描述信息 BP+设备名称
    qrConfig.description = `BP-${formData.deviceName}`;
  } else {
    formData.deviceName = "";
    qrConfig.serializedAddress = "";
    qrConfig.description = "";
  }
};

// 处理分类变化
const handleCategoryChange = () => {
  // 过滤对应分类的型号
  filteredModels.value = deviceModels.value.filter(
    (model) => model.category === formData.deviceCategory
  );
  // 清空型号和设备名称
  formData.deviceModel = "";
  formData.deviceName = "";
  // 加载对应分类的参数
  const categoryParams = deviceParams.value.find(
    (item) => item.category === formData.deviceCategory
  );
  currentParams.value = categoryParams
    ? JSON.parse(JSON.stringify(categoryParams.params))
    : [];
};

// 处理型号变化
const handleModelChange = () => {
  generateDeviceName();
};

// 处理设备型号变化
const handleSerialNumberChange = () => {
  generateDeviceName();
};

// 新建设备
const handleAdd = () => {
  dialogTitle.value = "新建设备";
  Object.assign(formData, {
    deviceName: "",
    deviceCategory: "",
    deviceModel: "",
    deviceVersion: "v1.0",
    serialNumber: "",
    relatedDoc: false,
    createTime: "",
    creator: "",
  });
  // 重置二维码配置
  Object.assign(qrConfig, {
    serializedAddress: "",
    description: "",
  });
  filteredModels.value = [];
  currentParams.value = [];
  dialogVisible.value = true;
};

// 编辑设备
const handleEdit = (row) => {
  dialogTitle.value = "修改设备";
  Object.assign(formData, { ...row });
  // 加载型号列表
  filteredModels.value = deviceModels.value.filter(
    (model) => model.category === formData.deviceCategory
  );
  // 加载参数
  const categoryParams = deviceParams.value.find(
    (item) => item.category === formData.deviceCategory
  );
  currentParams.value = categoryParams
    ? JSON.parse(JSON.stringify(categoryParams.params))
    : [];
  dialogVisible.value = true;
};

// 查看二维码
const handleQrCode = (row) => {
  // 设置弹窗数据
  Object.assign(qrDialogData, {
    deviceName: row.deviceName,
    serialNumber: row.serialNumber,
    // 生成序列化地址
    serializedAddress: `device://${row.deviceCategory}/${row.deviceModel}/${row.serialNumber}`,
  });
  // 打开弹窗
  qrDialogVisible.value = true;
};

// 下载二维码
const handleDownloadQrCode = () => {
  // 这里可以实现实际的二维码下载逻辑
  // 目前使用模拟下载
  ElMessage.success("二维码下载成功");
  console.log("下载二维码数据:", qrDialogData);
  qrDialogVisible.value = false;
};

// 关联文档
const handleRelate = (row) => {
  router.push({
    name: "LinkFile",
    params: { fileId: row.id },
    query: { fileName: row.deviceName },
  });
};

// 删除设备
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除设备${row.deviceName}吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 模拟删除
      ElMessage.success("删除成功");
      getDeviceList();
    })
    .catch(() => {
      // 取消删除
    });
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 设置创建时间
      if (!formData.createTime) {
        formData.createTime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      }
      // 设置创建人（模拟）
      if (!formData.creator) {
        formData.creator = "系统管理员";
      }
      // 模拟保存
      const submitData = {
        ...formData,
        qrCode: { ...qrConfig },
        deviceParams: [...currentParams],
      };
      console.log("提交数据:", submitData);
      ElMessage.success(
        dialogTitle.value === "新建设备" ? "新建设备成功" : "修改设备成功"
      );
      dialogVisible.value = false;
      getDeviceList();
    }
  });
};

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  pageNum.value = 1;
  getDeviceList();
};

// 当前页码变化
const handleCurrentChange = (current) => {
  pageNum.value = current;
  getDeviceList();
};

// 初始化数据
onMounted(() => {
  getDeviceList();
});
</script>

<style scoped>
@import "./device.scss";
</style>
