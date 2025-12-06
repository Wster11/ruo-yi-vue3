import Mock from 'mockjs'

// 语言列表数据
const languageList = [
    {
        "languageId": 1,
        "languageCode": "zh-CN",
        "languageName": "中文简体",
        "chineseStr": "简体中文",
        "createBy": "admin",
        "createTime": "2025-01-01 10:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "常用语言"
    },
    {
        "languageId": 2,
        "languageCode": "en-US",
        "languageName": "英语(美国)",
        "chineseStr": "English (United States)",
        "createBy": "admin",
        "createTime": "2025-01-02 11:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "常用语言"
    }
]

// 语言管理接口
export default [
    // 1. 查询语言列表（分页）
    {
        url: '/dev-api/v1/languages/list',
        method: 'get',
        response: ({ query }) => {
            const pageNum = parseInt(query.pageNum || '1')
            const pageSize = parseInt(query.pageSize || '10')
            const languageCode = query.languageCode
            const languageName = query.languageName

            // 筛选
            let filteredList = languageList

            if (languageCode) {
                filteredList = filteredList.filter(item =>
                    item.languageCode.toLowerCase().includes(languageCode.toLowerCase())
                )
            }

            if (languageName) {
                filteredList = filteredList.filter(item =>
                    item.languageName.includes(languageName)
                )
            }

            // 分页
            const total = filteredList.length
            const start = (pageNum - 1) * pageSize
            const end = start + pageSize
            const rows = filteredList.slice(start, end)

            return {
                code: 200,
                msg: '查询成功',
                total: total,
                rows: rows
            }
        }
    },

    // 2. 新增语言
    {
        url: '/dev-api/v1/languages/add',
        method: 'post',
        response: ({ body }) => {
            console.log('新增语言请求参数:', body)

            // 生成新的语言ID
            const newId = Mock.Random.integer(100, 999)

            // 添加到语言列表
            const newLanguage = {
                languageId: newId,
                languageCode: body.languageCode || '',
                languageName: body.languageName || '',
                chineseStr: body.chineseStr || '',
                createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                createBy: 'admin',
                updateBy: null,
                updateTime: null,
                remark: body.remark || ''
            }

            languageList.push(newLanguage)

            return {
                code: 200,
                msg: '新增成功',
                data: {
                    languageId: newId
                }
            }
        }
    },

    // 3. 编辑语言
    {
        url: '/dev-api/v1/languages/edit',
        method: 'put',
        response: ({ body }) => {
            console.log('编辑语言请求参数:', body)

            const languageId = body.languageId

            if (!languageId) {
                return {
                    code: 500,
                    msg: '语言ID不能为空'
                }
            }

            // 查找并更新语言
            const index = languageList.findIndex(item => item.languageId === languageId)

            if (index > -1) {
                languageList[index] = {
                    ...languageList[index],
                    languageCode: body.languageCode || languageList[index].languageCode,
                    languageName: body.languageName || languageList[index].languageName,
                    chineseStr: body.chineseStr || languageList[index].chineseStr,
                    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                    updateBy: 'admin',
                    remark: body.remark || languageList[index].remark
                }

                return {
                    code: 200,
                    msg: '编辑成功'
                }
            } else {
                return {
                    code: 500,
                    msg: '语言不存在'
                }
            }
        }
    },

    // 4. 删除语言
    {
        url: '/dev-api/v1/languages/:id',
        method: 'delete',
        response: ({ query }) => {
            const languageId = parseInt(query.id)

            console.log('删除语言ID:', languageId)

            // 查找语言
            const index = languageList.findIndex(item => item.languageId === languageId)

            if (index > -1) {
                // 删除语言
                languageList.splice(index, 1)

                return {
                    code: 200,
                    msg: '删除成功'
                }
            } else {
                return {
                    code: 500,
                    msg: '语言不存在'
                }
            }
        }
    }
]
