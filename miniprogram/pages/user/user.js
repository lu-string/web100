// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    ImageShow: false,
    arrow: false,
    guanyuShow: false,
    scale: 1,
    windowHeight: 500,
    url:"",
    userName:"",
    isShow:true,
    info:{}
  },
  // 打开微信支付
  showQrcode() {
    this.setData({
      ImageShow: true
    })
  },
  // 关闭支付
  hideModal() {
    this.setData({
      ImageShow: false,
      arrow: false,
      guanyuShow: false
    })
  },
  // 打开意见反馈
  arrowShow() {
    this.setData({
      arrow: true
    })
  },
  // 关于我们
  guanyuClick() {
    this.setData({
      guanyuShow: true
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
        that.db.collection('userInfo').get({
          success: function(res) {
            // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
            console.log(res)

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
  // 复制GitHub
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
// 授权
  userinfo(){
    var that = this
    wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
         
            wx.navigateTo({
              url: '/pages/login/login',
            })
      }else{
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
     } })
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
    var that = this
    wx.getStorage({
      key: 'info',
      success:function(res){
        that.setData({
          info:res.data
        })
        that.setData({
          isShow:true
        })
        console.log(res,"成功")
      },fail:function(err){
        that.setData({
          isShow:false
        })
        console.log(err,"没有用户民")
      }
    })
    wx.getStorage({
      key: 'name',
      success: function (res) {
        if (res.data.length <= 2) {
          that.setData({
            userName: res.data
          })
        } else {
          that.setData({
            userName: res.data.slice(0, 2) + '...'
          })
        }
        wx.showShareMenu({
          withShareTicket: true
        })
        const ctx = wx.createCanvasContext('cv-pic')
        var bgPath = '../../images/timg.jpg'
        // var portraitPath = that.data.portrait_temp
        var hostNickname = that.data.userName

        var qrPath = '../../images/qcue.jpg'
        var windowWidth = 500
        that.setData({
          scale: 1.6
        })
        //绘制背景图片
        ctx.drawImage(bgPath, 0, 0, windowWidth, that.data.scale * windowWidth)

        //绘制头像
        ctx.save()
        ctx.beginPath()
        // ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
        ctx.clip()
        // ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
        ctx.restore()
        //绘制第一段文本
        ctx.setFillStyle('red')
        ctx.setFontSize(0.037 * windowWidth)
        ctx.setTextAlign('center')
        ctx.fillText(hostNickname + ' 正在挑战前端100', windowWidth / 2, 0.45 * windowWidth)
        //绘制第二段文本
        ctx.setFillStyle('#000')
        ctx.setFontSize(0.037 * windowWidth)
        ctx.setTextAlign('center')
        ctx.fillText('快来一起涨知识啦~', windowWidth / 2, 0.5 * windowWidth)
        //绘制二维码
        ctx.drawImage(qrPath, 0.5 * windowWidth / 2, 0.7 * windowWidth, 0.27 * windowWidth, 0.27* windowWidth)
        //绘制第三段文本
        ctx.setFillStyle('#333')
        ctx.setFontSize(0.045 * windowWidth)
        ctx.setTextAlign('center')
        ctx.fillText('长按识别二维码', windowWidth / 2, 0.60 * windowWidth)
        ctx.draw();
      },
      fail: err => {
      that.setData({
        isShow:false
      })
       console.log(err)
      }
    })
  },
  // 分享
  fenxiang() {
    var that = this
    if(!that.data.isShow){
      console.log(1)
      that.userinfo()
    }else{
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.windowWidth,
      height: that.data.windowWidth * that.data.scale,
      destWidth: that.data.windowWidth * 4,
      destHeight: that.data.windowWidth * 4 * that.data.scale,
      canvasId: 'cv-pic',
      success: function(res) {
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
        that.setData({
          url: res.tempFilePath
        })
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
        wx.getSetting({
          success(res) {
            console.log('授权成功',res)
            if (!res.authSetting['scope.writePhotosAlbum']) { //判断权限
              wx.authorize({ //获取权限
                scope: 'scope.writePhotosAlbum',
                success() {
                  console.log('授权成功')
                  // that.saveImg()
                  //转化路径
                }
              })
            } else {
              // that.saveImg()
            }
          }
        })
      },
      fail: function(err) {
        console.log('失败')
        console.log(err)
      }
    })
  }
  },
  saveImg(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.url,
      success: function (data) {
        wx.showToast({
          title: '保存到系统相册成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("当初用户拒绝，再次发起授权")
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting['scope.writePhotosAlbum']) {
                console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
              } else {
                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
              }
            }
          })
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
      },
      complete(res) {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      ImageShow: false,
      arrow: false,
      guanyuShow: false
    })
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
    return {
      title: '是男人就做100分,前端奥利给！',
      path: '/pages/login/login',
      imageUrl: '../../images/zhuanfa.png' //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  }
})