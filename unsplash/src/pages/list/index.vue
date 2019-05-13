<template>
  <div class="list">
    <div class="photos-list" v-for="(item, idx) in photos" :key="idx + item.id">
      <img class="photo" :src="item.urls.small" mode="widthFix">
      <div>{{ '-' + item.user.first_name + ' ' + item.user.last_name }}</div>
    </div>

    <!-- Loading -->
    <wux-spin class="loading" v-if="loading" tip="Loading..."></wux-spin>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      photos: []
    }
  },
  async onLoad () {
    this.loading = true
    const res = await wx.cloud.callFunction({
      name: 'request'
    })
    console.log(res)
    this.photos = res.result
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.list {
  font-size: 28rpx;

  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > .photos-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 40rpx;

    > .photo {
      width: 700rpx;
    }
  }
}
</style>
