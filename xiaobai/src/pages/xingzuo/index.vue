<template>
  <div class="xingzuo">
    <div class="xingzuo-list">
      <div class="xingzuo-item" v-for="(item, idx) in xingzuoItems" :key="idx + item" @click="toXingzuoDetail(item)">
        <i class="iconfont icon-" :class="[ 'icon-' + xingzuoData[item] + 'zuo' ]"></i>
        <div class="xingzuo-item-title">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      xingzuoData: {
        '白羊座': 'baiyang',
        '金牛座': 'jinniu',
        '双子座': 'shuangzi',
        '巨蟹座': 'juxie',
        '狮子座': 'shizi',
        '处女座': 'chunv',
        '天秤座': 'tiancheng',
        '天蝎座': 'tianxie',
        '射手座': 'sheshou',
        '摩羯座': 'mojie',
        '水瓶座': 'shuiping',
        '双鱼座': 'shuangyu'
      }
    }
  },
  onShareAppMessage (res) {
    return {
      title: '十二星座'
    }
  },
  computed: {
    xingzuoItems () {
      return Object.keys(this.xingzuoData)
    }
  },
  methods: {
    toXingzuoDetail (title) {
      wx.navigateTo({
        url: '../xingzuo_detail/main?type=' + this.xingzuoData[title] + '&title=' + title
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.xingzuo {
  height: 100vh;
  overflow: auto;
  font-size: 28rpx;
  background-image: linear-gradient(135deg, #43cbff 10%, #9708cc 100%);
  color: #ffffff;

  > .xingzuo-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    > .xingzuo-item {
      width: 30%;
      height: 80rpx;
      line-height: 80rpx;
      border: 2rpx solid #2e5bbd;
      border-radius: 8rpx;
      padding: 0 20rpx;
      margin-top: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      > .iconfont {
        font-size: 44rpx;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
