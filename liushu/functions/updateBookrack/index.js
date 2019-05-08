// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 更新书架信息
async function upDateBookrack (openId, event) {
  // 连接数据库
  const db = cloud.database()
  const users = db.collection('users')
  const _ = db.command

  const bookrack = (await users
    .where({
      openId
    })
    .get()).data[0].bookrack
  bookrack.forEach(item => {
    if (item.url === event.url) {
      item.currentChapter.chapterTitle = event.title
      item.currentChapter.href = event.href
    }
  })
  // 替换
  await users
    .where({
      openId
    })
    .update({
      data: {
        bookrack: _.set(bookrack)
      }
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  await upDateBookrack(wxContext.OPENID, event)

  return true
}
