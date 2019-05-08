<template>
  <div class="catalog">
    <div class="catalog-header">
      <div class="catalog-title">{{ catalogCount }}</div>
      <div class="catalog-reverse" @click="reverse">倒序</div>
    </div>
    <scroll-view class="catalog-list" scroll-y="true" :scroll-into-view="currentNum" enable-back-to-top="true">
      <div class="catalog-item" @click="toBooKCtx(item)" :id="'id' + idx" :class="{ active: currentHref === item.href }" v-for="(item, idx) in catalog" :key="idx + item.href">
        <div class="catalog-num">{{ idx + 1 }}</div>
        <div class="catalog-item-title">{{ item.chapterTitle }}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: '', // 书籍 url
      title: '', // 书籍名
      currentHref: '', // 当前章节 url
      catalog: [],
      showPage: false
    }
  },
  computed: {
    catalogCount () {
      return `目录(共${this.catalog.length}章)`
    },
    currentNum () {
      let num = 0
      this.catalog.some((item, idx) => {
        if (item.href === this.currentHref) {
          num = idx
          return true
        }
      })
      return 'id' + num
    }
  },
  async onLoad () {
    const { url, title, currentHref } = this.$root.$mp.query
    this.url = url
    this.title = title
    this.currentHref = currentHref

    // 换导航栏颜色标题
    mpvue.setNavigationBarTitle({
      title
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f3f3e5'
    })

    // 同步读取数据
    let cache = mpvue.getStorageSync(url)
    if (cache) {
      // 缓存存在
      this.catalog = cache
      this.showPage = true
    } else {
      // 缓存不存在，请求数据
      mpvue.showLoading({
        title: '加载中',
        mask: true
      })
      // 获取目录
      let res = await mpvue.cloud
        .callFunction({
          name: 'getCatalog',
          data: { url }
        })
      this.catalog = res.result
      mpvue.hideLoading()
      // 异步缓存数据
      mpvue.setStorage({
        key: url,
        data: this.catalog
      })
    }
    this.showPage = true
  },
  methods: {
    // 倒序
    reverse () {
      this.catalog.reverse()
    },
    // 前往书籍内容
    toBooKCtx (obj) {
      this.currentHref = obj.href
      mpvue.navigateTo({
        url: '../reading/main?url=' + this.url + '&href=' + obj.href + '&title=' + this.title
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.catalog {
  font-size: 28rpx;
  height: 100vh;
  background-color: #f3f3e5;
  padding: 0 20rpx;

  > .catalog-header {
    line-height: 80rpx;
    padding: 20rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .catalog-title {
      font-size: 40rpx;
      font-weight: 500;
    }

    > .catalog-reverse {
      font-size: 32rpx;
      color: #a5e8eb;
    }
  }

  > .catalog-list {
    height: calc(100% - 120rpx);

    .catalog-item {
      display: flex;
      align-items: center;
      line-height: 120rpx;
      border-bottom: 2rpx solid #f0f0c8;

      &:last-child {
        border: none;
      }

      &.active {
        > .catalog-num {
          color: #c24e4e;
        }
        > .catalog-item-title {
          color: #e91e1e;
        }
      }

      > .catalog-num {
        font-size: 24rpx;
        padding: 0 20rpx;
        color: #939292;
      }

      > .catalog-item-title {
        font-size: 32rpx;
        padding-left: 20rpx;
        color: #686868;
      }
    }
  }
}
</style>
