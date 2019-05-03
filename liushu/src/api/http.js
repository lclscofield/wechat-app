import utils from './utils'

export default async function http (obj) {
  return new Promise((resolve, reject) => {
    // 是否显示loading
    if (obj.loading === true) {
      wx.showNavigationBarLoading()
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
    }
    wx.request({
      url: utils.API + obj.url,
      data: obj.data,
      header: {
        'content-type': 'application/json',
        Accept: 'application/json',
        ...obj.header
      },
      method: obj.method || 'GET',

      success (res) {
        if (obj.loading === true) {
          wx.hideLoading()
          wx.hideNavigationBarLoading()
        }

        // 处理返回信息
        handleResult(res)

        resolve(res.data)
      },

      fail (e) {
        if (obj.loading === true) {
          wx.hideLoading()
          wx.hideNavigationBarLoading()
        }
        showToast('请求失败')
        reject(e)
      }
    })
  })
}

// 统一显示toast
function showToast (message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 1000
  })
  setTimeout(() => {
    wx.hideToast()
  }, 3000)
}
/**
 * 处理code信息
 * @param res
 */
function handleResult (res) {
  let code = res.data.code
  switch (code) {
    case 200:
      break

    default:
      let msg = res.data.message ? res.data.message : '请求失败'
      showToast(msg)
  }
}
