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
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择分类"
            clearable
            @change="handleSearchCategoryChange"
            style="width: 180px"
          >
            <el-option
              v-for="category in searchCategories"
              :key="category.id"
              :label="category.categoryName"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.deviceName" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select
            v-model="searchForm.deviceModelId"
            placeholder="请选择型号"
            clearable
            :disabled="!searchForm.categoryId"
            style="width: 180px"
          >
            <el-option
              v-for="model in searchModels"
              :key="model.id"
              :label="model.modelName"
              :value="model.id"
            />
          </el-select>
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
        prop="categoryName"
        label="设备分类"
        width="120"
        align="center"
      />
      <el-table-column
        prop="deviceModelName"
        label="设备型号"
        width="120"
        align="center"
      />
      <el-table-column
        prop="deviceSerialEncrypt"
        label="序列号"
        align="center"
      />
      <el-table-column
        prop="devicebindFile"
        label="关联文档"
        width="100"
        align="center"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.devicebindFile === 'Y' ? 'success' : 'danger'"
            effect="light"
          >
            {{ scope.row.devicebindFile === 'Y' ? "是" : "否" }}
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
        prop="createBy"
        label="创建人"
        align="center"
      />
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template #default="scope">
          <el-tooltip content="查看二维码" placement="top">
            <el-button
              type="success"
              size="small"
              circle
              @click="handleQrCode(scope.row)"
            >
              <el-icon><View /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="修改" placement="top">
            <el-button 
              type="primary" 
              size="small" 
              circle
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="关联文档" placement="top">
            <el-button
              type="warning"
              size="small"
              circle
              @click="handleRelate(scope.row)"
            >
              <el-icon><Link /></el-icon>
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
                  :key="category.id"
                  :label="category.categoryName"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="设备型号"
              prop="deviceModel"
              :disabled="!formData.deviceCategory"
            >
              <el-select
                v-model="formData.deviceModel"
                placeholder="请选择设备型号"
                @change="handleModelChange"
                style="width: 100%"
              >
                <el-option
                  v-for="model in deviceModels"
                  :key="model.id"
                  :label="model.modelName"
                  :value="model.id"
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
              label="设备编码"
              prop="deviceCode"
              :disabled="!formData.deviceCategory"
            >
              <el-select
                v-model="formData.deviceCode"
                placeholder="请选择设备编码"
                @change="handleDeviceCodeChange"
                style="width: 100%"
                filterable
                allow-create
              >
                <el-option
                  v-for="code in deviceCodes"
                  :key="code.id"
                  :label="code.codeName"
                  :value="code.codeName"
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
              <el-empty description="该分类暂无参数定义" :image-size="100" />
            </div>
            <div v-else class="params-container">
              <div
                v-for="(param, index) in currentParams"
                :key="index"
                class="param-item"
              >
                <div class="param-header">
                  <span class="param-name">{{ param.name }}</span>
                  <el-tag type="success" size="small" effect="light"
                    >Visible</el-tag
                  >
                </div>
                <div class="param-input-group">
                  <el-input
                    v-model="param.value"
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
                  :rows="2"
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
import { ref, reactive, onMounted, watch, computed } from "vue";
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
import {
  getDeviceList as fetchDeviceList,
  getCategoryAll,
  getDeviceModelList,
  getDeviceCodeList,
  getCategoryAttributeList,
  addDevice,
  editDevice,
  deleteDevice,
  getDeviceDetail
} from '@/api/deviceManage';

const router = useRouter();
const route = useRoute();

// 搜索表单数据
const searchForm = reactive({
  categoryId: "", // 分类ID
  deviceName: "",
  deviceModelId: "", // 型号ID
  relatedDoc: "",
  startDate: "",
  endDate: "",
});

// 搜索区域的分类和型号列表
const searchCategories = ref([]);
const searchModels = ref([]);

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
  deviceCode: "",
  relatedDoc: false,
  createTime: "",
  creator: "",
});

// 二维码配置
const qrConfig = reactive({
  serializedAddress: "",
  description: "",
});

// 设备分类列表（从后端动态加载）
const deviceCategories = ref([]);

// 设备型号列表（从后端动态加载）
const deviceModels = ref([]);

// 设备编码列表（从后端动态加载）
const deviceCodes = ref([]);

// 当前参数列表（从后端动态加载）
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
  deviceCode: [
    { required: true, message: "请选择设备编码", trigger: "change" },
  ],
});

// 获取设备列表
const getDeviceList = async () => {
  loading.value = true;
  try {
    // 根据ID获取名称
    const categoryName = searchForm.categoryId 
      ? searchCategories.value.find(c => c.id === searchForm.categoryId)?.categoryName 
      : undefined;
    const deviceModelName = searchForm.deviceModelId 
      ? searchModels.value.find(m => m.id === searchForm.deviceModelId)?.modelName 
      : undefined;
    
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      categoryName: categoryName,
      deviceName: searchForm.deviceName || undefined,
      deviceModelName: deviceModelName,
    };
    
    const res = await fetchDeviceList(params);
    
    if (res.code === 200) {
      deviceList.value = res.rows || [];
      total.value = res.total || 0;
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

// 查询设备
const handleSearch = () => {
  pageNum.value = 1;
  getDeviceList();
};

// 重置搜索条件
const handleReset = () => {
  Object.assign(searchForm, {
    categoryId: "",
    deviceName: "",
    deviceModelId: "",
    relatedDoc: "",
    startDate: "",
    endDate: "",
  });
  searchModels.value = [];
  pageNum.value = 1;
  getDeviceList();
};

// 处理搜索区域分类变化
const handleSearchCategoryChange = async (categoryId) => {
  // 清空型号选择
  searchForm.deviceModelId = "";
  
  if (categoryId) {
    // 加载该分类下的型号列表
    try {
      const res = await getDeviceModelList({ categoryId });
      if (res.code === 200) {
        searchModels.value = res.data || [];
      }
    } catch (error) {
      console.error('获取型号列表失败:', error);
    }
  } else {
    searchModels.value = [];
  }
};

// 生成设备名称和二维码序列化地址
const generateDeviceName = () => {
  if (formData.deviceModel && formData.deviceCode) {
    // 获取分类名称和型号名称
    const category = deviceCategories.value.find(c => c.id === formData.deviceCategory);
    const model = deviceModels.value.find(m => m.id === formData.deviceModel);
    
    // 设备名称 = 分类名称 + '-' + 型号名称 + '-' + 设备编码
    formData.deviceName = `${category?.categoryName || ''}-${model?.modelName || ''}-${formData.deviceCode}`;
    
    // 生成序列化地址
    qrConfig.serializedAddress = `device://${category?.categoryCode || ''}/${model?.modelCode || ''}/${formData.deviceCode}`;
    
    // 自动生成二维码描述信息 BP+设备名称
    qrConfig.description = `BP-${formData.deviceName}`;
  } else {
    formData.deviceName = "";
    qrConfig.serializedAddress = "";
    qrConfig.description = "";
  }
};

// 处理分类变化（保留用于兼容）
const handleCategoryChange = () => {
  // 由 watch 自动处理
};

// 处理型号变化
const handleModelChange = () => {
  // 清空设备编码
  formData.deviceCode = "";
  // 加载该型号对应的设备编码列表
  loadDeviceCodes(formData.deviceCategory);
  generateDeviceName();
};

// 处理设备编码变化
const handleDeviceCodeChange = () => {
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
    deviceCode: "",
    relatedDoc: false,
    createTime: "",
    creator: "",
  });
  // 重置二维码配置
  Object.assign(qrConfig, {
    serializedAddress: "",
    description: "",
  });
  deviceModels.value = [];
  deviceCodes.value = [];
  currentParams.value = [];
  dialogVisible.value = true;
};

// 编辑设备
const handleEdit = async (row) => {
  try {
    loading.value = true;
    
    // 获取设备详情
    const res = await getDeviceDetail(row.id);
    
    if (res.code === 200) {
      const detail = res.data;
      
      dialogTitle.value = "修改设备";
      
      // 填充表单数据
      Object.assign(formData, {
        id: detail.id,
        deviceName: detail.deviceName,
        deviceCategory: detail.categoryId,
        deviceModel: detail.deviceModelId,
        deviceVersion: `v${detail.deviceVersion || 1}`,
        deviceCode: detail.deviceSerialEncrypt,
        relatedDoc: detail.devicebindFile === 'Y',
        createTime: detail.createTime,
        creator: detail.createBy
      });
      
      // 填充二维码配置
      Object.assign(qrConfig, {
        serializedAddress: detail.deviceQrcodeUrl || '',
        description: detail.deviceQrcodeDes || ''
      });
      
      // 加载型号列表、编码列表和参数
      await loadDeviceModels(detail.categoryId);
      await loadDeviceCodes(detail.categoryId);
      await loadCategoryAttributes(detail.categoryId);
      
      // 如果有设备属性，回填参数值
      if (detail.attributes && detail.attributes.length > 0) {
        currentParams.value = detail.attributes.map(attr => ({
          name: attr.attributeName,
          value: attr.value || '',
          unit: attr.attributeUnit || ''
        }));
      }
      
      dialogVisible.value = true;
    } else {
      ElMessage.error(res.msg || '获取设备详情失败');
    }
  } catch (error) {
    console.error('获取设备详情失败:', error);
    ElMessage.error('获取设备详情失败');
  } finally {
    loading.value = false;
  }
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
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除设备${row.deviceName}吗？`, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    
    loading.value = true;
    const res = await deleteDevice(row.id);
    
    if (res.code === 200) {
      ElMessage.success("删除成功");
      getDeviceList();
    } else {
      ElMessage.error(res.msg || "删除失败");
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除设备失败:', error);
      ElMessage.error("删除失败");
    }
  } finally {
    loading.value = false;
  }
};

// 提交表单
const handleSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        
        // 准备提交数据
        const submitData = {
          deviceName: formData.deviceName,
          categoryId: formData.deviceCategory, // 分类ID
          deviceModelId: formData.deviceModel, // 型号ID
          deviceSerialAdd: formData.deviceCode, // 设备编码
          deviceSerialEncrypt: formData.deviceCode, // 加密序列号（可以做加密处理）
          deviceVersion: parseInt(formData.deviceVersion?.replace('v', '') || '1'),
          deviceQrcodeDes: qrConfig.description,
          // 二维码序列化地址
          qrCodeData: {
            serializedAddress: qrConfig.serializedAddress,
            description: qrConfig.description
          },
          // 设备参数
          attributes: currentParams.value.map(param => ({
            attributeName: param.name,
            value: param.value,
            unit: param.unit
          })),
          remark: ''
        };
        
        let res;
        if (dialogTitle.value === "新建设备") {
          res = await addDevice(submitData);
        } else {
          submitData.id = formData.id;
          res = await editDevice(submitData);
        }
        
        if (res.code === 200) {
          ElMessage.success(
            dialogTitle.value === "新建设备" ? "新建设备成功" : "修改设备成功"
          );
          dialogVisible.value = false;
          getDeviceList();
        } else {
          ElMessage.error(res.msg || "操作失败");
        }
      } catch (error) {
        console.error('提交失败:', error);
        ElMessage.error("操作失败");
      } finally {
        loading.value = false;
      }
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

// 获取分类列表（用于表单弹窗）
const loadCategories = async () => {
  try {
    const res = await getCategoryAll();
    if (res.code === 200) {
      deviceCategories.value = res.data || [];
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
};

// 获取搜索区域的分类列表
const loadSearchCategories = async () => {
  try {
    const res = await getCategoryAll();
    if (res.code === 200) {
      searchCategories.value = res.data || [];
    }
  } catch (error) {
    console.error('获取搜索分类列表失败:', error);
  }
};

// 获取型号列表
const loadDeviceModels = async (categoryId) => {
  if (!categoryId) {
    deviceModels.value = [];
    return;
  }
  
  try {
    const res = await getDeviceModelList({ categoryId });
    if (res.code === 200) {
      deviceModels.value = res.data || [];
    }
  } catch (error) {
    console.error('获取型号列表失败:', error);
  }
};

// 获取设备编码列表
const loadDeviceCodes = async (categoryId) => {
  if (!categoryId) {
    deviceCodes.value = [];
    return;
  }
  
  try {
    const res = await getDeviceCodeList({ categoryId });
    if (res.code === 200) {
      deviceCodes.value = res.data || [];
    }
  } catch (error) {
    console.error('获取设备编码列表失败:', error);
  }
};

// 获取参数列表
const loadCategoryAttributes = async (categoryId) => {
  if (!categoryId) {
    currentParams.value = [];
    return;
  }
  
  try {
    const res = await getCategoryAttributeList({ categoryId });
    if (res.code === 200) {
      currentParams.value = (res.data || []).map(attr => ({
        name: attr.attributeName,
        value: attr.value || '',
        unit: attr.attributeUnit || ''
      }));
    }
  } catch (error) {
    console.error('获取参数列表失败:', error);
  }
};

// 监听分类变化
watch(() => formData.deviceCategory, (newCategoryId) => {
  if (newCategoryId) {
    loadDeviceModels(newCategoryId);
    loadDeviceCodes(newCategoryId);
    loadCategoryAttributes(newCategoryId);
  } else {
    deviceModels.value = [];
    deviceCodes.value = [];
    currentParams.value = [];
  }
  // 清空型号、编码和设备名称
  formData.deviceModel = "";
  formData.deviceCode = "";
  formData.deviceName = "";
});

// 初始化数据
onMounted(() => {
  getDeviceList();
  loadCategories();
  loadSearchCategories();
});
</script>

<style scoped>
@import "./device.scss";
</style>
