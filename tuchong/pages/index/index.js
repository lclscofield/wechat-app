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
      console.log(this.data.feedList)
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
      console.log(this.data.feedList)
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
      console.log(this.data.feedList)
    })
  },
  loadImg(e) {
    const idx = e.target.dataset.index
    const hidden = `feedList[${idx}].hidden`
    this.setData({
      [hidden]: false
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
              if (item.images[0]) {
                item.imgUrl = `https://photo.tuchong.com/${item.images[0].user_id}/f/${item.images[0].img_id}.jpg`
                item.hidden = true
              }
            })
            resolve(res.data)
          }
        }
      })
    })
  }
})
