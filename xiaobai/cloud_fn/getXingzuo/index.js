// 云函数入口文件
const cloud = require('wx-server-sdk')
const app = require('./key')
const Client = require('aliyun-api-gateway').Client
const client = new Client(app.AppKey, app.AppSecret)
const test = require('./test')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const url = 'https://ali-star-lucky.showapi.com/star'

  // const res = await client.get(url, {
  //   data: {
  //     star: event.type,
  //     needTomorrow: 1,
  //     needWeek: 1,
  //     needMonth: 1,
  //     needYear: 1
  //   }
  // })

  // return JSON.parse(res.showapi_res_body)
  return test
}
