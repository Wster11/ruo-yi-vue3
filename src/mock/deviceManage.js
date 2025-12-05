import Mock from 'mockjs'

// ==================== 辅助数据 ====================

// 设备分类列表
const categories = [
  { id: 1, categoryName: '工业控制器', categoryCode: 'PLC', categoryDes: 'PLC等工控设备' },
  { id: 2, categoryName: '传感器设备', categoryCode: 'SENSOR', categoryDes: '各类环境监测传感器' },
  { id: 3, categoryName: '执行器', categoryCode: 'ACTUATOR', categoryDes: '电机、阀门等执行设备' },
  { id: 4, categoryName: '通信设备', categoryCode: 'COMM', categoryDes: '网关、路由器等' },
  { id: 5, categoryName: '电源设备', categoryCode: 'POWER', categoryDes: '电源管理设备' }
]

// 设备型号列表
const deviceModels = [
  { id: 1, modelName: 'DHT22', categoryId: 2, modelCode: 'DHT22-A' },
  { id: 2, modelName: 'PLC-2000', categoryId: 1, modelCode: 'PLC2K' },
  { id: 3, modelName: 'SERVO-300', categoryId: 3, modelCode: 'SV300' },
  { id: 4, modelName: 'VFD-400', categoryId: 3, modelCode: 'VFD4' },
  { id: 5, modelName: 'PT-100', categoryId: 2, modelCode: 'PT100' },
  { id: 6, modelName: 'Gateway-5G', categoryId: 4, modelCode: 'GW5G' },
  { id: 7, modelName: 'UPS-1000', categoryId: 5, modelCode: 'UPS1K' }
]

// 设备编码列表
const deviceCodes = [
  { id: 1, codeName: 'DEV-PLC-001', categoryId: 1 },
  { id: 2, codeName: 'DEV-PLC-002', categoryId: 1 },
  { id: 3, codeName: 'DEV-SENSOR-001', categoryId: 2 },
  { id: 4, codeName: 'DEV-SENSOR-002', categoryId: 2 },
  { id: 5, codeName: 'DEV-ACT-001', categoryId: 3 },
  { id: 6, codeName: 'DEV-COMM-001', categoryId: 4 },
  { id: 7, codeName: 'DEV-PWR-001', categoryId: 5 }
]

// 语言列表
const languages = [
  { id: 1, languageCode: 'zh-CN', languageName: '中文' },
  { id: 2, languageCode: 'en-US', languageName: '英文' },
  { id: 3, languageCode: 'ja-JP', languageName: '日文' },
  { id: 4, languageCode: 'de-DE', languageName: '德文' },
  { id: 5, languageCode: 'fr-FR', languageName: '法文' }
]

// 文档类型列表
const documentTypes = [
  { id: 1, typeName: '操作手册', typeCode: 'MANUAL' },
  { id: 2, typeName: '技术规格书', typeCode: 'SPEC' },
  { id: 3, typeName: '安装指南', typeCode: 'INSTALL' },
  { id: 4, typeName: '维护手册', typeCode: 'MAINTAIN' },
  { id: 5, typeName: '故障排除', typeCode: 'TROUBLESHOOT' },
  { id: 6, typeName: '快速入门', typeCode: 'QUICKSTART' }
]

// 分类属性列表
const categoryAttributes = [
  { id: 1, attributeName: '工作电压', attributeUnit: 'V', categoryId: 1 },
  { id: 2, attributeName: '工作温度', attributeUnit: '℃', categoryId: 1 },
  { id: 3, attributeName: '防护等级', attributeUnit: '', categoryId: 1 },
  { id: 4, attributeName: '通信接口', attributeUnit: '', categoryId: 1 },
  { id: 5, attributeName: '测量范围', attributeUnit: '℃', categoryId: 2 },
  { id: 6, attributeName: '精度', attributeUnit: '%', categoryId: 2 },
  { id: 7, attributeName: '响应时间', attributeUnit: 'ms', categoryId: 2 },
  { id: 8, attributeName: '额定功率', attributeUnit: 'W', categoryId: 3 },
  { id: 9, attributeName: '转速', attributeUnit: 'rpm', categoryId: 3 },
  { id: 10, attributeName: '扭矩', attributeUnit: 'N·m', categoryId: 3 }
]

// 生成设备列表
const generateDeviceList = (count) => {
  return Array.from({ length: count }, (_, index) => {
    const category = Mock.Random.pick(categories)
    const model = deviceModels.find(m => m.categoryId === category.id) || deviceModels[0]
    
    return {
      id: index + 1,
      deviceName: Mock.Random.pick(['温度传感器', '压力传感器', 'PLC控制器', '伺服电机', '变频器']) + Mock.Random.string('upper', 1, 2),
      deviceModelId: model.id,
      deviceModelName: model.modelName,
      categoryId: category.id,
      categoryName: category.categoryName,
      categoryDes: category.categoryDes,
      deviceSerialAdd: `/dev/tty${Mock.Random.pick(['USB', 'ACM'])}${Mock.Random.integer(0, 9)}`,
      deviceSerialEncrypt: Mock.Random.string('upper', 12, 16),
      deviceVersion: Mock.Random.integer(1, 5),
      deviceUrl: `https://example.com/device${index + 1}.png`,
      deviceQrcodeUrl: `https://qrcode.example.com/qrcode${index + 1}.png`,
      deviceQrcodeDes: Mock.Random.csentence(10, 20),
      devicebindFile: Mock.Random.boolean() ? 'Y' : 'N',
      bindFileCount: Mock.Random.integer(0, 10),
      createBy: Mock.Random.pick(['admin', 'tech_support', 'engineer', 'manager']),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateBy: Mock.Random.pick(['admin', 'tech_support', 'engineer']),
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      delFlag: '0',
      remark: Mock.Random.pick(['重要设备', '常用设备', '新增设备', ''])
    }
  })
}

// 生成文件列表
const generateFileList = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    fileName: Mock.Random.pick([
      '设备操作手册', '技术规格说明书', '安装维护指南', 
      '快速入门指南', '故障排除手册'
    ]) + '_' + Mock.Random.string('upper', 3, 5),
    fileType: Mock.Random.pick(['pdf', 'doc', 'docx']),
    fileLanguage: Mock.Random.pick(languages).languageName,
    languageCode: Mock.Random.pick(languages).languageCode,
    fileVersion: `v${Mock.Random.integer(1, 3)}.${Mock.Random.integer(0, 9)}`,
    filePath: `/uploads/files/2025/12/${Mock.Random.guid()}.pdf`,
    fileSize: Mock.Random.integer(100, 5000) + 'KB',
    isAssociated: Mock.Random.boolean() ? '1' : '0',
    categoryName: Mock.Random.pick(categories).categoryName,
    documentType: Mock.Random.pick(documentTypes).typeName,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createBy: Mock.Random.pick(['admin', 'tech_support', 'engineer'])
  }))
}

// ==================== 设备管理接口 ====================

// 1. 设备分页列表
Mock.mock(RegExp('/dev-api/v1/device/list.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const pageNum = parseInt(params.get('pageNum') || '1')
  const pageSize = parseInt(params.get('pageSize') || '10')
  
  // 生成模拟数据
  const allDevices = generateDeviceList(50)
  
  // 筛选
  const categoryName = params.get('categoryName')
  const deviceName = params.get('deviceName')
  const deviceModelName = params.get('deviceModelName')
  
  let filteredDevices = allDevices
  
  if (categoryName) {
    filteredDevices = filteredDevices.filter(d => d.categoryName.includes(categoryName))
  }
  if (deviceName) {
    filteredDevices = filteredDevices.filter(d => d.deviceName.includes(deviceName))
  }
  if (deviceModelName) {
    filteredDevices = filteredDevices.filter(d => d.deviceModelName.includes(deviceModelName))
  }
  
  // 分页
  const total = filteredDevices.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredDevices.slice(start, end)
  
  return {
    code: 200,
    msg: '查询成功',
    total: total,
    rows: rows
  }
})

// 2. 获取分类下拉列表
Mock.mock('/dev-api/v1/device/categoryAll', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: categories
  }
})

// 3. 获取设备参数设置列表
Mock.mock(RegExp('/dev-api/v1/device/getCategoryAttributeList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const categoryId = parseInt(params.get('categoryId'))
  
  let attributes = categoryAttributes
  
  if (categoryId) {
    attributes = categoryAttributes.filter(attr => attr.categoryId === categoryId)
  }
  
  return {
    code: 200,
    msg: '操作成功',
    data: attributes.map(attr => ({
      ...attr,
      value: '', // 默认值为空，由用户填写
      isRequired: false
    }))
  }
})

// 4. 查询设备型号列表
Mock.mock(RegExp('/dev-api/v1/device/getDeviceModelList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const categoryId = parseInt(params.get('categoryId'))
  const modelName = params.get('modelName')
  
  let models = deviceModels
  
  if (categoryId) {
    models = models.filter(m => m.categoryId === categoryId)
  }
  if (modelName) {
    models = models.filter(m => m.modelName.includes(modelName))
  }
  
  return {
    code: 200,
    msg: '操作成功',
    data: models
  }
})

// 5. 查询设备编码列表
Mock.mock(RegExp('/dev-api/v1/device/getDeviceCodeList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const categoryId = parseInt(params.get('categoryId'))
  const codeName = params.get('codeName')
  
  let codes = deviceCodes
  
  if (categoryId) {
    codes = codes.filter(c => c.categoryId === categoryId)
  }
  if (codeName) {
    codes = codes.filter(c => c.codeName.includes(codeName))
  }
  
  return {
    code: 200,
    msg: '操作成功',
    data: codes
  }
})

// 6. 设备新增
Mock.mock('/dev-api/v1/device/add', 'post', (options) => {
  console.log('新增设备请求参数:', options.body)
  
  let requestData = {}
  try {
    requestData = JSON.parse(options.body)
  } catch (e) {
    requestData = {}
  }
  
  const newId = Mock.Random.integer(1000, 9999)
  
  return {
    code: 200,
    msg: '新增成功',
    data: {
      id: newId
    }
  }
})

// 7. 设备编辑
Mock.mock('/dev-api/v1/device/edit', 'put', (options) => {
  console.log('编辑设备请求参数:', options.body)
  
  let requestData = {}
  try {
    requestData = JSON.parse(options.body)
  } catch (e) {
    requestData = {}
  }
  
  if (!requestData.id) {
    return {
      code: 500,
      msg: '设备ID不能为空'
    }
  }
  
  return {
    code: 200,
    msg: '编辑成功'
  }
})

// 8. 设备删除
Mock.mock(RegExp('/dev-api/v1/device/(\\d+)'), 'delete', (options) => {
  const deviceId = parseInt(options.url.match(/\/v1\/device\/(\d+)/)[1])
  
  console.log('删除设备ID:', deviceId)
  
  return {
    code: 200,
    msg: '删除成功'
  }
})

// 9. 获取关联设备文件列表
Mock.mock(RegExp('/dev-api/v1/device/getDeviceBindFileList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const deviceId = params.get('deviceId')
  
  const bindFiles = generateFileList(Mock.Random.integer(3, 10)).map(file => ({
    ...file,
    bindTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    bindBy: Mock.Random.pick(['admin', 'tech_support', 'engineer'])
  }))
  
  return {
    code: 200,
    msg: '查询成功',
    data: {
      deviceId: deviceId,
      total: bindFiles.length,
      fileList: bindFiles
    }
  }
})

// 10. 获取文件列表（用于关联）
Mock.mock(RegExp('/dev-api/v1/device/getDeviceFileList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const fileName = params.get('fileName')
  const fileType = params.get('fileType')
  const fileLanguage = params.get('fileLanguage')
  
  let files = generateFileList(30)
  
  if (fileName) {
    files = files.filter(f => f.fileName.includes(fileName))
  }
  if (fileType) {
    files = files.filter(f => f.fileType === fileType)
  }
  if (fileLanguage) {
    files = files.filter(f => f.fileLanguage === fileLanguage)
  }
  
  return {
    code: 200,
    msg: '查询成功',
    data: files
  }
})

// 11. 确认关联文件
Mock.mock(RegExp('/dev-api/v1/device/bindSelectFile.*'), 'post', (options) => {
  console.log('关联文件请求参数:', options.body)
  
  let requestData = {}
  try {
    requestData = JSON.parse(options.body)
  } catch (e) {
    requestData = {}
  }
  
  return {
    code: 200,
    msg: '关联成功',
    data: {
      deviceId: requestData.deviceId,
      bindCount: requestData.fileIds ? requestData.fileIds.length : 0
    }
  }
})

// 12. 获取语言列表
Mock.mock('/dev-api/v1/device/geLanguageList', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: languages
  }
})

// 13. 获取文档类型列表
Mock.mock('/dev-api/v1/device/getDocumentTypeList', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: documentTypes
  }
})

// 14. 批量上传文件
Mock.mock('/dev-api/v1/device/uploadFileList', 'post', (options) => {
  console.log('批量上传文件请求参数:', options.body)
  
  let requestData = {}
  try {
    requestData = JSON.parse(options.body)
  } catch (e) {
    requestData = {}
  }
  
  const fileCount = requestData.files ? requestData.files.length : 0
  
  return {
    code: 200,
    msg: '上传成功',
    data: {
      successCount: fileCount,
      failCount: 0,
      totalCount: fileCount
    }
  }
})

// 15. 获取设备详情
Mock.mock(RegExp('/dev-api/v1/device/(\\d+)'), 'get', (options) => {
  const deviceId = parseInt(options.url.match(/\/v1\/device\/(\d+)/)[1])
  
  const category = Mock.Random.pick(categories)
  const model = deviceModels.find(m => m.categoryId === category.id) || deviceModels[0]
  
  return {
    code: 200,
    msg: '查询成功',
    data: {
      id: deviceId,
      deviceName: '温度传感器A',
      deviceModelId: model.id,
      deviceModelName: model.modelName,
      categoryId: category.id,
      categoryName: category.categoryName,
      categoryDes: category.categoryDes,
      deviceSerialAdd: '/dev/ttyUSB0',
      deviceSerialEncrypt: 'TEMP_SENSOR_A_001',
      deviceVersion: 1,
      deviceUrl: 'https://example.com/device1.png',
      deviceQrcodeUrl: 'https://qrcode.example.com/qrcode1.png',
      deviceQrcodeDes: '用于监测环境温度',
      devicebindFile: 'Y',
      bindFileCount: 5,
      createBy: 'admin',
      createTime: '2025-12-02 13:32:07',
      updateBy: 'admin',
      updateTime: '2025-12-05 10:20:00',
      delFlag: '0',
      remark: '高性能温感设备',
      // 设备参数
      attributes: categoryAttributes
        .filter(attr => attr.categoryId === category.id)
        .map(attr => ({
          ...attr,
          value: Mock.Random.integer(10, 100).toString()
        })),
      // 已绑定文件
      bindFiles: generateFileList(5)
    }
  }
})

// 导出 Mock 配置
export default Mock

