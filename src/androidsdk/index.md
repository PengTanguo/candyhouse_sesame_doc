---
# toc: content
group: 软件文档
title: Android SDK
order: 4
---


<!-- ![img](./doc/img/SesameSDK_20231201.png) -->
# SesameSDK3.0 for Android

- Sesame app on <img src="https://img.shields.io/badge/Play Store-34A853?logo=googleplay&logoColor=white"/> [https://play.google.com/store/apps/details?id=co.candyhouse.sesame2](https://play.google.com/store/apps/details?id=co.candyhouse.sesame2)
- Sesame app on <img src="https://img.shields.io/badge/Google Drive-1A73E8?logo=googledrive&logoColor=white"/> [https://drive.google.com/file/d/15aRQl6aWBVwJSE4l3ZL-eMisPoe-f2lW/](https://drive.google.com/file/d/15aRQl6aWBVwJSE4l3ZL-eMisPoe-f2lW/)



#### Sesame SDK OS3项目主要涉及Sesame 5、Sesame 5 Pro、Sesame Bike2、Sesame BLE Connector1、Sesame Open Sensor、Sesame Touch 1 Pro、Sesame Touch 1和WIFI Module2等硬件设备的蓝牙连接。它帮助用户通过Android移动应用程序智能操作硬件。如果您的产品是芝麻机器人1、芝麻3、芝麻4或芝麻自行车


 ## Android平台安装要求

* <img src="https://img.shields.io/badge/Kotlin-1.4-7F52FF" />.  
* <img src="https://img.shields.io/badge/Bluetooth-4.0LE +-0082FC" />  
* <img src="https://img.shields.io/badge/Android-5.0 +-3DDC84" />  
* <img src="https://img.shields.io/badge/Android Studio-2022 +-3DDC84" />  

## 集成安装流程

### 1.安装依赖

```swift
   implementation project(':sesame-sdk')
```

### 2.manifest.xml中设置Android权限

```jsx {5} | pure
   
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT " />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
```
### 3.初始化
```jsx {5} | pure

   override fun onCreate() 
   {
    super.onCreate()
    CHBleManager(this)
    }
```
CHBleManager的初始化可以判断终端的蓝牙是否正常运行，是否从终端获得权限，蓝牙是否启动。如果一切正常，蓝牙扫描就开始了。
Bluetooth Service Uuid:0000FD81-0000-1000-8000-00805f9b34fb

```jsx {5} | pure
 bluetoothAdapter.bluetoothLeScanner.startScan(
 mutableListOf(ScanFilter.Builder().setServiceUuid(ParcelUuid(UUID.fromString("0000FD81-0000-1000-8000-00805f9b34fb"))).build()), ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build(), bleScanner)
```
将bleScanner扫描的设备放入CHDeviceMap。

###  4.新设备被添加到ScanNewDeviceFG对象中，Adapter被CHDeviceMap过滤(it.rssi!=空)用列表显示数据。

```jsx {5} | pure
    private var mDeviceList = ArrayList<CHDevices>()
    CHBleManager.delegate = object : CHBleManagerDelegate {
            override fun didDiscoverUnRegisteredCHDevices(devices: List<CHDevices>) {
                mDeviceList.clear()
                mDeviceList.addAll(devices.filter { it.rssi != null }
                    .filter { it.rssi!! > -65 }///註冊列表只顯示距離近的
                )
                mDeviceList.sortBy { it.getDistance() }
                mDeviceList.firstOrNull()?.connect { }
                leaderboard_list.post((leaderboard_list.adapter as GenericAdapter<*>)::notifyDataSetChanged)
            }
        }
    }
```
### 5.与设备的连接顺序是执行connect，用onBleDeviceStatusChanged监视设备的状态。
```jsx {5} | pure

    device.connect { }
    doRegisterDevice(device)
    device.delegate = object : CHDeviceStatusDelegate {
        override fun onBleDeviceStatusChanged(device: CHDevices, status: CHDeviceStatus, shadowStatus: CHDeviceStatus?) {
            if (status == CHDeviceStatus.ReadyToRegister) {
                doRegisterDevice(device)
            }
        }
    }
            
           
   fun  doRegisterDevice(device: CHDevices){
       device.register {
       it.onSuccess {
           // 登録成功
       }
       it.onFailure {
          //  登録失敗
           }
       }
   }
```
###  6.根据device.register注册命令的成功或失败的回调，可以判断所属产品的device model。

```jsx {5} | pure
        (device as? CHWifiModule2)?.let {
            
        }
        (device as? CHSesame2)?.let {
            
        }
        (device as? CHSesame5)?.let {
        
        }
        (device as? CHSesameTouchPro)?.let {
            
        }

```

## Android 项目结构示例

<!-- ![SesameOs3](./other/SesameOs3.png) -->
以下是 Android 项目结构示例，用于组织代码和资源文件。

- `libs/`：文件夹通常用于存放第三方库（libraries）的二进制文件（如.jar、.aar等）。
- `java/`：存放 Java 代码。按照功能模块划分子包，例如 `activities/` 存放活动类，`adapters/` 存放适配器类等。
- `res/`：存放资源文件，包括布局文件、字符串、图标等。按照资源类型分目录存放，例如 `layout/` 存放布局文件，`drawable/` 存放图片资源，`values/` 存放字符串和样式资源。
- `build.gradle`：应用级别的 Gradle 配置文件，用于配置依赖项、插件和构建设置。
- `proguard-rules.pro`：ProGuard 配置文件，用于代码混淆和优化。这是可选的，适用于发布版本时。

## Sesame项目框架

* 注册登录:[Amazon Web Services](https://docs.amplify.aws/sdk/auth/getting-started/q/platform/android/)(Mobile)  
* 权限框架:[Easypermissions](https://github.com/googlesamples/easypermissions) 
* 本地数据库持久化:[Room](https://developer.android.com/training/data-storage/room?hl=zh-cn) 
* 云数据托管:[Amazon Web Services](https://docs.aws.amazon.com/iot/latest/developerguide/iot-sdks.html) (IOT)  
* 界面导航:[Navigation ](https://developer.android.com/guide/navigation?hl=zh-cn)   
* 界面数据管理:[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel?hl=zh-cn)   
* 固件升级库:[Dfu](https://github.com/NordicSemiconductor/Android-DFU-Library)   
* 地图组件:[Maps for Google](https://developers.google.com/maps/documentation/android-sdk/release-notes)   
* 本地存储:[Preference](https://developer.android.com/jetpack/androidx/releases/preference?hl=zh-cn)   
* 响应式框架:[Rxjava](https://github.com/ReactiveX/RxJava)   
* QR扫描:依赖libs/qrcodecore\-release.aar&nbsp;&nbsp;&nbsp;[Zxing](https://mvnrepository.com/artifact/com.google.zxing/core)  
* 消息传递:[Firebase-messaging](https://firebase.google.com/docs/cloud-messaging/android/client?hl=zh-cn)
#### UI组件库:
* 下拉刷新:  [Swiperefreshlayout](https://developer.android.com/jetpack/androidx/releases/swiperefreshlayout?hl=zh-cn) 
* Recyclerview头部粘贴:[StickyHeaders](https://github.com/ShamylZakariya/StickyHeaders) 
* EditText自适应:[AutoResizeEditText](https://github.com/victorminerva/AutoResizeEditText) 
* 轮播图:[LoopView](https://github.com/AWarmHug/androidWheelView) 
* 滑动条库:[Indicatorseekbar](https://github.com/warkiz/IndicatorSeekBar) 

## App界面对象说明  

**SesameApp:** Application进程启动      
**MainActivity:** 主应用程序界面  
**ScanQRcodeFG:** 二维码扫描    
**ScanNewDeviceFG:** 添加新设备    
**WM2SettingFG:** WIFI Module 设置界面    
**SSM2SetAngleFG:** SS4、SS2角度设置界面   
**SSM5SettingFG:** SS5、SS5PRO设置界面    
**SSM2SettingFG:** SS4、SS2设置界面   
**SesameBotSettingFG:** SesameBot1设置界面    
**SesameBikeSettingFG:** BiKeLock1、BiKeLock2设置界面  
**SesameKeyboardSettingFG:** Sesame5设置界面    
**SesameOpenSensorNoBLESettingFG:** SSMOpenSensor设置界面    
**SesameTouchProSettingFG:**  SSMTouchPro、SSMTouch、BLEConnector 设置界面    
**SesameKeyboardCards:** NFC卡片设置界面  
**SSMTouchProFingerprint:** 指纹设置界面  
**SesameKeyboardPassCode:** 数字密码设置界面  
**SSMTouchProSelectLockerListFG:** SSMTouchPro设备分享界面  
**GuestKeyListFG:** 访客列表界面  
**SSM2NoHandLockFG:** 全自动上锁界面  
**MeFG:** 首页->我的界面  
**MyQrCodeFG:** 首页->我的界面->我的二维码界面   
**LoginMailFG:** 首页->我的界面->注册界面  
**LoginVerifiCodeFG:** 首页->我的界面->注册界面->二维码校验界面
**FriendListFG:** 首页->通讯录界面  
**FriendDetailFG:** 首页->通讯录界面->好友详情界面  
**FriendSelectLockerListFG:** 首页->通讯录界面->好友详情界面->共享设备界面
**DeviceListFG:** 首页->芝麻列表界面  
**MainRoomFG:** 首页->芝麻列表界面->SS4、SS2设备详情历史记录  
**MainRoomSS5FG:** 首页->芝麻列表界面->SS5、SS5PRO设备详情历史记录     
**AddMemberFG:** 首页->芝麻列表界面->添加成员界面     
**KeyQrCodeFG:** 首页->芝麻列表界面->分享芝麻二维码QR界面   
**WM2ScanSSIDListFG:** 首页->芝麻列表界面->WIFI详情->WIFI扫面列表界面  
**WM2SelectLockerListFG:** 首页->芝麻列表界面->WIFI详情->选择芝麻设备界面


## Ble产品代码示例讲解列表

-  1. [Sesame 3](/doc/command/sesame4fun)
-  3.  [Sesame 5](/doc/command/sesame5fun) 
-  4. [Sesame 5 Pro ](/doc/command/sesame5fun)    
-  5. [Sesame Bike 1](/doc/command/sesamebike2fun)    
-  6. [Sesame Bike 2](/doc/command/sesamebike2fun)    
-  7. [Sesame Bot 1](/doc/command/sesameblot) 
-  8. [Sesame WiFi Module 2](/doc/command/sesamewifimodule) 
-  9. [Sesame BLE Connector1](/doc/command/sesametouchpro) 
-  10. [Sesame Touch 1 Pro](/doc/command/sesametouchpro)
-  11. [Sesame Open Sensor 1](/doc/command/sesametouchpro)
-  12. [Sesame Touch 1](/doc/command/sesametouchpro)

##  其他相关链接讲解

1. [Class对象讲解](/doc/sesame_code_cls)
2. [固件升级](/doc/bleprotocol/firewareUpgradation)
3. [蓝牙连接](/doc/bleprotocol/BleConnect)
4. [NFC连接](/doc/bleprotocol/nfcconnect)

## Android相关知识
- [android ble] (https://developer.android.com/guide/topics/connectivity/bluetooth-le?hl=zh-cn)
- [android nfc] (https://developer.android.com/guide/topics/connectivity/nfc?hl=zh-cn)
- [android jetpack] (https://developer.android.com/jetpack?hl=zh-cn)


