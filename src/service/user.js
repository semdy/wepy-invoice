
import fetch from './fetch'
import {session} from './auth'

export const login = (code, password) => {
  return new Promise((resolve, reject) => {
    fetch.post('auth/login', {code, password})
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
