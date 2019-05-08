// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')

cloud.init()

const target = 'https://www.qu.la'
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

async function getCatalog ($) {
  const catalog = []
  let isCtx = false
  $('#list dl')
    .children()
    .each(function (idx) {
      if (isCtx) {
        catalog.push({
          chapterTitle: getText($(this), 'a'),
          href: getAttr($(this), 'a', 'href')
        })
      }
      if ($(this).prop('tagName') === 'DT' && !/缓存技术/.test(getText($(this)))) {
        isCtx = true
      }
    })
  return catalog
}

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.callFunction({
    name: 'getHtml',
    data: {
      url: event.url
    }
  })
  const $ = cheerio.load(res.result, { decodeEntities: false })
  const data = await getCatalog($)

  return data
}
