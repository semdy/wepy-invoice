import wepy from 'wepy'
import {showError} from '../utils/util'
import {version, from, ref} from '../config'
import {session} from '../service/auth'

export const serverUrl = 'https://bscqr.qtdatas.com/'

let requestCount = 0
let errorMsg = ''

let fetchApi = (url, params) => {
  return new Promise((resolve, reject) => {

    requestCount++
    errorMsg = ''

    if (requestCount === 1) {
      wx.showLoading({
        mask: true,
        title: '请稍候...'
      })
    }

    let tokenParam = {}
    let sessionInfo = session.get()
    if(sessionInfo && sessionInfo.token) {
      tokenParam = {
        'access-token': sessionInfo.token
      }
    }

    wepy.request({
      url: `${serverUrl}api/${url}?version=${version}`,
      data: Object.assign({}, params.method === 'POST' ? {ref} : {}, params.data),
      method: params.method || 'GET',
      header: Object.assign(tokenParam, params.header || {
        'content-type': 'application/json'
      })
    })
    .then(res => {
      if (res.statusCode === 200) {
        if (res.data.tokenValid) {
          resolve(res.data)
        } else {
          session.clear()
          reject('session timeout')
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      } else {
        reject(errorMsg = (res.data.message||'服务器发生错误'))
      }
    })
    .catch(() => {
      reject(errorMsg = '与服务器连接失败')
    })
    .finally(() => {
      if (--requestCount === 0) {
        if(errorMsg){
          showError(errorMsg)
        } else {
          wx.hideLoading()
        }
        wx.stopPullDownRefresh()
      }
    })
  })
}

fetchApi.post = (url, params = {}) => {
  return fetchApi(url, Object.assign({data: params}, {method: 'POST'}))
}

fetchApi.get = (url, params = {}) => {
  return fetchApi(url, Object.assign({data: params}, {method: 'GET'}))
}

export default fetchApi
