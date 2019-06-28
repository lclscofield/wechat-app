import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  specials: { // 折扣
    page: 1,
    scrollTop: 0,
    loading: false, // 加载中
    list: []
  },
  topsellers: { // 最热
    page: 1,
    scrollTop: 0,
    loading: false,
    list: []
  },
  popularnew: { // 新品
    page: 1,
    scrollTop: 0,
    loading: false,
    list: []
  },
  comingsoon: { // 即将推出
    page: 1,
    scrollTop: 0,
    loading: false,
    list: []
  },
  search: { // 搜索数据
    page: 1,
    scrollTop: 0,
    loading: false,
    list: []
  }
}

export default new Vuex.Store({
  state,
  mutations
})
