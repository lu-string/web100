// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //  调用login云函数获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.cloud.init({
          env: 'weblibrary'
        })
        that.db = wx.cloud.database()
        that.test = that.db.collection('userInfo')
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
    // 
   
  },
  BthClick() {
    wx.navigateTo({
      url: '/pages/ceshi/ceshi',
    })
  },

  
  // 
  // 用户信息授权
  getInfo(e) {
    var that = this
    console.log(e)
  
    if (e.detail.userInfo) {
      this.get_publickey()
    } else {
      // console.log('用户点击拒绝')
      wx.showToast({
        title: '允许授权后才可使用',
        icon: 'none',
        duration: 2000
      })
      // that.setData({
      //   checkeds: false,
      // })
    }
  },
  // 
  get_publickey(e) {
    var that = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (res) {
                    console.log(res.userInfo)
                    // wx.setStorage({
                    //   key: 'userinfo',
                    //   data: res.userInfo,
                    // })
                    wx.setStorage({
                      key: 'info',
                      data: res.userInfo,
                    })
                    that.setData(res)
                  }
                })
              } else {

                console.log('没有授权')

              }
            }
          })
          // wx.getStorage({
          //   key: 'userinfo',
          //   success (res) {
          //     console.log(res.data)
          //   }
          // })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })



    // 查询
    // this.db.collection('userInfo').get({
    //   //如果查询成功的话
    //   success(res) {
    //     console.log(res)
    //将获得的数据集加入到原来的数据集中
    //调试一下，是否加入
    //这里需要多多注意一下，数据加入后都是在下标1里面的
    // 

    //   },
    // })
    //  向test数据集添加记录


  },
  setData(data) {
    var that = this
    //发起网络请求
    that.test.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        data: data.userInfo
      },
      //  数据插入成功，调用该函数
      success: function (res) {

        if (res._id) {
          wx.switchTab({
            url: '/pages/user/user',
          })
          // -----------------------别动我代码！！！------------------------------------
          wx.setStorage({
            key: 'name',
            data: data.userInfo.nickName,
          })
           // -----------------------别动我代码！！！------------------------------------
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})