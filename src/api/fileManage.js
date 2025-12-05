import request from '@/utils/request'

/**
 * 文件管理 API
 */

// 1. 获取文件列表（支持分页和多维度筛选）
export function getFileList(query) {
  return request({
    url: '/v1/fileManager/list',
    method: 'get',
    params: query
  })
}

// 2. 获取语言列表
export function getLanguageList() {
  return request({
    url: '/v1/fileManager/geLanguageList',
    method: 'get'
  })
}

// 3. 获取文件类型列表
export function getDocumentTypeList() {
  return request({
    url: '/v1/fileManager/getDocumentTypeList',
    method: 'get'
  })
}

// 4. 获取分类列表
export function getCategoryList() {
  return request({
    url: '/v1/fileManager/getCategoryList',
    method: 'get'
  })
}

// 5. 获取设备列表
export function getDeviceList() {
  return request({
    url: '/v1/fileManager/getDeviceList',
    method: 'get'
  })
}

// 6. 新增文件
export function addFile(data) {
  return request({
    url: '/v1/fileManager/add',
    method: 'post',
    data: data
  })
}

// 7. 更新文件版本
export function updateFileVersion(query) {
  return request({
    url: '/v1/fileManager/updateFileVersio',
    method: 'get',
    params: query
  })
}

// 8. 获取所有设备列表（用于关联）
export function getDeviceAllList(query) {
  return request({
    url: '/v1/fileManager/getDeviceAllList',
    method: 'get',
    params: query
  })
}

// 9. 绑定选中的设备
export function bindSelectDevice(query) {
  return request({
    url: '/v1/fileManager/bindSelectDevice',
    method: 'post',
    params: query
  })
}

// 10. 获取文件已绑定的设备列表
export function getBindDeviceList(query) {
  return request({
    url: '/v1/fileManager/getBindDeviceList',
    method: 'get',
    params: query
  })
}

