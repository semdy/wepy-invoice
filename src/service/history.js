const HISTORY_KEY = 'BSC_HISTORY'

let _group = wx.getStorageSync(HISTORY_KEY) || []

export const history = {
  maxLength: 10,
  add(data) {
    if (!data) return
    if (this.has(data)) {
      this.remove(data)
    }
    _group.unshift(data)
    if (_group.length > this.maxLength) {
      _group = _group.slice(0, this.maxLength)
    }
    try {
      wx.setStorageSync(HISTORY_KEY, _group)
    } catch (e) {
      console.error("storage save fail with key 'session'")
    }
  },
  has (key) {
    return _group.indexOf(key) > -1
  },
  getAll() {
    return _group
  },
  remove (key) {
    let index = _group.indexOf(key)
    if (index > -1) {
      _group.splice(index, 1)
      try {
        wx.setStorageSync(HISTORY_KEY, _group)
      } catch (e) {
        console.error("storage save fail with key 'session'")
      }
    }
  },
  clear() {
    _group = []
    try {
      wx.removeStorageSync(HISTORY_KEY)
    } catch (e) {
      console.error("storage remove fail with key 'session'")
    }
  }
}
