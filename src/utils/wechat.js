import { version, ref } from '../config'
import { session } from '../service/auth'
import fetch, { serverUrl } from '../service/fetch'
import { uuid } from '../utils/util'

function login (needOpenId) {
  return new Promise((resolve, reject) => {
    wx.login({
      success (res) {
        if (res.code) {
          if (needOpenId) {
            getOpenIdByCode(res.code).then(info => {
              resolve(Object.assign({}, res, info))
            }, reject)
          } else {
            resolve(res)
          }
        } else {
          reject(res.errMsg)
        }
      },
      fail () {
        reject('微信登录接口调用失败')
      }
    })
  })
}

function getUserInfo (mergeData) {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success (res) {
        if (typeof mergeData === 'object') {
          Object.assign(res.userInfo, mergeData)
        }
        resolve(res)
      },
      fail () {
        reject('用户拒绝授权')
      }
    })
  })
}

function getOpenIdByCode (code) {
  return new Promise((resolve, reject) => {
    fetch.get('auth/wx-auth', {code}).then(res => {
      if (res.success) {
        let info = {}
        info.openid = res.data.openid
        info.expires_in = Date.now() + res.data.expires_in
        if (res.data.unionid) {
          info.unionid = res.data.unionid
        }
        resolve(info)
      } else {
        reject(res.message)
      }
    })
  })
}

function uploadFile (url, filePath, formParams, header) {
  wx.showLoading({
    mask: true,
    title: '上传中...'
  })

  let params = Object.assign({
    ref
  }, formParams || {})

  let defHeaders = {'content-type': 'application/json'}
  let locationData = wx.getStorageSync('LOCATION_DATA')
  let sessionInfo = session.get()

  if (sessionInfo && sessionInfo.token) {
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

  for (let i in params) {
    params[i] = typeof params[i] !== 'string' ? JSON.stringify(params[i]) : params[i]
  }

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${serverUrl}api/${url}?version=${version}`,
      filePath: filePath,
      name: 'file',
      header: Object.assign(defHeaders, header),
      formData: params,
      success (res) {
        if (res.statusCode === 200) {
          let data = JSON.parse(res.data)
          resolve(data)
        } else {
          reject(res.errMsg)
        }
      },
      fail () {
        reject('上传接口调用失败')
      },
      complete () {
        wx.hideLoading()
      }
    })
  })
}

module.exports = {login, getUserInfo, getOpenIdByCode, uploadFile}
