// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')

cloud.init()

const target = 'https://www.qu.la'
let href = ''

function getText ($, rule) {
  if (rule) {
    return $.find(rule)
      .text()
      .trim()
  }
  return $.text().trim()
}

function getAttr ($, rule, attr) {
  if (rule) {
    return target + $.find(rule).attr(attr)
  }
  return target + $.attr(attr)
}

async function getChapter ($) {
  const chapter = {}
  // 章节名
  chapter.title = getText($('.bookname h1'))
  // 上一章
  chapter.prev = href.slice(0, href.lastIndexOf('/') + 1) + getAttr($('#pager_prev'), '', 'href')
  // 下一章
  chapter.next = href.slice(0, href.lastIndexOf('/') + 1) + getAttr($('#pager_next'), '', 'href')
  // 内容
  const body = $('#content').html()
  chapter.ctx = body.slice(0, body.lastIndexOf('章节错误,点此举报'))
  return chapter
}

// 云函数入口函数
exports.main = async (event, context) => {
  href = event.href

  const res = await cloud.callFunction({
    name: 'getHtml',
    data: {
      url: href
    }
  })
  const $ = cheerio.load(res.result, { decodeEntities: false })

  const data = await getChapter($)
  return data
}
