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
  let url = ''
  if (event.cb === 'specials') {
    url = `https://store.steampowered.com/search/results?l=schinese&specials=1&page=${event.page}`
  } else if (event.cb === 'topsellers') {
    url = `https://store.steampowered.com/search/results?l=schinese&filter=topsellers&page=${event.page}`
  } else if (event.cb === 'popularnew') {
    url = `https://store.steampowered.com/search/results?l=schinese&filter=popularnew&page=${event.page}`
  } else if (event.cb === 'comingsoon') {
    url = `https://store.steampowered.com/search/results?l=schinese&filter=comingsoon&page=${event.page}`
  } else if (event.cb === 'search') {
    url = `https://store.steampowered.com/search/results?l=schinese&term=${event.search}&page=${event.page}`
  }
  console.log(url)

  const res = await getHtml({ url })
  const $ = cheerio.load(res, { decodeEntities: false })
  const data = await getData($)

  return data
}
