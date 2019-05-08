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
          <div>{{ lastUpdate }}</div>
        </div>
        <div class="detail-text">
          <div>最新章节:</div>
          <div class="last-chapter" hover-class="hover-chapter" hover-stay-time="200" @click="toLastChapter()">{{ detail.lastChapter.chapterTitle }}</div>
        </div>
      </div>
    </div>

    <div class="detail-desc">
      <div class="detail-desc-title">简介</div>
      <div class="detail-desc-content">{{ detail.desc }}</div>
    </div>

    <div class="detail-btn" v-if="openId">
      <div class="add-book" hover-class="hover-btn" hover-stay-time="200" @click="bookHandler">{{ isBookrack ? '移出书架': '加入书架' }}</div>
      <div class="read-book" hover-class="hover-btn" hover-stay-time="200" @click="toBooKCtx()">开始阅读</div>
    </div>
    <button v-else class="detail-login" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">登录</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { formatTime } from '../../utils'

export default {
  data () {
    return {
      showPage: false,
      url: '', // 书籍地址
      detail: {}
    }
  },
  computed: {
    ...mapState([
      'openId',
      'userInfo',
      'cacheDetail'
    ]),
    // 最后更新时间
    lastUpdate () {
      return formatTime(new Date(this.detail.lastUpdate))
    },
    // 是否已存在书架中
    isBookrack () {
      if (this.userInfo.openId && this.userInfo.bookrack.some(item => {
        return item.url === this.url
      })) {
        return true
      }
      return false
    }
  },
  async onLoad () {
    this.showPage = false
    this.detail = {}
    const { url, title } = this.$root.$mp.query
    this.url = url
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
    this.detail = res.result
    // 缓存起来
    this.setCacheDetail({
      [url]: JSON.parse(JSON.stringify(this.detail))
    })
  },
  methods: {
    ...mapMutations({
      setCacheDetail: 'SET_CACHE_DETAIL',
      setUserInfo: 'SET_USER_INFO'
    }),
    ...mapActions([
      'login'
    ]),
    // 前往最后一章
    toLastChapter () {
      mpvue.navigateTo({
        url: '../reading/main?url=' + this.url + '&href=' + this.detail.lastChapter.href + '&title=' + this.detail.bookName
      })
    },
    // 授权登录
    onGotUserInfo (e) {
      const detail = e.mp.detail
      if (detail.userInfo) {
        this.login(detail.userInfo)
      }
    },
    // 书架移入移出
    async bookHandler () {
      mpvue.showLoading({
        title: '加载中...',
        mask: true
      })
      const bookDetail = {
        url: this.url,
        bookName: this.detail.bookName,
        imgUrl: this.detail.imgUrl,
        lastChapter: this.detail.lastChapter,
        lastUpdate: this.detail.lastUpdate,
        currentChapter: this.detail.firstChapter
      }
      let bookIdx = 0
      this.userInfo.bookrack.some((item, idx) => {
        if (item.url === this.url) {
          bookIdx = idx
          return true
        }
      })
      const postData = this.isBookrack ? { bookIdx } : { bookDetail }

      const res = await mpvue.cloud
        .callFunction({
          name: 'bookHandler',
          data: {
            isBookrack: this.isBookrack,
            ...postData
          }
        })
      const data = res.result
      const newUserInfo = Object.assign(this.userInfo, data)
      this.setUserInfo(newUserInfo)
      mpvue.hideLoading()
      mpvue.showToast({
        title: this.isBookrack ? '加入成功' : '移出成功'
      })
    },
    // 前往书籍内容
    toBooKCtx () {
      let obj = {}
      // 是否在书架中，是则前往当前阅读章节，否则前往第一章
      if (this.isBookrack) {
        let bookrack = this.userInfo.bookrack
        bookrack.some(item => {
          if (item.url === this.url) {
            obj = item
            return true
          }
        })
      } else {
        obj = {
          url: this.url,
          currentChapter: {
            href: this.detail.firstChapter.href
          },
          bookName: this.detail.bookName
        }
      }
      mpvue.navigateTo({
        url: '../reading/main?url=' + obj.url + '&href=' + obj.currentChapter.href + '&title=' + obj.bookName
      })
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

    > .detail-desc-title {
      font-size: 32rpx;
      line-height: 60rpx;
    }

    > .detail-desc-content {
      line-height: 44rpx;
    }
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

  > .detail-login {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>
