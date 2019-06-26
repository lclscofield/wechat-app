<template>
  <div id="home">
    <van-search :value="searchVal" placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" show-action="true" />

    <van-tabs animated color="#1b3b51" :active="tabActive" @change="onTabChange">
      <van-tab :title="item.title" v-for="(item, idx) in tabs" :key="idx + item.title">
      </van-tab>
    </van-tabs>

    <div class="list-wrap">
      <contnet-list :tabActive="tabActive" :tabCb="tabs[tabActive].cb" :searchVal="searchVal"></contnet-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContnetList from '../../components/List.vue'

export default {
  data () {
    return {
      searchVal: '', // 搜索值
      tabActive: 0, // 当前标签页
      tabs: [{
        title: '实时优惠',
        cb: 'specials'
      }, {
        title: '最热游戏',
        cb: 'topsellers'
      }, {
        title: '热门新品',
        cb: 'popularnew'
      }, {
        title: '即将推出',
        cb: 'comingsoon'
      }]
    }
  },

  components: {
    ContnetList
  },

  computed: {
    ...mapState([
      'search'
    ])
  },

  // 监听下拉事件, 暂时没有逻辑
  onPullDownRefresh () {
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 100)
  },

  methods: {
    // 切换 tab
    onTabChange (event) {
      let { index, title } = event.mp.detail
      this.tabActive = index
      console.log(index, title, this.tabActive)
    },
    // 搜索
    onSearch () {
      this.tabActive = -1
    },
    // 取消搜索
    onCancel () {
      this.tabActive = 0
      this.search.page = 1
      this.search.scrollTop = 0
      this.search.list = []
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  height: 100vh;
  font-size: 28rpx;

  .list-wrap {
    height: calc(100vh - 98px);
  }
}
</style>
