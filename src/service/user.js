
import fetch from './fetch'
import {session} from './auth'

export const login = params => {
  return new Promise((resolve, reject) => {
    fetch.post('auth/login', params, false)
      .then(res => {
        if (res.success === false) {
          reject(res.message)
        } else {
          resolve(res)
        }
      }, reject)
  })
}

export const logout = () => {
  return new Promise((resolve, reject) => {
    session.clear()
    resolve()
  })
}

export const registry = params => {
  return new Promise((resolve, reject) => {
    fetch.post('auth/register', params, false)
      .then(res => {
        if (res.success === false) {
          reject(res)
        } else {
          resolve(res)
        }
      }, reject)
  })
}

export const sendMessage = params => {
  return new Promise((resolve, reject) => {
    fetch.get('auth/sendMessage', params, false)
      .then(res => {
        if (res.success === false) {
          reject(res.message)
        } else {
          resolve(res)
        }
      }, reject)
  })
}
