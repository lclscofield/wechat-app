// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')

cloud.init()

const target = 'https://www.qu.la'
let url = '' // 书籍地址

function getText ($, rule) {
  if (rule) {
    return $.find(rule)
      .text()
      .trim()
  }
  return $.text().trim()
}

function getAttr ($, rule, attr) {
  return target + $.find(rule).attr(attr)
}

async function getDetail ($) {
  let detail = {}
  // 封面图
  detail.imgUrl = getAttr($('#fmimg'), 'img', 'src')
  // 书名
  detail.bookName = getText($('#info'), 'h1')
  // 书籍信息
  $('#info p').each(function (idx) {
    switch (true) {
      case idx === 0: // 作者
        let author = getText($(this))
        detail.author = author.slice(author.indexOf('：') + 1)
        break
      case idx === 2: // 最后更新时间
        let lastUpdate = getText($(this))
        detail.lastUpdate = lastUpdate.slice(lastUpdate.indexOf('：') + 1)
        break
      case idx === 3: // 最新章节
        let lastChapter = {}
        let lastChapterTitle = getText($(this))
        lastChapter.chapterTitle = lastChapterTitle.slice(lastChapterTitle.indexOf('：') + 1)
        lastChapter.href =
          url.slice(0, url.lastIndexOf('/') + 1) +
          $(this)
            .find('a')
            .attr('href')
        detail.lastChapter = lastChapter
        break
    }
  })
  // 简介
  detail.desc = getText($('#intro'))
  // 第一章节
  $('#list dl')
    .children()
    .each(function (idx) {
      if ($(this).prop('tagName') === 'DT' && idx === 0) {
        detail.firstChapter = {
          chapterTitle: getText($(this).next()),
          href: getAttr($(this).next(), 'a', 'href')
        }
      }
      if ($(this).prop('tagName') === 'DT' && !/缓存技术/.test(getText($(this)))) {
        detail.firstChapter = {
          chapterTitle: getText($(this).next()),
          href: getAttr($(this).next(), 'a', 'href')
        }
        return false
      }
    })

  return detail
}

// 云函数入口函数
exports.main = async (event, context) => {
  url = event.url
  const res = await cloud.callFunction({
    name: 'getHtml',
    data: {
      url: url
    }
  })
  const $ = cheerio.load(res.result, { decodeEntities: false })

  const data = await getDetail($)
  return data
}
