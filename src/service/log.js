import fetch from './fetch'

export default {
  _logId: '',
  async add(model) {
    try {
      const data = await fetch.post('pageLog/addPageLog', { model })
      this._logId = data.data
    } catch (err) {
      console.error(err)
    }
  },
  update() {
    if (!this._logId) return Promise.reject('logId is null') // eslint-disable-line
    const id = this._logId
    this._logId = ''
    return fetch.post('pageLog/upPageLog', { id })
  }
}