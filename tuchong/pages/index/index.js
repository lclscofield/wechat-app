//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    feedList: [],
    page: 1,
    post_id: '',
    type: 'refresh'
  },
  // 页面加载
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getFeed().then(res => {
      this.setData({
        feedList: res.feedList
      })
      wx.hideLoading()
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      post_id: '',
      type: 'refresh'
    })
    this.getFeed().then(res => {
      this.setData({
        feedList: res.feedList
      })
      wx.stopPullDownRefresh()
    })
  },
  // 上拉触底
  onReachBottom() {
    const len = this.data.feedList.length
    const post_id = this.data.feedList[len - 1].post_id || ''
    this.setData({
      page: this.data.page + 1,
      post_id,
      type: 'loadmore'
    })
    this.getFeed().then(res => {
      this.setData({
        feedList: this.data.feedList.concat(res.feedList)
      })
    })
  },
  // 加载图片完成
  loadImg(e) {
    const idx = e.currentTarget.dataset.index
    const hidden = `feedList[${idx}].hidden`
    this.setData({
      [hidden]: false
    })
  },
  // 进入图片集
  toImgs(e) {
    const currentFeed = e.currentTarget.dataset.item
    app.globalData.currentFeed = currentFeed
    wx.navigateTo({
      url: '../atlas/atlas'
    })
  },
  // 获取图片数据
  getFeed() {
    return new Promise((resolve, reject) => {
      const { page, post_id, type } = this.data
      let data = {
        page,
        type
      }
      if (post_id) {
        data.post_id = post_id
      }
      wx.request({
        url: 'https://api.tuchong.com/feed-app',
        data,
        success: res => {
          let data = res.data
          if (data.result === 'SUCCESS') {
            res.data.feedList.forEach(item => {
              item.imgUrls = []
              if (item.images && item.images.length > 0) {
                item.images.forEach(itemImg => {
                  item.imgUrls.push({
                    url: `https://photo.tuchong.com/${itemImg.user_id}/f/${itemImg.img_id}.jpg`,
                    hidden: true
                  })
                })
              }
              item.hidden = true
            })
            resolve(res.data)
          }
        }
      })
    })
  }
})
