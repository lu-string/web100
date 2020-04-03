//app.js

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}



    // // 获取登录授权
    //  // 查看是否授权
    //  wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //           var that = this
    //           wx.login({
    //             success(res) {
    //               console.log(res)
    //               if (res.code) {
    //                 wx.getSetting({
    //                   success(res) {
    //                     if (res.authSetting['scope.userInfo']) {
    //                       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //                       wx.getUserInfo({
    //                         success: function (res) {
                            
    //                           that.setData(res)
    //                         }
    //                       })
    //                     } else {
    //                       console.log('没有授权')
    //                     }
    //                   }
    //                 })
    //               } else {
    //                 console.log('登录失败！' + res.errMsg)
    //               }
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       wx.navigateTo({
    //         url: '/pages/login/login',
    //       })
    //       console.log('没有授权')

    //     }
    //   }
    // })

  }
})
