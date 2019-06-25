import * as types from './mutation-types'
const matations = {
  /**
   * state:当前状态树
   * v: 提交matations时传的参数
   */
  [types.SET_PAGE] (state, v) {
    state[[v]].page++
  }
}

export default matations
