// 云函数入口文件
const cloud = require('wx-server-sdk')
require('es6-promise').polyfill()
require('isomorphic-fetch')
const Unsplash = require('unsplash-js').default
const toJson = require('unsplash-js').toJson

const unsplash = new Unsplash({
  applicationId: 'fe2f17aa135cf81554346e9bae7fb52e50cbbbb63f89ca9073f5b6d01af963df',
  secret: 'f91a23e8dd6298bd5d19c8bc0a2ae33bc753525c0e1e4fc8d67b72439f4f3168'
})

cloud.init()

// 云函数入口函数
// 参数: page, perPage, orderBy(有效值: latest, oldest, popular; 默认值: latest)
exports.main = async (event, context) => {
  const res = await unsplash.photos.listPhotos(...event.params).then(toJson)

  if (res && res.status === 200) {
    return res.body
  } else {
    return res
  }
}
