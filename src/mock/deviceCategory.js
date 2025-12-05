import Mock from 'mockjs'

// ==================== 辅助数据 ====================

// 设备分类列表
const categoryList = [
  {
    id: 1,
    categoryName: '工业控制器',
    categoryDes: 'PLC等工控设备',
    categoryCode: 'PLC',
    deviceCount: 15,
    attributeCount: 8,
    createTime: '2025-11-01 10:00:00',
    createBy: 'admin',
    updateTime: '2025-12-01 14:20:00',
    updateBy: 'admin',
    remark: '核心控制设备'
  },
  {
    id: 2,
    categoryName: '传感器设备',
    categoryDes: '各类环境监测传感器',
    categoryCode: 'SENSOR',
    deviceCount: 23,
    attributeCount: 5,
    createTime: '2025-11-02 09:30:00',
    createBy: 'admin',
    updateTime: '2025-11-28 16:45:00',
    updateBy: 'tech_support',
    remark: '环境监测类'
  },
  {
    id: 3,
    categoryName: '执行器',
    categoryDes: '电机、阀门等执行设备',
    categoryCode: 'ACTUATOR',
    deviceCount: 18,
    attributeCount: 6,
    createTime: '2025-11-03 11:20:00',
    createBy: 'admin',
    updateTime: '2025-12-02 10:15:00',
    updateBy: 'engineer',
    remark: '动作执行类'
  },
  {
    id: 4,
    categoryName: '通信设备',
    categoryDes: '网关、路由器等',
    categoryCode: 'COMM',
    deviceCount: 10,
    attributeCount: 7,
    createTime: '2025-11-05 14:00:00',
    createBy: 'admin',
    updateTime: '2025-11-30 09:30:00',
    updateBy: 'admin',
    remark: '网络通信类'
  },
  {
    id: 5,
    categoryName: '电源设备',
    categoryDes: '电源管理设备',
    categoryCode: 'POWER',
    deviceCount: 12,
    attributeCount: 4,
    createTime: '2025-11-08 08:45:00',
    createBy: 'admin',
    updateTime: '2025-12-03 11:20:00',
    updateBy: 'tech_support',
    remark: '电源供应类'
  }
]

// 分类属性列表
const attributeList = [
  {
    id: 1,
    categoryAttributeName: '工作电压',
    attributeType: 'number',
    attributeUnit: 'V',
    isRequired: true,
    defaultValue: '220',
    description: '设备工作电压范围'
  },
  {
    id: 2,
    categoryAttributeName: '工作温度',
    attributeType: 'range',
    attributeUnit: '℃',
    isRequired: true,
    defaultValue: '-10~60',
    description: '设备正常工作温度范围'
  },
  {
    id: 3,
    categoryAttributeName: '防护等级',
    attributeType: 'select',
    attributeUnit: '',
    isRequired: true,
    defaultValue: 'IP65',
    description: '设备防尘防水等级'
  },
  {
    id: 4,
    categoryAttributeName: '通信接口',
    attributeType: 'multiselect',
    attributeUnit: '',
    isRequired: false,
    defaultValue: 'RS485',
    description: '设备支持的通信接口类型'
  },
  {
    id: 5,
    categoryAttributeName: '功率',
    attributeType: 'number',
    attributeUnit: 'W',
    isRequired: true,
    defaultValue: '100',
    description: '设备额定功率'
  },
  {
    id: 6,
    categoryAttributeName: '尺寸',
    attributeType: 'text',
    attributeUnit: 'mm',
    isRequired: false,
    defaultValue: '',
    description: '设备外形尺寸'
  },
  {
    id: 7,
    categoryAttributeName: '重量',
    attributeType: 'number',
    attributeUnit: 'kg',
    isRequired: false,
    defaultValue: '',
    description: '设备净重'
  },
  {
    id: 8,
    categoryAttributeName: '品牌',
    attributeType: 'text',
    attributeUnit: '',
    isRequired: false,
    defaultValue: '',
    description: '设备制造商品牌'
  }
]

// 生成分类列表（用于动态数据）
const generateCategoryList = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 100,
    categoryName: Mock.Random.pick([
      '工业控制器', '传感器设备', '执行器', '通信设备', 
      '电源设备', '显示设备', '存储设备', '安全设备'
    ]) + Mock.Random.string('upper', 1, 2),
    categoryDes: Mock.Random.csentence(10, 20),
    categoryCode: Mock.Random.string('upper', 3, 6),
    deviceCount: Mock.Random.integer(5, 50),
    attributeCount: Mock.Random.integer(3, 10),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createBy: Mock.Random.pick(['admin', 'tech_support', 'engineer', 'manager']),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateBy: Mock.Random.pick(['admin', 'tech_support', 'engineer']),
    remark: Mock.Random.pick(['常用分类', '重点关注', '新增分类', ''])
  }))
}

// ==================== 设备分类管理接口 ====================

// 1. 类型分页列表
Mock.mock(RegExp('/dev-api/v1/category/list.*'), 'get', (options) => {
  // 解析 URL 参数
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const pageNum = parseInt(params.get('pageNum') || '1')
  const pageSize = parseInt(params.get('pageSize') || '10')
  const categoryName = params.get('categoryName')
  
  // 合并静态数据和动态生成的数据
  let allCategories = [...categoryList, ...generateCategoryList(10)]
  
  // 筛选
  let filteredCategories = allCategories
  if (categoryName) {
    filteredCategories = filteredCategories.filter(c => 
      c.categoryName.includes(categoryName)
    )
  }
  
  // 分页处理
  const total = filteredCategories.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredCategories.slice(start, end)
  
  return {
    code: 200,
    msg: '查询成功',
    total: total,
    rows: rows
  }
})

// 2. 获取设备分类描述列表（用于下拉选择）
Mock.mock('/dev-api/v1/category/getCategoryNameList', 'get', () => {
  return {
    code: 200,
    msg: '操作成功',
    data: categoryList.map(item => ({
      id: item.id,
      categoryName: item.categoryName,
      categoryDes: item.categoryDes,
      categoryCode: item.categoryCode
    }))
  }
})

// 3. 获取参数列表（用于分类属性配置）
Mock.mock(RegExp('/dev-api/v1/category/getAttributeList.*'), 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const categoryAttributeName = params.get('categoryAttributeName')
  
  let filteredAttributes = attributeList
  
  // 如果有参数名称筛选
  if (categoryAttributeName) {
    filteredAttributes = filteredAttributes.filter(attr => 
      attr.categoryAttributeName.includes(categoryAttributeName)
    )
  }
  
  return {
    code: 200,
    msg: '操作成功',
    data: filteredAttributes
  }
})

// 4. 类型新增
Mock.mock('/dev-api/v1/category/add', 'post', (options) => {
  console.log('新增分类请求参数:', options.body)
  
  // 解析请求体
  let requestData = {}
  try {
    requestData = JSON.parse(options.body)
  } catch (e) {
    requestData = {}
  }
  
  // 生成新的分类ID
  const newId = Mock.Random.integer(1000, 9999)
  
  // 添加到分类列表
  const newCategory = {
    id: newId,
    categoryName: requestData.categoryName || '新分类',
    categoryDes: requestData.categoryDes || '',
    categoryCode: requestData.categoryCode || Mock.Random.string('upper', 3, 5),
    deviceCount: 0,
    attributeCount: requestData.attributes ? requestData.attributes.length : 0,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    createBy: 'admin',
    updateTime: null,
    updateBy: null,
    remark: requestData.remark || ''
  }
  
  categoryList.push(newCategory)
  
  return {
    code: 200,
    msg: '新增成功',
    data: {
      id: newId
    }
  }
})

// 5. 类型编辑
Mock.mock('/dev-api/v1/category/edit', 'put', (options) => {
  console.log('编辑分类请求参数:', options.body)
  
  // 解析请求体
  let requestData = {}
  try {
    requestData = JSON.parse(options.body)
  } catch (e) {
    requestData = {}
  }
  
  const categoryId = requestData.id
  
  if (!categoryId) {
    return {
      code: 500,
      msg: '分类ID不能为空'
    }
  }
  
  // 查找并更新分类
  const index = categoryList.findIndex(item => item.id === categoryId)
  
  if (index > -1) {
    categoryList[index] = {
      ...categoryList[index],
      categoryName: requestData.categoryName || categoryList[index].categoryName,
      categoryDes: requestData.categoryDes || categoryList[index].categoryDes,
      categoryCode: requestData.categoryCode || categoryList[index].categoryCode,
      attributeCount: requestData.attributes ? requestData.attributes.length : categoryList[index].attributeCount,
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateBy: 'admin',
      remark: requestData.remark || categoryList[index].remark
    }
    
    return {
      code: 200,
      msg: '编辑成功'
    }
  } else {
    return {
      code: 500,
      msg: '分类不存在'
    }
  }
})

// 6. 类型删除
Mock.mock(RegExp('/dev-api/v1/category/(\\d+)'), 'delete', (options) => {
  const categoryId = parseInt(options.url.match(/\/v1\/category\/(\d+)/)[1])
  
  console.log('删除分类ID:', categoryId)
  
  // 查找分类
  const index = categoryList.findIndex(item => item.id === categoryId)
  
  if (index > -1) {
    // 检查是否有关联设备
    if (categoryList[index].deviceCount > 0) {
      return {
        code: 500,
        msg: '该分类下存在设备，无法删除'
      }
    }
    
    // 删除分类
    categoryList.splice(index, 1)
    
    return {
      code: 200,
      msg: '删除成功'
    }
  } else {
    return {
      code: 500,
      msg: '分类不存在'
    }
  }
})

// 7. 获取分类详情
Mock.mock(RegExp('/dev-api/v1/category/(\\d+)'), 'get', (options) => {
  const categoryId = parseInt(options.url.match(/\/v1\/category\/(\d+)/)[1])
  
  // 查找分类
  const category = categoryList.find(item => item.id === categoryId)
  
  if (category) {
    return {
      code: 200,
      msg: '查询成功',
      data: {
        ...category,
        // 返回该分类的属性列表（模拟）
        attributes: attributeList.slice(0, category.attributeCount)
      }
    }
  } else {
    return {
      code: 500,
      msg: '分类不存在'
    }
  }
})

// 导出 Mock 配置
export default Mock

