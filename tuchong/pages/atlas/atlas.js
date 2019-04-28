const app = getApp()

Page({
  data: {
    atlas: []
  },
  onLoad() {
    this.setData({
      atlas: app.globalData.currentFeed
    })
  },
  // 加载图片完成
  loadImg(e) {
    const idx = e.currentTarget.dataset.index
    const hidden = `atlas.imgUrls[${idx}].hidden`
    this.setData({
      [hidden]: false
    })
  },
  // 预览大图
  bigImg(e) {
    const url = e.currentTarget.dataset.url
    const imgUrls = this.data.atlas.imgUrls
    const urls = imgUrls.map(item => {
      return item.url
    })
    wx.previewImage({
      urls,
      current: url
    })
  }
})
