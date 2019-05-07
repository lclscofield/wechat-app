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
        loginCount: 1, // 登录次数
        bookrack: [] // 书架
      }
    })
    const doc = (await users.doc(res._id).get()).data
    return {
      userInfo: doc
    }
  } else {
    // 如果存在则更新登录次数和最后登录时间
    const _ = db.command
    const newTime = new Date()
    // 更新数据，等待
    await users
      .where({
        openId: wxContext.OPENID
      })
      .update({
        data: {
          loginCount: _.inc(1),
          updateTime: newTime
        }
      })
    // 查到数据然后返回更新后的数据，等待数据库操作
    const doc = (await users
      .where({
        openId: wxContext.OPENID
      })
      .get()).data[0]

    return {
      userInfo: doc
    }
  }
}
