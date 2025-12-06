import Mock from 'mockjs'

export default [
    // 获取首页统计数据
    {
        url: '/dev-api/v1/home/getCountInfo',
        method: 'get',
        response: () => {
            return {
                code: 200,
                msg: '操作成功',
                data: {
                    // 统计数据
                    deviceCount: Mock.Random.integer(100, 200),
                    fileCount: Mock.Random.integer(500, 800),
                    relatedRate: Mock.Random.float(85, 95, 1, 1),
                    scanTotal: Mock.Random.integer(1000, 2000),
                    categoryCount: Mock.Random.integer(10, 20),
                    languageCount: Mock.Random.integer(3, 8),

                    // 最新设备列表 (Top 5)
                    deviceNewList: [
                        {
                            id: 1,
                            categoryLabel: '传感器设备',
                            deviceModelName: 'TS-001',
                            categoryId: 10,
                            categoryName: '传感器设备',
                            categoryDes: '各类环境监测传感器',
                            delFlag: '0',
                            deviceModelId: 20,
                            deviceName: '温度传感器A',
                            deviceVersion: 1,
                            deviceUrl: 'https://example.com/device1.png',
                            deviceQrcodeUrl: 'https://qrcode.example.com/qrcode1.png',
                            deviceSerialAdd: '/dev/ttyUSB0',
                            deviceQrcodeDes: '用于监测环境温度',
                            deviceSerialEncrypt: 'TEMP_SENSOR_A_001',
                            createBy: 'admin',
                            createTime: '2025-12-05 14:32:07',
                            updateBy: '',
                            updateTime: null,
                            remark: '高性能温感设备',
                            devicebindFile: 'Y'
                        },
                        {
                            id: 2,
                            categoryLabel: '传感器设备',
                            deviceModelName: 'PS-100',
                            categoryId: 10,
                            categoryName: '传感器设备',
                            deviceName: '压力传感器B',
                            createBy: 'admin',
                            createTime: '2025-12-05 12:15:30',
                            devicebindFile: 'Y'
                        },
                        {
                            id: 3,
                            categoryLabel: '工业控制器',
                            deviceModelName: 'PLC-2000',
                            categoryId: 11,
                            categoryName: '工业控制器',
                            deviceName: 'PLC控制器C',
                            createBy: 'user1',
                            createTime: '2025-12-04 15:45:22',
                            devicebindFile: 'Y'
                        },
                        {
                            id: 4,
                            categoryLabel: '驱动设备',
                            deviceModelName: 'MD-500',
                            categoryId: 12,
                            categoryName: '驱动设备',
                            deviceName: '电机驱动器D',
                            createBy: 'user2',
                            createTime: '2025-12-04 10:30:15',
                            devicebindFile: 'N'
                        },
                        {
                            id: 5,
                            categoryLabel: 'HMI设备',
                            deviceModelName: 'HMI-10',
                            categoryId: 13,
                            categoryName: 'HMI设备',
                            deviceName: '触摸屏E',
                            createBy: 'admin',
                            createTime: '2025-12-03 14:20:08',
                            devicebindFile: 'Y'
                        }
                    ],

                    // 最新文件列表 (Top 5)
                    fileNewList: [
                        {
                            id: 1,
                            categoryLabel: '工业控制器',
                            deviceName: 'PLC-2000',
                            fileName: '设备操作手册.pdf',
                            fileType: 'pdf',
                            fileLanguage: '中文',
                            languageCode: 'zh-CN',
                            fileVersion: 'v1.0',
                            isAssociated: true,
                            associatedDeviceCount: 5,
                            categoryId: 1,
                            categoryName: '工业控制器',
                            modelId: 101,
                            modelName: 'PLC-2000',
                            fileBoundDevices: 'Y',
                            createTime: '2025-12-05 09:00:00',
                            createBy: 'admin',
                            updateTime: '2025-12-05 14:15:30',
                            updateBy: 'tech_support',
                            remark: '标准操作手册'
                        },
                        {
                            id: 2,
                            categoryLabel: '传感器设备',
                            deviceName: 'TS-001',
                            fileName: '电路原理图_A3.dwg',
                            fileType: 'dwg',
                            categoryId: 2,
                            categoryName: '传感器设备',
                            fileBoundDevices: 'Y',
                            createTime: '2025-12-04 16:20:00',
                            createBy: 'engineer'
                        },
                        {
                            id: 3,
                            categoryLabel: '驱动设备',
                            deviceName: 'MD-500',
                            fileName: '操作指南_2025.docx',
                            fileType: 'docx',
                            categoryId: 3,
                            categoryName: '驱动设备',
                            fileBoundDevices: 'N',
                            createTime: '2025-12-04 11:10:00',
                            createBy: 'admin'
                        },
                        {
                            id: 4,
                            categoryLabel: 'HMI设备',
                            deviceName: 'HMI-10',
                            fileName: '固件更新日志.txt',
                            fileType: 'txt',
                            categoryId: 4,
                            categoryName: 'HMI设备',
                            fileBoundDevices: 'Y',
                            createTime: '2025-12-03 14:30:00',
                            createBy: 'dev'
                        },
                        {
                            id: 5,
                            categoryLabel: '工业控制器',
                            deviceName: 'PLC-2000',
                            fileName: '安装验收单.pdf',
                            fileType: 'pdf',
                            categoryId: 1,
                            categoryName: '工业控制器',
                            fileBoundDevices: 'Y',
                            createTime: '2025-12-03 09:15:00',
                            createBy: 'manager'
                        }
                    ]
                }
            }
        }
    }
]
