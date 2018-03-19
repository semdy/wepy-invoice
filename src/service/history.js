export class History {
  constructor (storeName, maxLength = 10) {
    this.storeName = storeName
    this.maxLength = maxLength
    this._group = wx.getStorageSync(this.storeName) || []
  }

  add(data) {
    if (!data) return
    if (this.has(data)) {
      this.remove(data)
    }
    this._group.unshift(data)
    if (this._group.length > this.maxLength) {
      this._group = this._group.slice(0, this.maxLength)
    }
    try {
      wx.setStorageSync(this.storeName, this._group)
    } catch (e) {
      console.error(`storage save fail with key '${this.storeName}'`)
    }
  }

  has (key) {
    return this._group.indexOf(key) > -1
  }

  getAll() {
    return this._group
  }

  remove (key) {
    let index = this._group.indexOf(key)
    if (index > -1) {
      this._group.splice(index, 1)
      try {
        wx.setStorageSync(this.storeName, this._group)
      } catch (e) {
        console.error(`storage save fail with key '${this.storeName}'`)
      }
    }
  }

  clear() {
    this._group = []
    try {
      wx.removeStorageSync(this.storeName)
    } catch (e) {
      console.error(`storage remove fail with key '${this.storeName}'`)
    }
  }
}
