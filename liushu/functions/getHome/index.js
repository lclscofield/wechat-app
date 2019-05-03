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

function getCategory ($, i) {
  const parent = 'novelslist' + i
  let categoryList = []
  $(`#${parent} .content`).each(function (idx) {
    let categoryItem = {}
    categoryItem.list = []
    categoryItem.title = getText($(this), 'h2')
    categoryItem.top = {
      bookName: getText($(this), 'a'),
      imgUrl: getAttr($(this), 'img', 'src'),
      href: getAttr($(this), 'a', 'href'),
      bookDesc: getText($(this), 'dd')
    }

    $(this)
      .find('li')
      .each(function (idx2) {
        let item = {
          bookName: getText($(this), 'a'),
          href: getAttr($(this), 'a', 'href')
        }
        let text = $(this)
          .contents()
          .filter(function () {
            return this.nodeType === 3
          })

        item.author = getText($(text)).slice(1)
        categoryItem.list.push(item)
      })
    categoryList.push(categoryItem)
  })
  return categoryList
}

async function home ($) {
  // 热门
  let hot = {}
  hot.title = '热门'
  hot.list = []
  $('#hotcontent .l .item').each(function (idx) {
    hot.list.push({
      href: getAttr($(this), 'a', 'href'),
      imgUrl: getAttr($(this), 'img', 'src')
    })
  })

  // 推荐
  let recommend = {}
  recommend.list = []
  recommend.title = getText($('#hotcontent .r h2'))
  $('#hotcontent .r li').each(function (idx) {
    recommend.list.push({
      type: getText($(this), '.s1'),
      bookName: getText($(this), '.s2'),
      href: getAttr($(this), '.s2 a', 'href'),
      author: getText($(this), '.s5')
    })
  })

  // 类别
  let category = []
  category = category.concat(getCategory($, 1)).concat(getCategory($, 2))

  return {
    hot,
    recommend,
    category
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.callFunction({
    name: 'getHtml',
    data: {
      url: target
    }
  })
  const $ = cheerio.load(res.result, { decodeEntities: false })

  const data = await home($)
  return data
}
