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
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  let url = event.url + '&l=schinese'
  console.log('url: ', url)

  const st = new Date()
  const res = await getHtml({ url })
  // 打印爬取页面时间
  console.log('crawl: ', new Date() - st + 'ms')

  const $ = cheerio.load(res, { decodeEntities: false })
  const data = await getData($)

  return data
}
