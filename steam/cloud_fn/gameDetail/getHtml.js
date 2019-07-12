const request = require('request')

async function getHtml (options) {
  return new Promise((resolve, reject) => {
    // 写入 cookie 绕过年龄限制
    options.headers = {
      Cookie: 'birthtime=' + 817804801
    }
    request(options, async (err, res, body) => {
      if (!err && res.statusCode === 200) {
        resolve(body)
      } else {
        reject(err || '请求错误')
      }
    })
  })
}

module.exports = getHtml
