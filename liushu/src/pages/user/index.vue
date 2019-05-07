<template>
  <div class="user">
    <button v-if="!openId" class="user-login" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">登录</button>
    <div v-else class="user-info">
      <div class="user-cell user-title">
        <img :src="userInfo.avatarUrl" class="user-avatar">
        <div class="user-nick-name">{{ userInfo.nickName }}</div>
      </div>
      <div class="user-cell">
        <div class="user-cell-label">城市</div>
        <div class="user-cell-val">{{ userInfo.country}} {{ userInfo.province }} {{ userInfo.city}}</div>
      </div>
      <div class="user-cell">
        <div class="user-cell-label">性别</div>
        <div class="user-cell-val">{{ getGender }}</div>
      </div>
      <div class="user-cell">
        <div class="user-cell-label">登录次数</div>
        <div class="user-cell-val">{{ userInfo.loginCount }}</div>
      </div>
      <div class="user-cell">
        <div class="user-cell-label">上次登录时间</div>
        <div class="user-cell-val">{{ lastLoginTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formatTime } from '../../utils'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'openId',
      'userInfo'
    ]),
    getGender () {
      if (this.userInfo.gender === 1) {
        return '男'
      } else if (this.userInfo.gender === 2) {
        return '女'
      }
      return '未知'
    },
    lastLoginTime () {
      return formatTime(new Date(this.userInfo.updateTime))
    }
  },
  mounted () {
    console.log(this.userInfo)
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    onGotUserInfo (e) {
      const detail = e.mp.detail
      if (detail.userInfo) {
        this.login(detail.userInfo)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  height: 100vh;
  font-size: 28rpx;

  > .user-login {
    line-height: 60rpx;
    margin-top: 200rpx;
    padding: 0;
    font-size: 32rpx;
    width: 30%;
  }

  > .user-info {
    > .user-title {
      > .user-avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 100%;
      }

      > .user-nick-name {
        margin-right: 20px;
      }
    }

    > .user-cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 40rpx;
      height: 100rpx;

      > .user-cell-val {
        margin-right: 20px;
      }
    }
  }
}
</style>
