// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

async function getHtml (options) {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        resolve(body)
      } else {
        reject(err || '请求错误')
      }
    })
  })
}

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await getHtml({ url: event.url })
  return res
}
