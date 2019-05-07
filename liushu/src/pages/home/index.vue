<template>
  <div class="home">
    <!-- 热门 -->
    <div class="home-hot">
      <swiper class="hot-swiper" autoplay="true" circular="true" previous-margin="25px" next-margin="25px" @change="swiperChange">
        <swiper-item class="hot-swiper-item" v-for="(item, index) in hot.list" :key="index + item.imgUrl">
          <div class="hot-swiper-item-wrap" @click="toBookDetail(item.href, item.bookName)">
            <img :src="item.imgUrl" class="slide-image" />
            <div class="hot-content">
              <div class="hot-content-info">
                <div class="hot-book-name">{{ item.bookName }}</div>
                <div class="hot-book-author">{{ item.author }}</div>
              </div>
              <div class="hot-desc">{{ item.bookDesc }}</div>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <!-- 推荐 -->
    <div class="home-recommend">
      <div class="recommend-title">{{ recommend.title }}</div>
      <div class="recommend-item" hover-class="hover-class" hover-stay-time="200" v-for="(item, index) in recommend.list" :key="index + item.href" @click="toBookDetail(item.href, item.bookName)">
        <div class="recommend-info">
          <div class="recommend-type">{{ item.type }}</div>
          <div class="recommend-book-name">{{ item.bookName }}</div>
        </div>
        <div class="recommend-author">{{ item.author }}</div>
      </div>
    </div>

    <!-- 类目 -->
    <div class="home-category">
      <div class="category-list" v-for="(typeItem, typeIdx) in category" :key="typeIdx + typeItem.title">
        <div class="category-title">{{ typeItem.title }}</div>
        <div class="category-top" hover-class="hover-class" hover-stay-time="200" @click="toBookDetail(typeItem.top.href, typeItem.top.bookName)">
          <img :src="typeItem.top.imgUrl" class="category-top-img">
          <div class="category-top-content">
            <div class="category-top-book-name">{{ typeItem.top.bookName }}</div>
            <div class="category-top-desc">{{ typeItem.top.bookDesc }}</div>
          </div>
        </div>
        <div class="category-item" hover-class="hover-class" hover-stay-time="200" v-for="(item, idx) in typeItem.list" :key="idx + item.href" @click="toBookDetail(item.href, item.bookName)">
          <div class="category-item-book-name">{{ item.bookName }}</div>
          <div class="category-item-author">{{ item.author }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hot: {}, // 热门
      recommend: {}, // 经典推荐
      category: [] // 各种类型
    }
  },
  async created () {
    const res = await mpvue.cloud
      .callFunction({
        name: 'getHome'
      })
    console.log(res)
    const data = res.result
    this.hot = data.hot
    this.recommend = data.recommend
    this.category = data.category
  },
  methods: {
    toBookDetail (url, title) {
      mpvue.navigateTo({
        url: '../bookDetail/main?url=' + url + '&title=' + title
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  font-size: 28rpx;

  > .home-hot {
    > .hot-swiper {
      height: 340rpx;

      .hot-swiper-item {
        display: flex;
        justify-content: center;

        > .hot-swiper-item-wrap {
          height: 300rpx;
          padding: 20rpx 20rpx;
          background: #e9faff;
          border-radius: 8rpx;
          width: 90%;
          display: flex;
          > .slide-image {
            border-radius: 8rpx;
            height: 300rpx;
            width: 240rpx;
          }

          > .hot-content {
            flex: 1;
            padding-left: 20rpx;

            > .hot-content-info {
              line-height: 60rpx;
              display: flex;
              justify-content: space-between;
            }

            > .hot-desc {
              display: -webkit-box;
              -webkit-line-clamp: 6;
              -webkit-box-orient: vertical;
              color: #828383;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
  }

  .hover-class {
    background: #e9faff;
  }

  > .home-recommend {
    margin-top: 40rpx;

    > .recommend-title {
      font-size: 32rpx;
      padding-left: 20rpx;
    }

    > .recommend-item {
      padding: 0 20rpx;
      line-height: 60rpx;
      display: flex;
      justify-content: space-between;

      > .recommend-info {
        display: flex;

        > .recommend-book-name {
          padding-left: 20rpx;
          color: #84a0dd;
        }
      }
    }
  }

  > .home-category {
    > .category-list {
      margin-top: 40rpx;

      > .category-title {
        font-size: 32rpx;
        padding-left: 20rpx;
      }

      > .category-top {
        padding: 0 20rpx;
        margin: 20rpx 0;
        display: flex;

        > .category-top-img {
          width: 180rpx;
          height: 240rpx;
          border-radius: 8rpx;
        }

        > .category-top-content {
          flex: 1;
          padding-left: 20rpx;

          > .category-top-book-name {
            line-height: 60rpx;
          }

          > .category-top-desc {
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;
            color: #828383;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

      > .category-item {
        padding: 0 20rpx;
        line-height: 60rpx;
        display: flex;
        justify-content: space-between;

        > .category-item-book-name {
          color: #84a0dd;
        }
      }
    }
  }
}
</style>
