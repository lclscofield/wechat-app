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
      game.img = getAttr($(e), '.search_capsule img', 'src')
      // 游戏名
      game.title = getText($(e), '.title')
      // 发布时间
      game.released = getText($(e), '.search_released')
      // 简易评论图标
      let reviewClass = getAttr($(e), '.search_review_summary', 'class').split(' ')
      let reviewList = ['positive', 'mixed', 'negative']
      game.reviewImg = ''
      reviewList.some(item => {
        if (reviewClass.indexOf(item) !== -1) {
          game.reviewImg = `https://store.steampowered.com/public/images/v6/user_reviews_${item}.png`
          return true
        }
      })
      listData.push(game)
    })

  return listData
}

module.exports = getData
