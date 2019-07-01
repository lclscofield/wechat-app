<template>
  <scroll-view class="game-detail">
  </scroll-view>
</template>

<script>
export default {
  data () {
    return {
      url: '',
      title: '',
      res: ''
    }
  },

  async onLoad () {
    const { url, title } = this.$root.$mp.query
    this.url = decodeURIComponent(url)
    this.title = title
    console.log(this.url)
    // 设置导航栏 title
    wx.setNavigationBarTitle({
      title
    })
    // 获取数据
    await this.getData(this.url)
  },

  methods: {
    // 获取数据
    async getData (url) {
      // 优先读取缓存
      await this.getCache(url)
    },
    // 读取缓存
    async getCache (url) {
      // 同步读取缓存
      let cache = wx.getStorageSync(url)
      if (cache) {
        console.log('cache: ', cache)
      } else {
        await this.getDetailData(url)
      }
    },
    // 发送请求获取详情数据
    async getDetailData (url) {
      console.log('cloud: ', url)
      const res = await wx.cloud.callFunction({
        name: 'gameDetail',
        data: {
          url
        }
      })
      this.res = res.result
      console.log(this.res)
    }
  }
}
</script>

<style lang="scss" scoped>
.game-detail {
  height: 100vh;
  font-size: 28rpx;
}
</style>
