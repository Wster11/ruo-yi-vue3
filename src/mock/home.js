import Mock from 'mockjs'
// 模拟获取首页数据
Mock.mock('/dev-api/v1/home/getCountInfo', 'get', () => {
    return {
        code: 200,
        msg: '操作成功',
        data: {
            // 统计数据 - 字段名要与模板中的 userCountInfo 匹配
            deviceCount: Mock.Random.integer(100, 200),
            fileCount: Mock.Random.integer(500, 800),
            relatedRate: Mock.Random.float(85, 95, 1, 1),
            scanTotal: Mock.Random.integer(1000, 2000),
            categoryCount: Mock.Random.integer(10, 20),
            languageCount: Mock.Random.integer(3, 8),

            // 最新设备列表 (Top 5)
            deviceNewList: [
                {
                    "id": 1,
                    categoryLabel: '设备分类',
                    deviceModelName: '设备型号',
                    "categoryId": 10,
                    "categoryName": "传感器设备",
                    "categoryDes": "各类环境监测传感器",
                    "delFlag": "0",
                    "deviceModelId": 20,
                    "deviceModelName": "DHT22温湿度传感器",
                    "deviceName": "温度传感器A",
                    "deviceVersion": 1,
                    "deviceUrl": "https://example.com/device1.png",
                    "deviceQrcodeUrl": "https://qrcode.example.com/qrcode1.png",
                    "deviceSerialAdd": "/dev/ttyUSB0",
                    "deviceQrcodeDes": "用于监测环境温度",
                    "deviceSerialEncrypt": "TEMP_SENSOR_A_001",
                    "createBy": "admin",
                    "createTime": "2025-12-02 13:32:07",
                    "updateBy": "",
                    "updateTime": null,
                    "remark": "高性能温感设备",
                    "devicebindFile": "Y"
                }
            ],
            "fileNewList": [
                {
                    "id": 1,
                    categoryLabel: '关联设备分类',
                    deviceName: '设备名称',
                    "fileName": "设备操作手册.pdf",
                    "fileType": "pdf",
                    "fileLanguage": "中文",
                    "languageCode": "zh-CN",
                    "fileVersion": "v1.0",
                    "isAssociated": true,
                    "associatedDeviceCount": 5,
                    "categoryId": 1,
                    "categoryName": "工业控制器",
                    "modelId": 101,
                    "modelName": "PLC-2000",
                    "fileBoundDevices": "Y",
                    "createTime": "2025-12-02 13:32:07",
                    "createBy": "admin",
                    "updateTime": "2025-12-02 14:15:30",
                    "updateBy": "tech_support",
                    "remark": "标准操作手册"
                }
            ]
        }
    }
})

// 导出 Mock 配置（可选，用于在 main.js 中引入）
export default Mock
