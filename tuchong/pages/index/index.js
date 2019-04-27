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
  onLoad: function() {
    this.getFeed().then(res => {
      this.setData({
        feedList: res.feedList
      })
      console.log(this.data.feedList)
    })
  },
  getFeed: function() {
    return new Promise((resolve, reject) => {
      const { page, post_id, type } = this.data
      wx.request({
        url: 'https://api.tuchong.com/feed-app',
        data: {
          page,
          post_id,
          type
        },
        success: res => {
          let data = res.data
          if (data.result === 'SUCCESS') {
            res.data.feedList.forEach(item => {
              if (item.images[0]) {
                item.imgUrl = `https://photo.tuchong.com/${item.images[0].user_id}/f/${item.images[0].img_id}.jpg`
              }
            })
            resolve(res.data)
          }
        }
      })
    })
  }
})
