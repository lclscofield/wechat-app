<template>
  <div class="book-detail" v-if="showPage">
    <div class="detail-header">
      <img :src="detail.imgUrl" class="detail-img">
      <div class="detail-info">
        <div class="detail-book-name">{{ detail.bookName }}</div>
        <div class="detail-text">
          <div>作者:</div>
          <div>{{ detail.author }}</div>
        </div>
        <div class="detail-text">
          <div>最近更新:</div>
          <div>{{ detail.lastUpdate }}</div>
        </div>
        <div class="detail-text">
          <div>最新章节:</div>
          <div class="last-chapter" hover-class="hover-chapter" hover-stay-time="200" @click="toChapter(detail.lastChapter)">{{ detail.lastChapter.chapterTitle }}</div>
        </div>
      </div>
    </div>

    <div class="detail-desc">{{ detail.desc }}</div>

    <div class="detail-btn">
      <div class="add-book" hover-class="hover-btn" hover-stay-time="200">加入书架</div>
      <div class="read-book" hover-class="hover-btn" hover-stay-time="200">开始阅读</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      showPage: false,
      detail: {}
    }
  },
  computed: {
    ...mapState([
      'cacheDetail'
    ])
  },
  async mounted () {
    this.showPage = false
    this.detail = {}
    const { url, title } = this.$root.$mp.query
    console.log(url, title)
    // 修改导航栏 title
    mpvue.setNavigationBarTitle({
      title
    })
    // 从缓存中拿详情
    if (this.cacheDetail[url]) {
      this.detail = this.cacheDetail[url]
      this.showPage = true
      return
    }

    mpvue.showLoading({
      title: '加载中'
    })
    const res = await mpvue.cloud
      .callFunction({
        name: 'getDetail',
        data: { url }
      })
    mpvue.hideLoading()
    this.showPage = true
    console.log(res.result)
    this.detail = res.result
    // 缓存起来
    this.setCacheDetail({
      [url]: JSON.parse(JSON.stringify(this.detail))
    })
  },
  methods: {
    ...mapMutations({
      setCacheDetail: 'SET_CACHE_DETAIL'
    }),
    // 前往文章内容
    toChapter (obj) {
      console.log(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.book-detail {
  height: 100vh;
  font-size: 28rpx;
  position: relative;

  .hover-chapter {
    background: #e9faff !important;
  }
  .hover-btn {
    background: #a5afb1 !important;
  }

  > .detail-header {
    display: flex;
    padding: 20rpx;

    > .detail-img {
      height: 300rpx;
      width: 240rpx;
      border-radius: 8rpx;
    }

    > .detail-info {
      flex: 1;
      padding-left: 20rpx;

      > .detail-book-name {
        font-size: 36rpx;
      }

      > .detail-text {
        line-height: 60rpx;
        display: flex;
        justify-content: space-between;

        > .last-chapter {
          color: #84a0dd;
        }
      }
    }
  }

  > .detail-desc {
    padding-left: 20rpx;
    line-height: 44rpx;
  }

  > .detail-btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;

    > div {
      width: 50%;
      line-height: 120rpx;
      text-align: center;
      color: #ffffff;
    }

    > .add-book {
      background: #84a0dd;
    }

    > .read-book {
      background: #7ea3a3;
    }
  }
}
</style>
