<template>
  <div class="home">
    <div class="home-card home-xingzuo" @click="toXingzuo">
      <div class="home-xingzuo-title">
        <i class="iconfont icon-xingzuo"></i>星座运势
      </div>
      <div class="home-xingzuo-desc">十二星座爱情、工作运势解析。</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    toXingzuo () {
      wx.navigateTo({
        url: '../xingzuo/main'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  overflow: auto;
  font-size: 28rpx;
  background-image: linear-gradient(135deg, #43cbff 10%, #9708cc 100%);

  @keyframes bounce {
    from {
      transform: translateY(0);
    }
    25% {
      transform: translateY(30rpx);
    }
    50% {
      transform: translateY(0);
    }
    75% {
      transform: translateY(-30rpx);
    }
    to {
      transform: translateY(0);
    }
  }

  > .home-card {
    width: 80%;
    margin: 60rpx auto 0;
    border: 2rpx solid #2e5bbd;
    border-radius: 8rpx;
    padding: 40rpx 20rpx;
    box-shadow: 4rpx 4rpx 14rpx 4rpx #2e5bbd;
    color: #ffffff;
    background: rgba(4, 18, 102, 1);
    animation-name: bounce;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  > .home-xingzuo {
    display: flex;
    flex-direction: column;

    > .home-xingzuo-title {
      display: flex;
      align-items: center;
      line-height: 60rpx;

      > .icon-xingzuo {
        font-size: 44rpx;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
