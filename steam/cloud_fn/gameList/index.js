// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')
const getHtml = require('./getHtml')
const getData = require('./getData')

cloud.init()

// 获取数据库引用
const db = cloud.database({
  // 切换环境
  // env: 'steam-ze69m'
  env: 'steam-dev-k3q3r'
})

// 获取页面列表数据
async function getList (url) {
  const list = db.collection('list')
  const getSt = new Date()

  const doc = await list
    .where({
      url
    })
    .get()
  // 打印读库时间
  console.log('getList: ', new Date() - getSt + 'ms')
  return doc
}

// 存入页面列表数据
async function addList (url, res, isSaved) {
  const list = db.collection('list')
  const getSt = new Date()

  // 判断添加还是更新
  if (isSaved) {
    await list.set({
      data: {
        url,
        date: new Date().toLocaleDateString(),
        data: res
      }
    })
  } else {
    await list.add({
      data: {
        url,
        date: new Date().toLocaleDateString(),
        data: res
      }
    })
  }

  // 打印存库或更新时间
  console.log('addList: ', new Date() - getSt + 'ms')
}

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
  console.log('url: ', url)

  let res = null

  // 先读库，库里有并且没过期则用库里的数据，反之爬取数据并存库
  const doc = (await getList(url)).data[0]
  const isSaved = doc ? doc.hasOwnProperty('date') : false
  if (doc && doc.date === new Date().toLocaleDateString() && doc.data) {
    res = doc.data
  } else {
    const st = new Date()
    // 爬取页面
    const html = await getHtml({ url })
    // 打印爬取页面时间
    console.log('crawl: ', new Date() - st + 'ms')

    // 解析数据
    const $ = cheerio.load(html, { decodeEntities: false })
    res = await getData($)

    // 数据存库
    await addList(url, res, isSaved)
  }

  return res
}
