// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 连接数据库
  const db = cloud.database()
  const users = db.collection('users')

  const docs = (await users
    .where({
      openId: wxContext.OPENID
    })
    .get()).data

  // 不存在则插入一条新数据
  if (!docs.length) {
    const res = await users.add({
      data: {
        ...event.user,
        openId: wxContext.OPENID,
        createTime: new Date(),
        updateTime: new Date(),
        loginCount: 1
      }
    })
    const doc = (await users.doc(res._id).get()).data
    return {
      userInfo: doc
    }
  }

  return {
    userInfo: docs[0]
  }
}
