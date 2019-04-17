/* global wx */
import wepy from 'wepy'
import {showError, uuid, redirectToLogin} from '../utils/util'
import {version, ref} from '../config'
import {session} from '../service/auth'

export const serverUrl = 'https://bscqr.qtdatas.com/api/'
// export const serverUrl = 'https://bscqr.qtdatas.com/dev/'

const logout = () => {
  if (wx.getStorageSync('__ISLOGOUT')) return
  session.clear()
  wx.removeStorageSync('needRefresh.home')
  redirectToLogin()
  wx.setStorageSync('__ISLOGOUT', '1')
}

let requestCount = 0
let errorMsg = ''

let fetchApi = (url, params = {}, useToken = true, showLoading = true) => {
  return new Promise((resolve, reject) => {

    showLoading && requestCount++
    errorMsg = ''

    if (requestCount === 1) {
      showLoading && wx.showLoading({
        mask: true,
        title: '请稍候...'
      })
    }

    let defHeaders = {'content-type': 'application/json'}
    let locationData = wx.getStorageSync('LOCATION_DATA')
    let sessionInfo = session.get()

    if (useToken && sessionInfo && sessionInfo.token) {
      defHeaders = Object.assign(defHeaders, {
        'access-token': sessionInfo.token
      })
    }

    if (locationData) {
      defHeaders = Object.assign(defHeaders, {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        uuid: uuid()
      })
    }

    wepy.request({
      url: `${serverUrl}${url}?version=${version}`,
      data: Object.assign({}, params.data, params.method === 'POST' && {ref}),
      method: params.method || 'GET',
      header: Object.assign(defHeaders, params.header)
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
      showLoading && requestCount--
      if (requestCount === 0) {
        if (errorMsg) {
          showError(errorMsg)
        } else {
          showLoading && wx.hideLoading()
        }
        wx.stopPullDownRefresh()
      }
    })
  })
}

fetchApi.post = (url, params, useToken, showLoading) => {
  return fetchApi(url, {data: params, method: 'POST'}, useToken, showLoading)
}

fetchApi.get = (url, params, useToken, showLoading) => {
  return fetchApi(url, {data: params, method: 'GET'}, useToken, showLoading)
}

export default fetchApi
