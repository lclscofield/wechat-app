// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 连接数据库
  const db = cloud.database()
  const users = db.collection('users')
  const _ = db.command

  // 更新数据
  if (event.isBookrack) {
    // 移出
    const bookrack = (await users
      .where({
        openId: wxContext.OPENID
      })
      .get()).data[0].bookrack
    bookrack.splice(event.bookIdx, 1)
    // 替换
    await users
      .where({
        openId: wxContext.OPENID
      })
      .update({
        data: {
          bookrack: _.set(bookrack)
        }
      })
  } else {
    // 添加
    await users
      .where({
        openId: wxContext.OPENID
      })
      .update({
        data: {
          bookrack: _.push(event.bookDetail)
        }
      })
  }
  // 返回
  const doc = (await users
    .where({
      openId: wxContext.OPENID
    })
    .get()).data[0]

  return {
    bookrack: doc.bookrack
  }
}
