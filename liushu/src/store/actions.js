const actions = {
  login ({ commit }, userInfo) {
    mpvue.showLoading({
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
        commit('SET_OPEN_ID', result.userInfo.openId)
        commit('SET_USER_INFO', result.userInfo)
        mpvue.hideLoading()
      })
      .catch(err => {
        mpvue.hideLoading()
        console.error(err)
      })
  }
}

export default actions
