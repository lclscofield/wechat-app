<template>
  <div class="list-wrap">
    <!-- loading -->
    <van-loading class="tab-loading" type="spinner" color="#1989fa" size="24px" v-if="tabLoading" />

    <scroll-view class="list" v-else scroll-y="true" @scrolltolower="loadMore" @scroll="onScroll" :scroll-top="scrollTop" lower-threshold="300">
      <!-- banner 广告 -->
      <div class="adContainer">
        <ad unit-id="adunit-a19f795a8a0b1a48"></ad>
      </div>
      <!-- game list -->
      <view class="game" hover-class="hover-class" v-for="(item, idx) in currentData.list" :key="idx + item.title" @click="toGameDetail(item.url, item.title)">
        <!-- left -->
        <div class="game-left">
          <image class="game-img-min" lazy-load="true" :src="item.imgMin"></image>
          <!-- left-bottom -->
          <div class="game-left-btm">
            <div class="game-released">{{ item.released }}</div>
            <img class="game-review" :src="item.reviewImg">
          </div>
        </div>
        <!-- right -->
        <div class="game-right">
          <div class="game-title">{{ item.title }}</div>
          <div class="game-right-btm">
            <div class="game-discount" v-if="item.discount">{{ item.discount }}</div>

            <div class="game-price-wrap">
              <div class="game-price">{{ item.price }}</div>
              <div class="game-strike">{{ item.strike }}</div>
            </div>
          </div>
        </div>
      </view>

      <!-- moreLoading -->
      <div class="more-loading-wrap" v-if="moreLoading">
        <van-loading class="more-loading" type="spinner" color="#1989fa" size="24px" />
      </div>

      <!-- empty -->
      <div class="empty" v-if="showEmpty">
        =_= 没有更多啦~
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import { formatTime } from '../utils/index'

export default {
  name: 'List',

  props: {
    tabActive: {
      default: 0,
      type: Number
    },
    tabCb: {
      default: '',
      type: String
    },
    searchVal: {
      default: '',
      type: String
    }
  },

  data () {
    return {
      scrollTop: 0, // 滚动条高度
      tabLoading: false, // 切换 tab 后是否渲染完成
      moreLoading: false, // 是否在加载更多
      currentData: {
        page: 1,
        scrollTop: 0,
        loading: false,
        list: []
      }, // 当前数据
      prevCb: '', // search 之前的 cb
      showEmpty: false // 显示没有更多了
    }
  },

  computed: {
    ...mapState([
      'specials',
      'topsellers',
      'popularnew',
      'comingsoon',
      'search'
    ])
  },

  watch: {
    // 监听 tabActive 切换 search tabCb
    // tabActive () {
    //   // search
    //   if (this.tabActive === -1) {
    //     this.tabCb = 'search'
    //   }
    // },
    // 监听 tabCb 获取当前 tab 数据
    async tabCb (newCb, oldCb) {
      // search 不走这个逻辑
      if (newCb === 'search') return
      this.tabLoading = true
      // 防止获取其他页的数据
      // if (this[[this.tabCb]].list.length) return

      this.currentData = this[[newCb]]
      // 设置滚动条距离
      this.scrollTop = this.currentData.scrollTop
      // 重置 empty
      this.showEmpty = false
      // 获取数据
      if (!this.currentData.list.length && newCb !== 'search') {
        await this.cloudFn()
      }

      this.$nextTick(() => {
        this.tabLoading = false
      })
    }
  },

  onShow () {
    // 设置滚动条距离
    this.scrollTop = this.currentData.scrollTop
  },

  async mounted () {
    this.tabLoading = true
    console.log(this.tabActive, this.tabCb)
    this.currentData = this[[this.tabCb]]
    await this.cloudFn()
    this.$nextTick(() => {
      this.tabLoading = false
    })
  },

  methods: {
    ...mapMutations({
      // setPage: 'SET_PAGE'
    }),
    // search
    async onSearch (searchVal) {
      // 保存上一个 tabCb
      if (this.prevCb === '') {
        this.prevCb = this.tabCb
      }
      // 传递 searchVal
      this.searchVal = searchVal
      // 改变 cb 调整请求变量
      await this.$emit('changeCb', 'search')
      this.tabLoading = true
      this.search.page = 1
      this.search.scrollTop = 0
      this.search.list = []
      this.currentData = this.search
      // 设置滚动条距离
      this.scrollTop = this.currentData.scrollTop
      await this.cloudFn()
      this.tabLoading = false
    },
    // 取消搜索
    onCancel () {
      // 重置 empty
      this.showEmpty = false
      // 重置 tabCb
      this.$emit('changeCb', this.prevCb)
      this.prevCb = ''
      this.search.page = 1
      this.search.scrollTop = 0
      this.search.list = []
    },
    // 监听滚动事件
    onScroll (e) {
      this.currentData.scrollTop = e.mp.detail.scrollTop
    },
    // 加载更多数据
    async loadMore () {
      // 判断是否在加载中
      if (this.showEmpty || this.moreLoading) return
      this.moreLoading = true
      // 每次都是获取下一页
      this.currentData.page++
      await this.cloudFn()
      this.$nextTick(() => {
        this.moreLoading = false
      })
    },
    // 调用云函数获取数据列表
    async cloudFn () {
      // 数据注入
      let typeData = this.currentData
      // 防止多次获取数据
      if (typeData.loading) return
      typeData.loading = true
      const res = await wx.cloud.callFunction({
        name: 'gameList',
        data: {
          page: typeData.page,
          cb: this.tabCb,
          search: this.searchVal
        }
      })
      // 转换时间格式
      // res.result.forEach(item => {
      //   // 存在发布时间时才转换格式
      //   if (item.released) {
      //     item.released = formatTime(new Date(item.released), false, '-')
      //   }
      // })
      // 数据添加到当前数据列表尾部
      if (res.result && res.result.length) {
        this.showEmpty = false
        typeData.list = typeData.list.concat(res.result)
      } else {
        this.showEmpty = true
      }
      typeData.loading = false
      console.log(typeData)
    },
    // 前往详情
    toGameDetail (url, title) {
      console.log(url, title)
      wx.navigateTo({
        url: '../detail/main?url=' + encodeURIComponent(url) + '&title=' + title
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrap {
  height: 100%;
  position: relative;

  .tab-loading {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
  }

  // 动画
  // list 高度过渡
  @keyframes list {
    from {
      height: 0;
    }
    to {
      height: 100%;
    }
  }
  // game 透明显示
  @keyframes game {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .list {
    height: 100%;
    animation: list 0.5s linear;

    .adContainer {
      margin: 0rpx 20rpx 20rpx;
      border-radius: 4rpx;
      box-shadow: 0 0 6rpx 2rpx #b4c7d3;
    }

    .game {
      padding: 10rpx 20rpx;
      margin: 0rpx 20rpx 20rpx;
      display: flex;
      color: #1b3b51;
      border-radius: 4rpx;
      box-shadow: 0 0 6rpx 2rpx #b4c7d3;
      animation: game 0.3s linear;

      // 点击态
      &.hover-class {
        background: #d3d5d7;
      }

      > .game-left {
        padding-right: 20rpx;

        > .game-img-min {
          width: 300rpx;
          height: 120rpx;
          border-radius: 4rpx;
        }

        > .game-left-btm {
          display: flex;
          justify-content: space-between;
          align-items: center;

          > .game-released {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          > .game-review {
            width: 32rpx;
            height: 32rpx;
          }
        }
      }

      > .game-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        > .game-title {
          line-height: 34rpx;
        }

        > .game-right-btm {
          display: flex;
          justify-content: space-between;

          > .game-discount {
            display: inline-block;
            color: #8bc53f;
            background: #4c6b22;
            padding: 0 10rpx;
          }

          > .game-price-wrap {
            flex: 1;
            text-align: right;

            > .game-price {
              display: inline-block;
              color: #888888;
              text-decoration: line-through;
            }

            > .game-strike {
              display: inline-block;
              margin-left: 20rpx;
            }
          }
        }
      }
    }

    .more-loading-wrap {
      width: 100%;
      padding: 30rpx 0;
      text-align: center;
    }

    .empty {
      line-height: 80rpx;
      text-align: center;
      color: #1b3b51;
    }
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 12rpx;
    // height: 12rpx;
    background-color: #ffffff;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
    background-color: #1b3b51;
  }
}
</style>
