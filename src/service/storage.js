export default class Storage {
  constructor (storeName) {
    this.storeName = storeName
    this.data = wx.getStorageSync(this.storeName) || []
  }

  add(data) {
    if (!data) return
    if (Array.isArray(data)) {
      this.data = data.concat(this.data)
    } else {
      this.data.unshift(data)
    }
    try {
      wx.setStorageSync(this.storeName, this.data)
    } catch (e) {
      console.error(`storage save fail with key '${this.storeName}'`)
    }
  }

  getAll() {
    return this.data.slice()
  }

  remove (id) {
    let index = this.data.findIndex(item => item.id === id)
    if (index > -1) {
      this.data.splice(index, 1)
      try {
        wx.setStorageSync(this.storeName, this.data)
      } catch (e) {
        console.error(`storage save fail with key '${this.storeName}'`)
      }
    }
  }

  clear() {
    this.data = []
    try {
      wx.removeStorageSync(this.storeName)
    } catch (e) {
      console.error(`storage remove fail with key '${this.storeName}'`)
    }
  }
}
