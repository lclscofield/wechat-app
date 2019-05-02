<template>
  <div class="bookrack">
    <div class="bookrack-title">共 {{ bookCount }} 本</div>
    <button v-if="!openId" class="bookrack-btn" open-type="getUserInfo" @getuserinfo="onGotUserInfo">登录</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      bookCount: 0
    }
  },
  computed: {
    ...mapState([
      'openId'
    ])
  },
  created () {
    // let app = getApp()
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    onGotUserInfo (e) {
      const detail = e.mp.detail
      console.log(detail)
      if (detail.userInfo) {
        this.login(detail.userInfo)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bookrack {
  height: 100vh;

  .bookrack-title {
    font-size: 32rpx;
    border-bottom: 2rpx solid #c2f0e8;
    padding-left: 20rpx;
    line-height: 60rpx;
  }

  .bookrack-btn {
    line-height: 60rpx;
    margin-top: 200rpx;
    padding: 0;
    font-size: 32rpx;
    width: 30%;
  }
}
</style>