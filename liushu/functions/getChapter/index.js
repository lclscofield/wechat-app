// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')

cloud.init()

let href = ''

function getText ($, rule) {
  if (rule) {
    return $.find(rule)
      .text()
      .trim()
  }
  return $.text().trim()
}

async function getChapter ($) {
  const chapter = {}
  // 章节名
  chapter.title = getText($('.bookname h1'))
  // 上一章
  const prevHref = $('#pager_prev').attr('href')
  chapter.prev = prevHref === './' ? '' : href.slice(0, href.lastIndexOf('/') + 1) + prevHref
  // 下一章
  const nextHref = $('#pager_next').attr('href')
  chapter.next = nextHref === './' ? '' : href.slice(0, href.lastIndexOf('/') + 1) + nextHref
  // 内容
  const body = $('#content').html()
  let text = body.slice(0, body.lastIndexOf('章节错误,点此举报'))
  chapter.ctx = text
  console.log(text)
  console.log(chapter.ctx)
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
