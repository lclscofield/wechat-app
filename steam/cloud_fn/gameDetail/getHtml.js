const request = require('request')

async function getHtml (options) {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        resolve(body)
      } else {
        reject(err || '请求错误')
      }
    })
  })
}

module.exports = getHtml
