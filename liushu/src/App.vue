<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  created () {
    const self = this
    // 云函数初始化
    mpvue.cloud.init()

    // 判断是否授权
    mpvue.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已授权则直接登录
          self.login()
        } else {
          // openId 占位
          self.setOpenId('')
        }
      }
    })
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
  },
  methods: {
    ...mapMutations({
      setOpenId: 'SET_OPEN_ID'
    }),
    ...mapActions([
      'login'
    ])
  }
}
</script>

<style>
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
