import request from '@/utils/request'

/**
 * 查询设备型号列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {number} params.categoryId - 设备分类ID
 * @param {string} params.deviceModelName - 设备型号名称
 * @returns {Promise}
 */
export function getDeviceModelList(params) {
    return request({
        url: '/v1/deviceModel/list',
        method: 'get',
        params
    })
}

/**
 * 获取设备分类列表（用于下拉选择）
 * @returns {Promise}
 */
export function getCategoryList() {
    return request({
        url: '/v1/deviceModel/categories',
        method: 'get'
    })
}

/**
 * 新增设备型号
 * @param {Object} data - 型号数据
 * @param {number} data.categoryId - 设备分类ID
 * @param {string} data.deviceModelName - 设备型号名称
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function addDeviceModel(data) {
    return request({
        url: '/v1/deviceModel/add',
        method: 'post',
        data
    })
}

/**
 * 编辑设备型号
 * @param {Object} data - 型号数据
 * @param {number} data.deviceModelId - 型号ID
 * @param {number} data.categoryId - 设备分类ID
 * @param {string} data.deviceModelName - 设备型号名称
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function editDeviceModel(data) {
    return request({
        url: '/v1/deviceModel/edit',
        method: 'put',
        data
    })
}

/**
 * 删除设备型号
 * @param {number} id - 型号ID
 * @returns {Promise}
 */
export function deleteDeviceModel(id) {
    return request({
        url: `/v1/deviceModel/${id}`,
        method: 'delete'
    })
}
