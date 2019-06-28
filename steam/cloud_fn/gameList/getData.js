// 获取数据
function getText ($, rule) {
  if (rule) {
    return $.find(rule)
      .text()
      .trim()
  }
  return $.text().trim()
}

function getAttr ($, rule, attr) {
  return $.find(rule).attr(attr)
}

async function getData ($) {
  let listData = []
  $('#search_result_container')
    .find('.search_result_row')
    .each((idx, e) => {
      let game = {}
      // 小图
      game.imgMin = getAttr($(e), '.search_capsule img', 'src')
      game.imgMin = game.imgMin ? game.imgMin.replace(/sm_120/, '231x87') : ''
      // 游戏名
      game.title = getText($(e), '.title')
      // 发布时间
      game.released = getText($(e), '.search_released')
      // 简易评论图标
      game.reviewImg = ''
      let reviewClassNames = getAttr($(e), '.search_review_summary', 'class')
      // 碰到这里为空的错误, 做一下判断
      if (reviewClassNames) {
        let reviewClass = reviewClassNames.split(' ')
        let reviewList = ['positive', 'mixed', 'negative']
        reviewList.some(item => {
          if (reviewClass.indexOf(item) !== -1) {
            game.reviewImg = `https://store.steampowered.com/public/images/v6/user_reviews_${item}.png`
            return true
          }
        })
      }
      // 折扣信息
      game.discount = getText($(e), '.search_discount')
      // 价格
      let price = getText($(e), '.search_price.discounted')
      if (price) { // 有折扣
        game.price = getText($(e), 'strike') // 原价
        game.strike = price.slice(price.lastIndexOf('¥')) // 折后价
      } else { // 无折扣
        game.price = ''
        game.strike = getText($(e), '.search_price') // 原价
      }

      listData.push(game)
    })

  return listData
}

module.exports = getData
