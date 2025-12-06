import Mock from 'mockjs'

// 设备分类列表（用于下拉选择）
const categories = [
    { categoryId: 1, categoryName: '工业控制器' },
    { categoryId: 2, categoryName: '传感器设备' },
    { categoryId: 3, categoryName: '执行器' },
    { categoryId: 4, categoryName: '通信设备' },
    { categoryId: 5, categoryName: '电源设备' }
]

// 设备型号列表数据
const deviceModelList = [
    {
        "deviceModelId": 1,
        "categoryId": 1,
        "categoryName": "工业控制器",
        "deviceModelName": "PLC-2000",
        "createBy": "admin",
        "createTime": "2025-01-01 10:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "高性能PLC控制器"
    },
    {
        "deviceModelId": 2,
        "categoryId": 2,
        "categoryName": "传感器设备",
        "deviceModelName": "DHT22",
        "createBy": "admin",
        "createTime": "2025-01-02 11:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "温湿度传感器"
    },
    {
        "deviceModelId": 3,
        "categoryId": 3,
        "categoryName": "执行器",
        "deviceModelName": "SERVO-300",
        "createBy": "admin",
        "createTime": "2025-01-03 12:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "伺服电机"
    },
    {
        "deviceModelId": 4,
        "categoryId": 2,
        "categoryName": "传感器设备",
        "deviceModelName": "PT-100",
        "createBy": "admin",
        "createTime": "2025-01-04 13:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "温度传感器"
    },
    {
        "deviceModelId": 5,
        "categoryId": 4,
        "categoryName": "通信设备",
        "deviceModelName": "Gateway-5G",
        "createBy": "admin",
        "createTime": "2025-01-05 14:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "5G网关"
    },
    {
        "deviceModelId": 6,
        "categoryId": 5,
        "categoryName": "电源设备",
        "deviceModelName": "UPS-1000",
        "createBy": "admin",
        "createTime": "2025-01-06 15:00:00",
        "updateBy": null,
        "updateTime": null,
        "remark": "不间断电源"
    }
]

// 设备型号管理接口
export default [
    // 1. 查询设备型号列表（分页）
    {
        url: '/dev-api/v1/deviceModel/list',
        method: 'get',
        response: ({ query }) => {
            const pageNum = parseInt(query.pageNum || '1')
            const pageSize = parseInt(query.pageSize || '10')
            const categoryId = query.categoryId ? parseInt(query.categoryId) : null
            const deviceModelName = query.deviceModelName

            // 筛选
            let filteredList = deviceModelList

            if (categoryId) {
                filteredList = filteredList.filter(item => item.categoryId === categoryId)
            }

            if (deviceModelName) {
                filteredList = filteredList.filter(item =>
                    item.deviceModelName.toLowerCase().includes(deviceModelName.toLowerCase())
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

    // 获取设备分类列表（用于下拉选择）
    {
        url: '/dev-api/v1/deviceModel/categories',
        method: 'get',
        response: () => {
            return {
                code: 200,
                msg: '查询成功',
                data: categories
            }
        }
    },

    // 2. 新增设备型号
    {
        url: '/dev-api/v1/deviceModel/add',
        method: 'post',
        response: ({ body }) => {
            console.log('新增设备型号请求参数:', body)

            // 生成新的型号ID
            const newId = Mock.Random.integer(100, 999)

            // 查找分类名称
            const category = categories.find(c => c.categoryId === body.categoryId)

            // 添加到型号列表
            const newModel = {
                deviceModelId: newId,
                categoryId: body.categoryId,
                categoryName: category ? category.categoryName : '',
                deviceModelName: body.deviceModelName || '',
                createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                createBy: 'admin',
                updateBy: null,
                updateTime: null,
                remark: body.remark || ''
            }

            deviceModelList.push(newModel)

            return {
                code: 200,
                msg: '新增成功',
                data: {
                    deviceModelId: newId
                }
            }
        }
    },

    // 3. 编辑设备型号
    {
        url: '/dev-api/v1/deviceModel/edit',
        method: 'put',
        response: ({ body }) => {
            console.log('编辑设备型号请求参数:', body)

            const deviceModelId = body.deviceModelId

            if (!deviceModelId) {
                return {
                    code: 500,
                    msg: '型号ID不能为空'
                }
            }

            // 查找并更新型号
            const index = deviceModelList.findIndex(item => item.deviceModelId === deviceModelId)

            if (index > -1) {
                // 查找分类名称
                const category = categories.find(c => c.categoryId === body.categoryId)

                deviceModelList[index] = {
                    ...deviceModelList[index],
                    categoryId: body.categoryId || deviceModelList[index].categoryId,
                    categoryName: category ? category.categoryName : deviceModelList[index].categoryName,
                    deviceModelName: body.deviceModelName || deviceModelList[index].deviceModelName,
                    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                    updateBy: 'admin',
                    remark: body.remark || deviceModelList[index].remark
                }

                return {
                    code: 200,
                    msg: '编辑成功'
                }
            } else {
                return {
                    code: 500,
                    msg: '型号不存在'
                }
            }
        }
    },

    // 4. 删除设备型号
    {
        url: '/dev-api/v1/deviceModel/:id',
        method: 'delete',
        response: ({ query }) => {
            const deviceModelId = parseInt(query.id)

            console.log('删除设备型号ID:', deviceModelId)

            // 查找型号
            const index = deviceModelList.findIndex(item => item.deviceModelId === deviceModelId)

            if (index > -1) {
                // 删除型号
                deviceModelList.splice(index, 1)

                return {
                    code: 200,
                    msg: '删除成功'
                }
            } else {
                return {
                    code: 500,
                    msg: '型号不存在'
                }
            }
        }
    }
]
