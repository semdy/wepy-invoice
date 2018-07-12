/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 */
function formatDate (source, format) {
  const o = {
    'M+': source.getMonth() + 1, // 月份
    'd+': source.getDate(), // 日
    'H+': source.getHours(), // 小时
    'm+': source.getMinutes(), // 分
    's+': source.getSeconds(), // 秒
    'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
    'f+': source.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  })
}

function showError (msg, duration) {
  duration = duration || 1500;
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      wx.showToast({
        title: msg,
        image: '../../images/error.png',
        duration: duration
      })
      setTimeout(resolve, duration)
    }, 50)
  })
}

function showToast (msg, duration) {
  duration = duration || 1500
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      wx.showToast({
        title: msg,
        duration: duration
      })
      setTimeout(resolve, duration)
    }, 50)
  })
}

function confirm (msg) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          reject(false)
        }
      }
    })
  })
}

let isLogouted = false

function redirectToLogin () {
  if (!isLogouted) {
    setLogout(true)
    wx.reLaunch({url: '/pages/login/login'})
  }
}

function setLogout (status) {
  isLogouted = status
}

module.exports = {formatDate, uuid, showError, showToast, confirm, redirectToLogin, setLogout}
