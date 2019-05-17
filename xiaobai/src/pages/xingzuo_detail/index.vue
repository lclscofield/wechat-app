<template>
  <div class="xingzuo-detail">
    <div class="xingzuo-detail-wrap" v-if="showPage">
      <div class="xingzuo-title-wrap">
        <i class="iconfont icon-" :class="[ 'icon-' + type + 'zuo' ]"></i>
        <div class="xingzuo-title">{{ title }}</div>
      </div>

      <div class="xingzuo-detail-list" v-for="(item, idx) in listVal" :key="idx + item">
        <div class="xingzuo-detail-title">{{ listTitle[idx] + '运势' }}</div>
        <div class="xingzuo-field" v-for="(field, fieldIdx) in xingzuoVal" :key="fieldIdx + field">
          <template v-if="xingzuo[item][field]">
            <div class="xingzuo-field-title">{{ xingzuoTitle[fieldIdx] }}:</div>
            <div class="xingzuo-field-value">{{ xingzuo[item][field] }}{{ fieldIdx <= 3 ? (item === 'year' ? ' / 100分' : ' / 5') : '' }}{{ xingzuo[item][field] === (item === 'year' ? '100分' : 5) ? ' (满分💯)' : '' }}</div>
          </template>
        </div>
      </div>
    </div>

    <!-- loading -->
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Toast from '../../../static/vant/toast/toast'

export default {
  data () {
    return {
      showPage: false,
      type: '',
      title: '',
      xingzuo: {},
      numField: ['summary_star', 'love_star', 'money_star', 'work_star'],
      list: {
        '本日': 'day',
        '明日': 'tomorrow',
        '本周': 'week',
        '本月': 'month',
        '本年': 'year'
      },
      field: {
        '综合指数': 'summary_star',
        '爱情指数': 'love_star',
        '财富指数': 'money_star',
        '工作指数': 'work_star',
        '年度综合指数': 'general_index',
        '年度爱情指数': 'love_index',
        '年度财富指数': 'money_index',
        '年度工作指数': 'work_index',
        '缘份星座': 'yfxz',
        '贵人星座': 'grxz',
        '小人星座': 'xrxz',
        '幸运数字': 'lucky_num',
        '幸运日期': 'lucky_day',
        '吉时': 'lucky_time',
        '吉色': 'lucky_color',
        '吉利方位': 'lucky_direction',
        '今日提醒': 'day_notice',
        '本周提醒': 'week_notice',
        '本月优势': 'month_advantage',
        '本月弱势': 'month_weakness',
        '一句话简评': 'oneword',
        '运势简评': 'general_txt',
        '爱情运势': 'love_txt',
        '工作学业': 'work_txt',
        '财富运势': 'money_txt',
        '健康运势': 'health_txt',
        '时间': 'time'
      }
    }
  },
  computed: {
    listTitle () {
      return Object.keys(this.list)
    },
    listVal () {
      return Object.values(this.list)
    },
    xingzuoTitle () {
      return Object.keys(this.field)
    },
    xingzuoVal () {
      return Object.values(this.field)
    }
  },
  async onLoad () {
    const { type, title } = this.$root.$mp.query
    console.log(type, title)
    this.type = type
    this.title = title
    // 修改导航栏 title
    wx.setNavigationBarTitle({
      title
    })
    await this.getXingzuo(type)
  },
  onUnload () {
    this.xingzuo = {}
    this.showPage = false
  },
  methods: {
    async getXingzuo (type) {
      // 同步读取数据
      let cache = wx.getStorageSync(type)
      if (cache && cache.date === new Date().toLocaleDateString()) {
        // 缓存存在并没有过期
        this.xingzuo = cache
        this.showPage = true
      } else {
        // 缓存不存在，请求数据
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        })
        let res = await wx.cloud
          .callFunction({
            name: 'getXingzuo',
            data: { type }
          })
        console.log(res)
        res = res.result
        Toast.clear()
        if (res) {
          this.xingzuo = res
          this.showPage = true
          // 异步缓存数据
          mpvue.setStorage({
            key: type,
            data: Object.assign(this.xingzuo, {
              date: new Date().toLocaleDateString()
            })
          })
        } else {
          Toast.fail('请求失败')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.xingzuo-detail {
  height: 100vh;
  overflow: auto;
  font-size: 28rpx;

  > .xingzuo-detail-wrap {
    padding: 60rpx 40rpx;

    > .xingzuo-title-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #c294f0;

      > .iconfont {
        font-size: 48rpx;
        margin-right: 10rpx;
      }

      > .xingzuo-title {
        font-size: 40rpx;
      }
    }

    > .xingzuo-detail-list {
      padding: 40rpx 0;

      > .xingzuo-detail-title {
        font-size: 36rpx;
        padding-bottom: 10rpx;
        margin-bottom: 10rpx;
        border-bottom: 2rpx solid #dac2f1;
      }

      > .xingzuo-field {
        display: flex;
        align-items: flex-start;
        line-height: 1.5;
        font-size: 32rpx;

        > .xingzuo-field-title {
          padding-top: 10rpx;
          color: #dac2f1;
        }

        > .xingzuo-field-value {
          flex: 1;
          padding: 10rpx 0;
          padding-left: 20rpx;
        }
      }
    }
  }
}
</style>
