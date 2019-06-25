import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  specials: { // 折扣
    page: 1,
    scrollTop: 0,
    list: []
  },
  topsellers: { // 最热
    page: 1,
    scrollTop: 0,
    list: []
  },
  popularnew: { // 新品
    page: 1,
    scrollTop: 0,
    list: []
  }
}

export default new Vuex.Store({
  state,
  mutations
})
