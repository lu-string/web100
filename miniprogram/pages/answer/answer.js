// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    list: [{
      name: 'HTML5',
      color: 'red',
      title:"HTML5试题"
    },
    {
      name: 'CSS3',
      color: 'orange',
      title:"CSS3试题"
    },
    {
      name: 'JavaScript',
      color: 'olive',
      title: "JavaScript试题"
      },
      {
        name: 'ES6',
        color: 'yellow',
        title: "ES6试题"
      },
    
    {
      name: 'Vue',
      color: 'blue',
      title: "Vue试题"
    }
    ],
  },
  BthClick(e) {
    var that=this
    let data = JSON.stringify(e.target.dataset.data)
    wx.navigateTo({
      url: '/pages/ItemBank/ItemBank?id=' + data,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //  调用login云函数获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        wx.cloud.init({
          env: 'weblibrary'
        })
        that.db = wx.cloud.database()
        that.test = that.db.collection('ItemBank')
        that.db.collection('ItemBank').get({
          success: function (res) {
            // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
            that.setData({
              swiperList: res.data
            })
          }
        })
      },
      fail: err => {
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})