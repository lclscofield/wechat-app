<template>
  <div class="list">
    <div class="photos-list" v-for="(item, idx) in photos" :key="idx + item.id">
      <img :src="" alt="">
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

<style scoped>
.list {
}
</style>
