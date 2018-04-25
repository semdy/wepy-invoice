import wepy from 'wepy'
import {showError, uuid, redirectToLogin} from '../utils/util'
import {version, ref} from '../config'
import {session} from '../service/auth'

export const serverUrl = 'https://bscqr.qtdatas.com/'

const logout = () => {
  session.clear()
  wx.removeStorageSync('needRefresh.home')
  redirectToLogin()
}

let requestCount = 0
let errorMsg = ''

let fetchApi = (url, params = {}, useToken = true) => {
  return new Promise((resolve, reject) => {

    requestCount++
    errorMsg = ''

    if (requestCount === 1) {
      wx.showLoading({
        mask: true,
        title: '请稍候...'
      })
    }

    let initParams = {'content-type': 'application/json'}
    let locationData = wx.getStorageSync('LOCATION_DATA')
    let sessionInfo = session.get()

    if (useToken && sessionInfo && sessionInfo.token) {
      initParams = Object.assign(initParams, {
        'access-token': sessionInfo.token
      })
    }

    if (locationData) {
      initParams = Object.assign(initParams, {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        uuid: uuid()
      })
    }

    wepy.request({
      url: `${serverUrl}api/${url}?version=${version}`,
      data: Object.assign({}, params.method === 'POST' ? {ref} : {}, params.data),
      method: params.method || 'GET',
      header: Object.assign(initParams, params.header)
    })
    .then(res => {
      if (res.statusCode === 200) {
        if (res.data.tokenValid === false) {
          logout()
          reject('登录信息过期')
        } else {
          resolve(res.data)
        }
      } else {
        reject(errorMsg = (res.data.message || '服务器发生错误'))
      }
    })
    .catch(() => {
      reject(errorMsg = '与服务器连接失败')
    })
    .finally(() => {
      if (--requestCount === 0) {
        if (errorMsg) {
          showError(errorMsg)
        } else {
          wx.hideLoading()
        }
        wx.stopPullDownRefresh()
      }
    })
  })
}

fetchApi.post = (url, params, useToken) => {
  return fetchApi(url, Object.assign({data: params}, {method: 'POST'}), useToken)
}

fetchApi.get = (url, params, useToken) => {
  return fetchApi(url, Object.assign({data: params}, {method: 'GET'}), useToken)
}

export default fetchApi
