import request from '@/utils/request'

/**
 * 设备分类管理 API
 */

// 1. 获取分类列表（支持分页和搜索）
export function getCategoryList(query) {
  return request({
    url: '/v1/category/list',
    method: 'get',
    params: query
  })
}

// 2. 获取分类名称列表（用于下拉选择）
export function getCategoryNameList() {
  return request({
    url: '/v1/category/getCategoryNameList',
    method: 'get'
  })
}

// 3. 获取参数列表
export function getAttributeList(query) {
  return request({
    url: '/v1/category/getAttributeList',
    method: 'get',
    params: query
  })
}

// 4. 新增分类
export function addCategory(data) {
  return request({
    url: '/v1/category/add',
    method: 'post',
    data: data
  })
}

// 5. 编辑分类
export function editCategory(data) {
  return request({
    url: '/v1/category/edit',
    method: 'put',
    data: data
  })
}

// 6. 删除分类
export function deleteCategory(id) {
  return request({
    url: `/v1/category/${id}`,
    method: 'delete'
  })
}

// 7. 获取分类详情
export function getCategoryDetail(id) {
  return request({
    url: `/v1/category/${id}`,
    method: 'get'
  })
}

