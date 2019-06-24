<template>
  <scroll-view class="list">
    <!-- loading -->
    <van-loading class="list-loading" type="spinner" color="#1989fa" size="24px" v-if="!gameList.length" />

    <!-- list -->
    <div class="game" v-for="(item, idx) in gameList" :key="idx + item.title">
      <img :src="item.img">
      <div class="game-title">{{ item.title }}</div>
      <div class="game-released">{{ item.released }}</div>
      <img :src="item.reviewImg">
    </div>
  </scroll-view>
</template>

<script>
export default {
  name: 'List',

  props: {
    tabActive: {
      default: 0,
      type: Number
    },
    tabCurrent: {
      type: Number
    },
    tabCb: {
      default: '',
      type: String
    }
  },

  data () {
    return {
      gameList: [], // 数据列表
      currentPage: 1 // 当前页数, 从 1 开始
    }
  },

  mounted () {
    console.log(this.tabActive, this.tabCurrent, this.tabCb)
    this.cloudFn()
  },

  methods: {
    async cloudFn () {
      const res = await wx.cloud.callFunction({
        name: this.tabCb,
        data: {
          page: this.currentPage
        }
      })
      this.gameList = this.gameList.concat(res.result)
      console.log(this.gameList)
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
}
</style>
