// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')
const getHtml = require('./getHtml')
const getData = require('./getData')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // return {
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID
  // }

  const url = `https://store.steampowered.com/search/results?specials=1&page=${event.page}`

  const res = await getHtml({ url })
  const $ = cheerio.load(res, { decodeEntities: false })
  const data = await getData($)

  return data
}
