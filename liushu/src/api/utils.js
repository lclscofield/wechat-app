let util = {}

const ajaxUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3000/api' : 'https://api.code.net.cn'

util.API = ajaxUrl
util.oauthUrl = ajaxUrl

export default util
