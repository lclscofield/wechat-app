<template>
  <div class="home">
    <div class="home-card home-xingzuo">
      <div class="home-xingzuo-title">
        <i class="iconfont icon-xingzuo"></i>星座运势
      </div>
      <div class="home-xingzuo-desc">十二星座爱情、工作运势解析。</div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  overflow: auto;
  font-size: 28rpx;
  background: linear-gradient(#c983ec, #9d33d3 50%, #688fe4);

  > .home-card {
    width: 80%;
    margin: 40rpx auto 0;
    border: 2rpx solid #2e5bbd;
    border-radius: 8rpx;
    padding: 40rpx 20rpx;
    box-shadow: 4rpx 4rpx 14rpx 4rpx #2e5bbd;
    color: #ffffff;
    background: rgba(150, 204, 218, 0.2);
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
