<template>
  <scroll-view class="list" scroll-y="true" @scrolltolower="loadMore" @scroll="onScroll" :scroll-top="scrollTop" lower-threshold="200">
    <!-- loading -->
    <van-loading class="list-loading" type="spinner" color="#1989fa" size="24px" v-if="!currentData.list.length" />

    <!-- game list -->
    <div class="game" v-for="(item, idx) in currentData.list" :key="idx + item.title">
      <!-- left -->
      <div class="game-left">
        <img class="game-img-min" :src="item.imgMin">
        <!-- left-bottom -->
        <div class="game-left-btm">
          <div class="game-released">{{ item.released || '暂未发布' }}</div>
          <img class="game-review" :src="item.reviewImg">
        </div>
      </div>
      <!-- right -->
      <div class="game-right">
        <div class="game-title">{{ item.title }}</div>
        <div class="game-price-wrap">
          <div class="game-price">{{ item.price }}</div>
          <div class="game-strike">{{ item.strike }}</div>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { formatTime } from '../utils/index'

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
    }
  },

  data () {
    return {
      scrollTop: 0,
      currentData: {
        page: 1,
        list: []
      } // 当前数据
    }
  },

  computed: {
    ...mapState([
      'specials',
      'topsellers',
      'popularnew'
    ])
  },

  watch: {
    // 监听 tabActive 获取当前 tab 数据
    tabActive () {
      console.log(this.tabActive, this.tabCb)
      this.currentData = this[[this.tabCb]]
      // 设置滚动条距离
      this.scrollTop = this.currentData.scrollTop
    }
  },

  mounted () {
    console.log(this.tabActive, this.tabCb)
    this.currentData = this[[this.tabCb]]
    this.cloudFn()
  },

  methods: {
    ...mapMutations({
      // setPage: 'SET_PAGE'
    }),
    // 监听滚动事件
    onScroll (e) {
      this.currentData.scrollTop = e.mp.detail.scrollTop
    },
    // 加载更多数据
    loadMore () {
      // 每次都是获取下一页
      this.currentData.page++
      this.cloudFn()
    },
    // 调用云函数获取数据列表
    async cloudFn () {
      const res = await wx.cloud.callFunction({
        name: 'gameList',
        data: {
          page: this.currentData.page,
          cb: this.tabCb
        }
      })
      // 转换时间格式
      res.result.forEach(item => {
        // 存在发布时间时才转换格式
        if (item.released) {
          item.released = formatTime(new Date(item.released), false, '-')
        }
      })
      // 数据添加到当前数据列表尾部
      this.currentData.list = this.currentData.list.concat(res.result)
      console.log(this.currentData)
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  height: 100%;
  position: relative;

  .list-loading {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
  }

  .game {
    padding: 20rpx;
    margin: 10rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    color: #1b3b51;
    border-radius: 4rpx;
    box-shadow: 0 0 6rpx 2rpx #b4c7d3;

    > .game-left {
      padding-right: 20rpx;

      > .game-img-min {
        width: 240rpx;
        height: 90rpx;
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
  }
}
</style>
