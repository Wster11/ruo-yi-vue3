import Mock from 'mockjs'

// 语言字典列表数据
const languageDicList = [
    {
        "id": 1,
        "dataType": "1",
        "chineseStr": "操作手册",
        "languageId": 0,
        "languageCode": "zh-cn",
        "languageName": "中文",
        "targetStr": "操作手册",
        "createBy": "string",
        "createTime": "string",
        "updateBy": "string",
        "updateTime": null,
        "remark": "string"
    },
    {
        "id": 2,
        "dataType": "2",
        "chineseStr": "描述",
        "languageId": 1,
        "languageCode": "en",
        "languageName": "英文",
        "targetStr": "desc",
        "createBy": "string",
        "createTime": "string",
        "updateBy": "string",
        "updateTime": null,
        "remark": "string"
    }
]

// 语言字典管理接口
export default [
    // 1. 查询语言字典列表（分页）
    {
        url: '/dev-api/v1/languagesDic/list',
        method: 'get',
        response: ({ query }) => {
            const pageNum = parseInt(query.pageNum || '1')
            const pageSize = parseInt(query.pageSize || '10')
            const dicKey = query.dicKey
            const languageCode = query.languageCode
            const module = query.module

            // 筛选
            let filteredList = languageDicList

            if (dicKey) {
                filteredList = filteredList.filter(item =>
                    item.dicKey.toLowerCase().includes(dicKey.toLowerCase())
                )
            }

            if (languageCode) {
                filteredList = filteredList.filter(item =>
                    item.languageCode.toLowerCase().includes(languageCode.toLowerCase())
                )
            }

            if (module) {
                filteredList = filteredList.filter(item =>
                    item.module.toLowerCase().includes(module.toLowerCase())
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

    // 2. 新增语言字典
    {
        url: '/dev-api/v1/languagesDic/add',
        method: 'post',
        response: ({ body }) => {
            console.log('新增语言字典请求参数:', body)

            // 生成新的字典ID
            const newId = Mock.Random.integer(100, 999)

            // 添加到字典列表
            const newDic = {
                languageDicId: newId,
                dicKey: body.dicKey || '',
                dicValue: body.dicValue || '',
                languageCode: body.languageCode || '',
                languageName: body.languageName || '',
                module: body.module || '',
                createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                createBy: 'admin',
                updateBy: null,
                updateTime: null,
                remark: body.remark || ''
            }

            languageDicList.push(newDic)

            return {
                code: 200,
                msg: '新增成功',
                data: {
                    languageDicId: newId
                }
            }
        }
    },

    // 3. 编辑语言字典
    {
        url: '/dev-api/v1/languagesDic/edit',
        method: 'put',
        response: ({ body }) => {
            console.log('编辑语言字典请求参数:', body)

            const languageDicId = body.languageDicId

            if (!languageDicId) {
                return {
                    code: 500,
                    msg: '字典ID不能为空'
                }
            }

            // 查找并更新字典
            const index = languageDicList.findIndex(item => item.languageDicId === languageDicId)

            if (index > -1) {
                languageDicList[index] = {
                    ...languageDicList[index],
                    dicKey: body.dicKey || languageDicList[index].dicKey,
                    dicValue: body.dicValue || languageDicList[index].dicValue,
                    languageCode: body.languageCode || languageDicList[index].languageCode,
                    languageName: body.languageName || languageDicList[index].languageName,
                    module: body.module || languageDicList[index].module,
                    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                    updateBy: 'admin',
                    remark: body.remark || languageDicList[index].remark
                }

                return {
                    code: 200,
                    msg: '编辑成功'
                }
            } else {
                return {
                    code: 500,
                    msg: '字典不存在'
                }
            }
        }
    },

    // 4. 删除语言字典
    {
        url: '/dev-api/v1/languagesDic/:id',
        method: 'delete',
        response: ({ query }) => {
            const languageDicId = parseInt(query.id)

            console.log('删除语言字典ID:', languageDicId)

            // 查找字典
            const index = languageDicList.findIndex(item => item.languageDicId === languageDicId)

            if (index > -1) {
                // 删除字典
                languageDicList.splice(index, 1)

                return {
                    code: 200,
                    msg: '删除成功'
                }
            } else {
                return {
                    code: 500,
                    msg: '字典不存在'
                }
            }
        }
    }
]
