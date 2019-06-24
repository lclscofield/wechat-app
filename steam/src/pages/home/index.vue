<template>
  <div id="home">
    <van-search :value="searchVal" placeholder="请输入搜索关键词" />

    <van-tabs animated swipeable color="#1b3b51" :active="tabActive" @change="onTabChange">
      <van-tab :title="item.title" v-for="(item, idx) in tabs" :key="idx + item.title">
        <div class="list-wrap">
          <contnet-list :tabActive="tabActive" :tabCurrent="idx" :tabCb="item.cb"></contnet-list>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
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
        title: '热门游戏',
        cb: 'specials'
      }, {
        title: '最新游戏',
        cb: 'specials'
      }, {
        title: '热门即将推出',
        cb: 'specials'
      }]
    }
  },

  components: {
    ContnetList
  },

  mounted () {
  },

  methods: {
    // 切换 tab
    onTabChange (event) {
      let { index, title } = event.mp.detail
      this.tabActive = index
      console.log(index, title, this.tabActive)
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
