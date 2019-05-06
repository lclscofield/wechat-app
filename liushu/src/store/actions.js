const actions = {
  login ({ commit }, userInfo) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    return mpvue.cloud
      .callFunction({
        name: 'login',
        data: {
          user: userInfo
        }
      })
      .then(res => {
        const result = res.result
        console.log(res)
        commit('SET_OPEN_ID', result.userInfo.openId)
        commit('SET_USER_INFO', result.userInfo)
        wx.hideLoading()
      })
      .catch(err => {
        wx.hideLoading()
        console.error(err)
      })
  }
}

export default actions
