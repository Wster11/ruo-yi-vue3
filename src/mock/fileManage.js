import Mock from 'mockjs'

// ==================== 辅助数据 ====================
const languages = [
  { id: 1, languageCode: 'zh-CN', languageName: '中文' },
  { id: 2, languageCode: 'en-US', languageName: '英文' },
  { id: 3, languageCode: 'ja-JP', languageName: '日文' },
  { id: 4, languageCode: 'de-DE', languageName: '德文' },
  { id: 5, languageCode: 'fr-FR', languageName: '法文' }
]

const documentTypes = [
  { id: 1, typeName: '操作手册', typeCode: 'MANUAL' },
  { id: 2, typeName: '技术规格书', typeCode: 'SPEC' },
  { id: 3, typeName: '安装指南', typeCode: 'INSTALL' },
  { id: 4, typeName: '维护手册', typeCode: 'MAINTAIN' },
  { id: 5, typeName: '故障排除', typeCode: 'TROUBLESHOOT' },
  { id: 6, typeName: '快速入门', typeCode: 'QUICKSTART' }
]

const categories = [
  { id: 1, categoryName: '工业控制器', categoryDes: 'PLC等工控设备' },
  { id: 2, categoryName: '传感器设备', categoryDes: '各类环境监测传感器' },
  { id: 3, categoryName: '执行器', categoryDes: '电机、阀门等执行设备' },
  { id: 4, categoryName: '通信设备', categoryDes: '网关、路由器等' },
  { id: 5, categoryName: '电源设备', categoryDes: '电源管理设备' }
]

const fileExtensions = ['pdf', 'doc', 'docx', 'txt', 'md', 'zip']

// 生成文件列表数据
const generateFileList = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    fileName: Mock.Random.pick([
      '设备操作手册', '技术规格说明书', '安装维护指南', 
      '快速入门指南', '故障排除手册', '用户使用手册',
      '产品技术文档', '系统集成手册', '调试操作指南'
    ]) + '_' + Mock.Random.string('upper', 3, 5),
    fileType: Mock.Random.pick(fileExtensions),
    fileLanguage: Mock.Random.pick(languages).languageName,
    languageCode: Mock.Random.pick(languages).languageCode,
    fileVersion: `v${Mock.Random.integer(1, 3)}.${Mock.Random.integer(0, 9)}`,
    filePath: `/uploads/files/2025/12/${Mock.Random.guid()}.pdf`,
    fileSize: Mock.Random.integer(100, 5000) + 'KB',
    isAssociated: Mock.Random.boolean() ? '1' : '0',
    associatedDeviceCount: Mock.Random.integer(0, 20),
    categoryId: Mock.Random.pick(categories).id,
    categoryName: Mock.Random.pick(categories).categoryName,
    documentType: Mock.Random.pick(documentTypes).typeName,
    documentTypeCode: Mock.Random.pick(documentTypes).typeCode,
    downloadCount: Mock.Random.integer(0, 500),
    viewCount: Mock.Random.integer(0, 1000),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createBy: Mock.Random.pick(['admin', 'tech_support', 'engineer', 'manager']),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateBy: Mock.Random.pick(['admin', 'tech_support', 'engineer']),
    remark: Mock.Random.pick(['最新版本', '已审核', '待更新', '常用文档', ''])
  }))
}

// 生成设备列表数据
const generateDeviceList = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    deviceName: Mock.Random.pick(['温度传感器', '压力传感器', 'PLC控制器', '伺服电机', '变频器']) + Mock.Random.string('upper', 1, 2),
    deviceModelName: Mock.Random.pick(['DHT22', 'PLC-2000', 'SERVO-300', 'VFD-400', 'PT-100']),
    categoryId: Mock.Random.pick(categories).id,
    categoryName: Mock.Random.pick(categories).categoryName,
    deviceSerialAdd: `/dev/tty${Mock.Random.pick(['USB', 'ACM'])}${Mock.Random.integer(0, 9)}`,
    deviceVersion: Mock.Random.integer(1, 5),
    isBind: Mock.Random.boolean(),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }))
}

// ==================== 文件管理接口 ====================

// 1. 文件列表（支持分页和多维度筛选）
Mock.mock(RegExp('/dev-api/v1/fileManager/list.*'), 'get', (options) => {
  // 解析 URL 参数
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const pageNum = parseInt(params.get('pageNum') || '1')
  const pageSize = parseInt(params.get('pageSize') || '10')
  
  // 生成模拟数据
  const allFiles = generateFileList(50)
  
  // 简单的筛选逻辑（实际应该根据参数筛选）
  const fileName = params.get('fileName')
  const fileLanguage = params.get('fileLanguage')
  const categoryName = params.get('categoryName')
  const isAssociated = params.get('isAssociated')
  
  let filteredFiles = allFiles
  
  if (fileName) {
    filteredFiles = filteredFiles.filter(f => f.fileName.includes(fileName))
  }
  if (fileLanguage) {
    filteredFiles = filteredFiles.filter(f => f.fileLanguage === fileLanguage)
  }
  if (categoryName) {
    filteredFiles = filteredFiles.filter(f => f.categoryName.includes(categoryName))
  }
  if (isAssociated) {
    filteredFiles = filteredFiles.filter(f => f.isAssociated === isAssociated)
  }
  
  // 分页处理
  const total = filteredFiles.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredFiles.slice(start, end)
  
  return {
    code: 200,
    msg: '查询成功',
    total: total,
    rows: rows
  }
})

// 2. 获取语言列表
Mock.mock('/dev-api/v1/fileManager/geLanguageList', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: languages
  }
})

// 3. 获取文件类型列表
Mock.mock('/dev-api/v1/fileManager/getDocumentTypeList', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: documentTypes
  }
})

// 4. 获取分类列表
Mock.mock('/dev-api/v1/fileManager/getCategoryList', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: categories
  }
})

// 5. 获取设备列表
Mock.mock('/dev-api/v1/fileManager/getDeviceList', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: generateDeviceList(20)
  }
})

// 6. 文件新增
Mock.mock('/dev-api/v1/fileManager/add', 'post', (options) => {
  console.log('新增文件请求参数:', options.body)
  
  return {
    code: 200,
    msg: '新增成功',
    data: {
      id: Mock.Random.integer(1000, 9999)
    }
  }
})

// 7. 文件更新（注意：接口名称有拼写错误 updateFileVersio）
Mock.mock('/dev-api/v1/fileManager/updateFileVersio', 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const fileId = params.get('fileId')
  
  return {
    code: 200,
    msg: '更新成功',
    data: {
      fileId: fileId,
      newVersion: `v${Mock.Random.integer(1, 5)}.${Mock.Random.integer(0, 9)}`,
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    }
  }
})

// 8. 关联更多设备 - 查询设备列表
Mock.mock(RegExp('/dev-api/v1/fileManager/getDeviceAllList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const fileId = params.get('fileId')
  
  const devices = generateDeviceList(30)
  
  // 随机标记一些设备为已绑定
  const devicesWithBindStatus = devices.map(device => ({
    ...device,
    isBind: Mock.Random.boolean(),
    bindTime: Mock.Random.boolean() ? Mock.Random.datetime('yyyy-MM-dd HH:mm:ss') : null
  }))
  
  return {
    code: 200,
    msg: '查询成功',
    data: {
      fileId: fileId,
      deviceList: devicesWithBindStatus
    }
  }
})

// 9. 关联更多设备 - 保存关联
Mock.mock(RegExp('/dev-api/v1/fileManager/bindSelectDevice.*'), 'post', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const fileId = params.get('fileId')
  const deviceIds = params.get('deviceId') // 可能是逗号分隔的ID列表
  
  console.log('绑定设备请求:', { fileId, deviceIds })
  
  return {
    code: 200,
    msg: '关联成功',
    data: {
      fileId: fileId,
      bindCount: deviceIds ? deviceIds.split(',').length : 0
    }
  }
})

// 10. 文件详情 - 获取绑定设备列表
Mock.mock(RegExp('/dev-api/v1/fileManager/getBindDeviceList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const fileId = params.get('fileId')
  
  // 生成已绑定的设备列表
  const bindDevices = generateDeviceList(Mock.Random.integer(3, 10)).map(device => ({
    ...device,
    bindTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    bindBy: Mock.Random.pick(['admin', 'tech_support', 'engineer'])
  }))
  
  return {
    code: 200,
    msg: '查询成功',
    data: {
      fileId: fileId,
      total: bindDevices.length,
      deviceList: bindDevices
    }
  }
})

// 导出 Mock 配置
export default Mock

