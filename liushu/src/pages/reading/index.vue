<template>
  <div class="reading">
    <div class="chapter-title">{{ chapter.title }}</div>
    <rich-text class="chapter-body" :nodes="chapter.ctx"></rich-text>
    <div class="chapter-ctrl" v-if="chapter.href">
      <div class="next chapter-ctrl-item" @click="toChapter('next')" hover-class="hover-btn" hover-stay-time="200">下一章</div>
      <div class="prev chapter-ctrl-item" @click="toChapter('prev')" hover-class="hover-btn" hover-stay-time="200">上一章</div>
      <div class="chapter-catalog chapter-ctrl-item" hover-class="hover-btn" hover-stay-time="200">目录</div>
    </div>
    <!-- setting -->
    <div class="setting"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      url: '', // 目录地址
      currentHref: '', // 当前章节 href
      chapter: {}
    }
  },
  computed: {
    ...mapState([
      'openId',
      'userInfo'
    ])
  },
  /*
    url: 书籍地址
    href: 当前章节地址
    title: 书籍名称
  */
  async onLoad () {
    this.chapter = {}
    const { url, href, title } = this.$root.$mp.query

    mpvue.setNavigationBarTitle({
      title
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f3f3e5'
    })

    this.url = url
    this.currentHref = href
    await this.getData(href, url)
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO'
    }),
    async getData (href, url) {
      // 同步读取数据
      let cache = mpvue.getStorageSync(href)
      if (cache) {
        // 缓存存在
        this.chapter = cache
      } else {
        // 缓存不存在，请求数据
        mpvue.showLoading({
          title: '加载中',
          mask: true
        })
        let res = await mpvue.cloud
          .callFunction({
            name: 'getChapter',
            data: { href, url }
          })
        this.chapter = res.result
        console.log(this.chapter)
        mpvue.hideLoading()

        // 异步缓存数据
        mpvue.setStorage({
          key: href,
          data: this.chapter
        })
      }
      // 章节 url
      this.chapter.href = href
      this.currentHref = href
      // 目录 url
      this.chapter.catalog = url
      // 更新书架信息
      this.upDateBookrack()
      // 更新数据库书架信息，异步更新不影响加载
      this.upDateBookrackDatabase()
    },
    // 上一章或下一章
    async toChapter (str) {
      let href = this.chapter[str]
      if (!href) {
        mpvue.showToast({
          title: `暂无${str === 'next' ? '下' : '上'}一章~`,
          icon: 'none'
        })
      } else {
        await this.getData(href, this.url)
        mpvue.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
    },
    // 更新书架信息
    upDateBookrack () {
      let bookrack = this.userInfo.bookrack
      const isBookrack = bookrack.some(item => {
        if (item.url === this.url) {
          item.currentChapter.chapterTitle = this.chapter.title
          item.currentChapter.href = this.currentHref
          return true
        }
      })
      // 在书架中则更新书架
      isBookrack && this.setUserInfo(this.userInfo)
    },
    // 更新数据库书架信息
    async upDateBookrackDatabase () {
      mpvue.cloud
        .callFunction({
          name: 'updateBookrack',
          data: {
            url: this.url,
            href: this.currentHref,
            title: this.chapter.title
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.reading {
  font-size: 28rpx;
  min-height: 100vh;
  background-color: #f3f3e5;
  padding: 0 20rpx;

  .hover-btn {
    background: #a5afb1 !important;
  }

  > .chapter-title {
    font-size: 40rpx;
    text-align: center;
    padding: 20rpx 0;
    font-weight: 500;
  }

  > .chapter-body {
    font-size: 36rpx;
    line-height: 1.5;
    color: #3b4747;
  }

  > .chapter-ctrl {
    padding: 40rpx 0;
    margin: 0 40rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    > .chapter-ctrl-item {
      color: #93b1b1;
      font-size: 36rpx;
      line-height: 80rpx;
      border: 2rpx solid #93b1b1;
      border-radius: 80rpx;
      text-align: center;
    }

    > .next {
      width: 100%;
      margin-bottom: 20rpx;
    }

    > .prev {
      width: 45%;
    }

    > .chapter-catalog {
      width: 45%;
    }
  }
}
</style>
