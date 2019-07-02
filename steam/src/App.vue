<script>
export default {
  created () {
    // 云函数初始化
    wx.cloud.init({
      // 切换环境
      env: 'steam-ze69m',
      // env: 'steam-dev-k3q3r',
      traceUser: true
    })
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
  }
}
</script>

<style>
</style>
