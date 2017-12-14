const SESSION_KEY = 'SESSION'
const SESSION_GROUP_KEY = 'SESSION_GROUP'

let _group = wx.getStorageSync(SESSION_GROUP_KEY) || {}

export const session = {
  set(info) {
    try {
      wx.setStorageSync(SESSION_KEY, info)
    } catch (e) {
      console.error("storage save fail with key 'session'")
    }
  },
  get() {
    try {
      return wx.getStorageSync(SESSION_KEY)
    } catch (e) {
      return null;
    }
  },
  clear() {
    try {
      wx.removeStorageSync(SESSION_KEY)
    } catch (e) {
      console.error("storage remove fail with key 'session'")
    }
  }
}

export const sessionGroup = {
  add(id, data) {
    if (this.has(id)) return
    _group[id] = data
    try {
      wx.setStorageSync(SESSION_GROUP_KEY, _group)
    } catch (e) {
      console.error("storage save fail with key 'session'")
    }
  },
  get(id) {
    return _group[id]
  },
  has (id) {
    return this.get(id) !== undefined
  },
  getAll() {
    return _group
  },
  toArray() {
    let sessions = []
    for (let i in _group) {
      sessions.push(_group[i])
    }
    return sessions
  },
  remove (id) {
    delete _group[id]
    try {
      wx.setStorageSync(SESSION_GROUP_KEY, _group)
    } catch (e) {
      console.error("storage save fail with key 'session'")
    }
  },
  clear() {
    _group = {}
    try {
      wx.removeStorageSync(SESSION_GROUP_KEY)
    } catch (e) {
      console.error("storage remove fail with key 'session'")
    }
  }
}
