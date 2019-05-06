import * as types from './mutation-types'
const matations = {
  /**
   * state:当前状态树
   * v: 提交matations时传的参数
   */
  [types.SET_OPEN_ID] (state, v) {
    state.openId = v
  },
  [types.SET_USER_INFO] (state, v) {
    Object.assign(state.userInfo, v)
  },
  [types.SET_CACHE_DETAIL] (state, v) {
    Object.assign(state.cacheDetail, v)
  }
}

export default matations
