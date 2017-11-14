export const session = {
  set(info){
    try {
      wx.setStorageSync('session', info);
    } catch (e) {
      console.error("storage save fail with key 'session'");
    }
  },
  get(){
    try {
      return wx.getStorageSync('session');
    } catch (e) {
      return null;
    }
  },
  clear(){
    try {
      wx.removeStorageSync('session');
    } catch (e) {
      console.error("storage remove fail with key 'session'");
    }
  }
};