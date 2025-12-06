import request from '@/utils/request'

/**
 * 查询语言列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.languageCode - 语言类型
 * @param {string} params.languageName - 语言描述
 * @returns {Promise}
 */
export function getLanguageList(params) {
    return request({
        url: '/v1/languages/list',
        method: 'get',
        params
    })
}

/**
 * 新增语言
 * @param {Object} data - 语言数据
 * @param {string} data.languageCode - 语言类型
 * @param {string} data.languageName - 语言描述
 * @param {string} data.chineseStr - 中文解释
 * @returns {Promise}
 */
export function addLanguage(data) {
    return request({
        url: '/v1/languages/add',
        method: 'post',
        data
    })
}

/**
 * 编辑语言
 * @param {Object} data - 语言数据
 * @param {number} data.languageId - 语言ID
 * @param {string} data.languageCode - 语言类型
 * @param {string} data.languageName - 语言描述
 * @param {string} data.chineseStr - 中文解释
 * @returns {Promise}
 */
export function editLanguage(data) {
    return request({
        url: '/v1/languages/edit',
        method: 'put',
        data
    })
}

/**
 * 删除语言
 * @param {number} id - 语言ID
 * @returns {Promise}
 */
export function deleteLanguage(id) {
    return request({
        url: `/v1/languages/${id}`,
        method: 'delete'
    })
}
