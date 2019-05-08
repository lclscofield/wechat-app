<template>
  <div class="bookrack" v-if="openId !== 'hash'">
    <div class="bookrack-title">共 {{ bookrack.length }} 本</div>
    <div class="bookrack-list" v-if="bookrack.length">
      <div class="bookrack-item" v-for="(item, idx) in bookrack" :key="idx + item.url" @click="toBooKCtx(item)">
        <img :src="item.imgUrl" class="book-img">
        <div class="book-content">
          <div class="book-name">{{ item.bookName }}</div>
          <div class="last-chapter">{{ lastUpdate[idx] }}: {{ item.lastChapter.chapterTitle }}</div>
          <div class="current-chapter">阅读到: {{ item.currentChapter.chapterTitle }}</div>
        </div>
        <div class="to-book-detail" hover-class="hover-detail" hover-stay-time="50" @click.stop="bookSet(item, idx)">...</div>
      </div>
    </div>

    <button v-if="!openId" class="bookrack-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">登录</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      bookrack: []
    }
  },
  watch: {
    userInfo () {
      this.bookrack = this.userInfo.bookrack
    }
  },
  computed: {
    ...mapState([
      'openId',
      'userInfo'
    ]),
    lastUpdate () {
      if (this.userInfo && this.userInfo.bookrack) {
        return this.userInfo.bookrack.map(item => {
          const time = new Date() - new Date(item.lastUpdate)
          if (time <= 60 * 1000) {
            return '刚刚'
          } else if (time <= 60 * 60 * 1000) {
            return `${Math.floor(time / (60 * 1000))}分钟前`
          } else if (time <= 24 * 60 * 60 * 1000) {
            return `${Math.floor(time / (60 * 60 * 1000))}小时前`
          } else {
            return `${Math.floor(time / (24 * 60 * 60 * 1000))}天前`
          }
        })
      }
    }
  },
  mounted () {
    console.log(this.bookrack)
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO'
    }),
    ...mapActions([
      'login'
    ]),
    // 授权登录
    onGotUserInfo (e) {
      const detail = e.mp.detail
      console.log(detail)
      if (detail.userInfo) {
        this.login(detail.userInfo)
      }
    },
    // 设置书籍
    bookSet (obj, idx) {
      const that = this
      mpvue.showActionSheet({
        itemList: ['简介', '移出书架'],
        success (res) {
          const tapIndex = res.tapIndex
          if (tapIndex === 0) {
            that.toBookDetail(obj.url, obj.bookName)
          } else if (tapIndex === 1) {
            that.removeBook(idx)
          }
        }
      })
    },
    // 前往书籍详情
    toBookDetail (url, title) {
      mpvue.navigateTo({
        url: '../bookDetail/main?url=' + url + '&title=' + title
      })
    },
    // 移出书架
    async removeBook (idx) {
      mpvue.showLoading({
        title: '加载中...',
        mask: true
      })
      const res = await mpvue.cloud
        .callFunction({
          name: 'bookHandler',
          data: {
            isBookrack: true,
            bookIdx: idx
          }
        })
      const data = res.result
      const newUserInfo = Object.assign(this.userInfo, data)
      this.setUserInfo(newUserInfo)
      mpvue.hideLoading()
      mpvue.showToast({
        title: '移出成功'
      })
    },
    // 前往书籍内容
    toBooKCtx (obj) {
      mpvue.navigateTo({
        url: '../reading/main?url=' + obj.url + '&href=' + obj.currentChapter.href + '&title=' + obj.bookName
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bookrack {
  font-size: 28rpx;

  > .bookrack-title {
    font-size: 36rpx;
    border-bottom: 2rpx solid #c2f0e8;
    padding-left: 20rpx;
    line-height: 80rpx;
  }

  > .bookrack-list {
    padding: 20rpx 0 0 20rpx;

    > .bookrack-item {
      display: flex;
      justify-content: space-between;
      height: 180rpx;
      border-bottom: 2rpx solid #e7f5f5;

      &:last-child {
        border-bottom: none;
      }

      > .book-img {
        align-self: center;
        width: 120rpx;
        height: 150rpx;
        border-radius: 8rpx;
      }

      > .book-content {
        flex: 1;
        padding: 20rpx 0 0 20rpx;

        > .book-name {
          font-size: 32rpx;
        }

        > .last-chapter {
          font-size: 28rpx;
          color: #888d8d;
          line-height: 1.5;
        }

        > .current-chapter {
          font-size: 24rpx;
          color: #b1b9b9;
          line-height: 1.5;
        }
      }

      > .to-book-detail {
        padding: 0 40rpx;
        line-height: 180rpx;
      }
      .hover-detail {
        background: #d7e0e0;
      }
    }
  }

  > .bookrack-btn {
    line-height: 60rpx;
    margin-top: 200rpx;
    padding: 0;
    font-size: 32rpx;
    width: 30%;
  }
}
</style>