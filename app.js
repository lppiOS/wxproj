//app.js

//const WXAPI = require('apifm-wxapi')
const WXAPI = require('apifm-wxapi')
// WXAPI.init('gooking')
 //const CONFIG = require('../../config.js')
const AUTH = require("utils/auth")

App({
  onLaunch: function () {

    WXAPI.province().then(res => {
      console.log('请在控制台看打印出来的数据：', res)
   })


      const that = this;
      // 检测新版本
      const updateManager = wx.getUpdateManager()
      updateManager.onUpdateReady(function(){
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res){
            if(res.confirm){
              // 新版本已经下载好，调用applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      /**
       * 初次加载判断网络情况
       * 无网络状态下根据实际情况进行调整
       */
      wx.getNetworkType({
        complete: (res) => {
          const networkType = res.networkType
          if(networkType=='none')
          {
            that.globalData.isConnected = false
            wx.showToast({
              title: '当前无网络',
              icon: 'loading',
              duration: 2000
            })
          }
        },
      })

      wx.onNetworkStatusChange((result) => {
        if(!res.isConnected){
          that.globalData.isConnected = false
          wx.showToast({
            title: '网络已断开',
            icon: 'loading',
            duration: '2000'
          })
        }
        else
        {
           that.globalData.isConnected =true
           wx.hideToast({
             complete: (res) => {

             },
           })
        }
      })

      //WXAPI.queryConfigBatch('')





    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})