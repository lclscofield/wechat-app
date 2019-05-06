import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  openId: 'hash',
  userInfo: {}, // 用户信息
  cacheDetail: {} // 书籍详情缓存
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
