<template>
  <div class="game-detail-wrap">
    <!-- loading -->
    <div class="loading-wrap" v-if="loading">
      <div>
        <van-loading class="loading" type="spinner" color="#1989fa" size="24px" />
      </div>
      <div class="loading-wrap-hint" v-if="!hasCache">数据获取并缓存中...</div>
    </div>
    <!-- scroll -->
    <scroll-view class="game-detail" scroll-y="true" v-else>
      <!-- header -->
      <div class="detail-header">
        <div class="detail-title">{{ gameData.appName }}</div>
        <image :src="gameData.imgMax" class="detail-img-max" :style="'height:' + imgMaxHeight + 'px;'"></image>
        <div class="detail-desc">{{ gameData.desc }}</div>
      </div>
      <!-- info -->
      <div class="detail-info">
        <div class="detail-lately-review">{{ gameData.summaryReview.lately }}</div>
        <div class="detail-all-review">{{ gameData.summaryReview.all }}</div>
        <div class="detail-release-date">{{ gameData.releaseDate }}</div>
        <div class="detail-dev-person">{{ gameData.personData.devPerson }}</div>
        <div class="detail-pub-person">{{ gameData.personData.pubPerson }}</div>
        <div class="detail-tags-wrap">
          <div class="detail-tags-title">热门用户自定义标签:</div>
          <div class="detail-tags">
            <span class="detail-tag" v-for="(item, idx) in gameData.tags" :key="idx + item">{{ item }}</span>
          </div>
        </div>
      </div>
      <!-- video, img -->
      <swiper class="media" :style="'height:' + imgHeight + 'px;'">
        <!-- video -->
        <swiper-item v-for="(video, idx) in gameData.videos" :key="idx + video">
          <video :src="video.src" class="swiper-item" :poster="video.poster" muted="true" show-mute-btn="true"></video>
        </swiper-item>
        <!-- img -->
        <swiper-item v-for="(img, idx) in gameData.imgs" :key="idx + img">
          <image :src="img" class="swiper-item" mode="widthFix"></image>
        </swiper-item>
      </swiper>
      <!-- banner 广告 -->
      <div class="adContainer">
        <ad unit-id="adunit-92d7aa9b5209ad81"></ad>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: '',
      title: '',
      gameData: {},
      loading: false, // 页面加载
      hasCache: false, // 是否有缓存
      imgHeight: 0 // 图片高度
    }
  },

  // 转发
  onShareAppMessage (res) {
    return {
      title: this.title,
      path: '/pages/detail/main?url=' + encodeURIComponent(this.url) + '&title=' + this.title
    }
  },

  // 加载数据
  async onLoad () {
    // 设置图片高度
    this.setImgHeight()

    // 加载
    this.loading = true
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
    this.loading = false
  },

  // 重置数据
  onUnload () {
    this.loading = false
    this.hasCache = false
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
      if (cache && cache.date === new Date().toLocaleDateString()) {
        this.hasCache = true
        console.log('cache: ', cache)
        this.gameData = cache.gameData
      } else {
        await this.getDetailData(url)
        // 异步存入缓存, 缓存期为当天
        wx.setStorage({
          key: url,
          data: {
            date: new Date().toLocaleDateString(),
            gameData: this.gameData
          }
        })
      }
    },
    // 发送请求获取详情数据
    async getDetailData (url) {
      console.log('cloud: ', url)
      const res = await wx.cloud.callFunction({
        name: 'gameDetail',
        data: { url }
      })
      this.gameData = res.result
      console.log(this.gameData)
    },
    // 设置图片宽度
    setImgHeight () {
      const res = wx.getSystemInfoSync()
      // 设备宽度
      const windowWidth = res.windowWidth
      // 计算图片高度
      this.imgHeight = parseInt(windowWidth * (337 / 600))
      this.imgMaxHeight = parseInt(windowWidth * (215 / 460))
    }
  }
}
</script>

<style lang="scss" scoped>
.game-detail-wrap {
  height: 100vh;
  font-size: 28rpx;
  background: #1a2838;
  position: relative;

  // loading
  .loading-wrap {
    width: 100%;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    > .loading-wrap-hint {
      margin-top: 10rpx;
      color: #aab0b8;
    }
  }

  .adContainer {
    margin: 40rpx 10rpx 0;
    border-radius: 4rpx;
    box-shadow: 0 0 6rpx 2rpx #b4c7d3;
  }

  // 动画
  // 透明显示
  @keyframes opacity {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  // detail
  .game-detail {
    height: 100%;
    padding: 10rpx 0 40rpx;
    box-sizing: border-box;
    animation: opacity 0.3s linear;

    .detail-header {
      color: #c6d4df;
      padding: 0 10rpx;

      > .detail-title {
        line-height: 44rpx;
        padding: 20rpx 0;
        font-size: 36rpx;
      }

      > .detail-img-max {
        width: 100%;
      }
    }

    .detail-info {
      margin-top: 40rpx;
      padding: 0 10rpx;
      font-size: 24rpx;
      color: #556772;

      & > div {
        margin-top: 10rpx;
      }

      > .detail-tags-wrap {
        > .detail-tags {
          margin-top: 6rpx;

          .detail-tag {
            display: inline-block;
            padding: 0 14rpx;
            color: #67c1f5;
            background-color: rgba(103, 193, 245, 0.2);
            margin-right: 4rpx;
            border-radius: 4rpx;
            margin-bottom: 6rpx;
          }
        }
      }
    }

    .media {
      margin-top: 40rpx;
      width: 100%;

      .swiper-item {
        width: 100%;
      }
    }
  }

  // 隐藏滚动条
  ::-webkit-scrollbar {
    width: 0;
  }
}
</style>
