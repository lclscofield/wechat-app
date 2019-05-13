<template>
  <div class="list">
    <div class="photos-list" v-for="(item, idx) in photos" :key="idx + item.id">
      <img class="photo" :src="item.urls.small" mode="widthFix">
      <div>{{ '-' + item.user.first_name + ' ' + item.user.last_name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      photos: []
    }
  },
  async onLoad () {
    const res = await wx.cloud.callFunction({
      name: 'request'
    })
    console.log(res)
    this.photos = res.result
  }
}
</script>

<style lang="scss" scoped>
.list {
  font-size: 28rpx;

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
