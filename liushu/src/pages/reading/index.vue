<template>
  <div class="reading">
    <div class="chapter-title">{{ chapter.title }}</div>
    <rich-text class="chapter-body" :nodes="chapter.ctx"></rich-text>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: '', // 目录地址
      currentHref: '', // 当前章节 href
      chapter: {}
    }
  },
  async mounted () {
    this.chapter = {}
    const { url, href, title } = this.$root.$mp.query
    this.url = url
    this.currentHref = href
    console.log(url, href, title)

    mpvue.showLoading({
      title: '加载中'
    })
    const res = await mpvue.cloud
      .callFunction({
        name: 'getChapter',
        data: { href }
      })
    this.chapter = res.result
    // 渲染内容
    // 章节 url
    this.chapter.href = href
    // 目录 url
    this.chapter.catalog = url
    mpvue.hideLoading()
    console.log(this.chapter)
  }
}
</script>

<style lang="scss" scoped>
.reading {
  height: 100vh;
  font-size: 28rpx;
  background-color: #f5f5d5;
  overflow: auto;

  > .chapter-title {
    font-size: 32rpx;
    text-align: center;
    padding: 20rpx 0;
  }
}
</style>
