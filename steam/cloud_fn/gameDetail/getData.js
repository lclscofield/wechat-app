// 获取数据
function getText ($, rule) {
  if (rule) {
    return (
      $.find(rule)
        .text()
        .trim() || ''
    )
  }
  return $.text().trim() || ''
}

function getAttr ($, rule, attr) {
  if (rule) {
    return $.find(rule).attr(attr) || ''
  }
  return $.attr(attr) || ''
}

async function getData ($) {
  const st = new Date()
  let gameData = {}
  // top, 基本信息
  // appName
  gameData.appName = getText($('.apphub_HeaderStandardTop .apphub_AppName'))
  // appIcon
  gameData.appIcon = getAttr($('.apphub_HeaderStandardTop .apphub_AppIcon img'), '', 'src')
  // 大图
  gameData.imgMax = getAttr($('.game_background_glow .game_header_image_full'), '', 'src')
  // 描述
  gameData.desc = getText($('.game_background_glow .game_description_snippet'))
  // 简易评测
  gameData.summaryReview = {
    lately: '',
    all: ''
  }
  $('.user_reviews .user_reviews_summary_row').each((idx, e) => {
    if (idx === 0) {
      // 最近评测
      gameData.summaryReview.lately = getText($(e))
    } else if (idx === 1) {
      // 全部评测
      gameData.summaryReview.all = getText($(e))
    }
  })
  // 发行日期
  gameData.releaseDate = getText($('.user_reviews .release_date'))
  // 开发商和发行商
  gameData.personData = {
    devPerson: '',
    pubPerson: ''
  }
  $('.user_reviews .dev_row').each((idx, e) => {
    if (idx === 0) {
      // 开发商
      gameData.personData.devPerson = getText($(e))
    } else if (idx === 1) {
      // 发行商
      gameData.personData.pubPerson = getText($(e))
    }
  })
  // 热门标签
  gameData.tags = []
  $('.popular_tags a.app_tag').each((idx, e) => {
    gameData.tags.push(getText($(e)))
  })
  // 视频列表
  gameData.videos = []
  $('div.highlight_movie').each((idx, e) => {
    let video = {}
    video.src = getAttr($(e), '', 'data-mp4-source')
    video.poster = getAttr($(e), '', 'data-poster')
    if (video) {
      // 视频格式后缀转换
      // video = video.replace(/webm/, 'mp4')
      gameData.videos.push(video)
    }
  })
  // 图片列表
  gameData.imgs = []
  $('a.highlight_screenshot_link').each((idx, e) => {
    let img = getAttr($(e), '', 'href')
    if (img) {
      img = img.split('url=')[1] || ''
    }
    img && gameData.imgs.push(img.replace(/1920x1080/, '600x338'))
  })

  // 打印解析数据时间
  console.log('parse: ', new Date() - st + 'ms')
  return gameData
}

module.exports = getData
