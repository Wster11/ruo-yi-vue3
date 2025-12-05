import request from '@/utils/request'

/**
 * 设备管理 API
 */

// 1. 获取设备列表（支持分页和多维度筛选）
export function getDeviceList(query) {
  return request({
    url: '/v1/device/list',
    method: 'get',
    params: query
  })
}

// 2. 获取分类下拉列表
export function getCategoryAll() {
  return request({
    url: '/v1/device/categoryAll',
    method: 'get'
  })
}

// 3. 获取设备参数设置列表
export function getCategoryAttributeList(query) {
  return request({
    url: '/v1/device/getCategoryAttributeList',
    method: 'get',
    params: query
  })
}

// 4. 查询设备型号列表
export function getDeviceModelList(query) {
  return request({
    url: '/v1/device/getDeviceModelList',
    method: 'get',
    params: query
  })
}

// 5. 查询设备编码列表
export function getDeviceCodeList(query) {
  return request({
    url: '/v1/device/getDeviceCodeList',
    method: 'get',
    params: query
  })
}

// 6. 新增设备
export function addDevice(data) {
  return request({
    url: '/v1/device/add',
    method: 'post',
    data: data
  })
}

// 7. 编辑设备
export function editDevice(data) {
  return request({
    url: '/v1/device/edit',
    method: 'put',
    data: data
  })
}

// 8. 删除设备
export function deleteDevice(id) {
  return request({
    url: `/v1/device/${id}`,
    method: 'delete'
  })
}

// 9. 获取设备详情
export function getDeviceDetail(id) {
  return request({
    url: `/v1/device/${id}`,
    method: 'get'
  })
}

// 10. 获取关联设备文件列表
export function getDeviceBindFileList(query) {
  return request({
    url: '/v1/device/getDeviceBindFileList',
    method: 'get',
    params: query
  })
}

// 11. 获取文件列表（用于关联）
export function getDeviceFileList(query) {
  return request({
    url: '/v1/device/getDeviceFileList',
    method: 'get',
    params: query
  })
}

// 12. 确认关联文件
export function bindSelectFile(data) {
  return request({
    url: '/v1/device/bindSelectFile',
    method: 'post',
    data: data
  })
}

// 13. 获取语言列表
export function getLanguageList() {
  return request({
    url: '/v1/device/geLanguageList',
    method: 'get'
  })
}

// 14. 获取文档类型列表
export function getDocumentTypeList() {
  return request({
    url: '/v1/device/getDocumentTypeList',
    method: 'get'
  })
}

// 15. 批量上传文件
export function uploadFileList(data) {
  return request({
    url: '/v1/device/uploadFileList',
    method: 'post',
    data: data
  })
}

