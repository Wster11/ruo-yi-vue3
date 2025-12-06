import request from '@/utils/request'

/**
 * 查询语言字典列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.dicKey - 字典键
 * @param {string} params.languageCode - 语言类型
 * @param {string} params.module - 模块
 * @returns {Promise}
 */
export function getLanguageDicList(params) {
    return request({
        url: '/v1/languagesDic/list',
        method: 'get',
        params
    })
}

/**
 * 新增语言字典
 * @param {Object} data - 字典数据
 * @param {string} data.dicKey - 字典键
 * @param {string} data.dicValue - 字典值
 * @param {string} data.languageCode - 语言类型
 * @param {string} data.languageName - 语言名称
 * @param {string} data.module - 模块
 * @returns {Promise}
 */
export function addLanguageDic(data) {
    return request({
        url: '/v1/languagesDic/add',
        method: 'post',
        data
    })
}

/**
 * 编辑语言字典
 * @param {Object} data - 字典数据
 * @param {number} data.languageDicId - 字典ID
 * @param {string} data.dicKey - 字典键
 * @param {string} data.dicValue - 字典值
 * @param {string} data.languageCode - 语言类型
 * @param {string} data.languageName - 语言名称
 * @param {string} data.module - 模块
 * @returns {Promise}
 */
export function editLanguageDic(data) {
    return request({
        url: '/v1/languagesDic/edit',
        method: 'put',
        data
    })
}

/**
 * 删除语言字典
 * @param {number} id - 字典ID
 * @returns {Promise}
 */
export function deleteLanguageDic(id) {
    return request({
        url: `/v1/languagesDic/${id}`,
        method: 'delete'
    })
}
