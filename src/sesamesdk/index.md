---
# toc: content
group: 软件文档
title: iOS SDK
order: 4
---

# iOS SesameSDK集成安装流程



## iOS平台安装要求

* <img src="https://img.shields.io/badge/Swift-5.3-FA7343" />
* <img src="https://img.shields.io/badge/Bluetooth-4.0LE +-0082FC" />
* <img src="https://img.shields.io/badge/iOS-12.0 +-000000" /> <img src="https://img.shields.io/badge/macOS-10.15 +-000000" /> <img src="https://img.shields.io/badge/watchOS-7.0 +-000000" />  <img src="https://img.shields.io/badge/iPadOS-12.0 +-000000" />
* <img src="https://img.shields.io/badge/Xcode-11.0 +-1575F9" />

## 集成安装流程


### 1.安装依赖

#### SesameSDK
* 1. Scheme 切到 **SesameSDK**, 選擇 Any iOS Device
* 2. `command` + `shift` + `k` 清除 product 資料夾
* 3. `command` + `b` 打包 SDK
* 4. 完成後到 Xcode -> SDK project -> `Products` 資料夾底下 找到 SesameSDK.framework 點擊右鍵 選擇在 Finder 打開, 取得 `SesameSDK.framework`.

#### SesameWatchKitSDK
* 1. Scheme 切到 **SesameWatchKitSDK**, 選擇 Any watch OS Device
* 2. `command` + `shift` + `k` 清除 product 資料夾
* 3. `command` + `b` 打包 SDK
* 4. 完成後到 Xcode -> SDK project -> `Products` 資料夾底下 找到 SesameWatchKitSDK.framework 點擊右鍵 選擇在 Finder 打開, 取得 `SesameWatchKitSDK.framework`.



#### Swift Package
[Swift Package Manager](https://www.swift.org/package-manager/) 是一个管理Swift代码分发的工具。它与Swift构建系统集成，自动执行下载、编译和链接依赖项的过程。
使用Swift包管理器将SesameSDK集成到Xcode项目中:

```
dependencies: [
    .package(url: "https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp.git", .branch("master"))
]
```
![img](https://raw.githubusercontent.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/master/doc/src/resources/spm.png)

#### 手动

If you don't want to use any dependency manager, you can manually integrate SesameSDK into your project.
![img](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/manually.png)

### 2.添加授权
```jsx {5} | pure
<key>NSBluetoothAlwaysUsageDescription</key>
<string>To connect Sesame Smart Lock and lock/unlock the door.</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app would like to make data available to nearby bluetooth devices even when you're not using the app.</string>
```

### 3.初始化
请在适当的时间启动蓝牙扫描

```jsx {5} | pure
CHBluetoothCenter.shared.enableScan { res in }
```
蓝牙状态改变时回调

```jsx {5} | pure
public protocol CHBleStatusDelegate: AnyObject {
    func didScanChange(status: CHScanStatus)
}
```
扫描的芝麻设备列表将以每秒一次的频率传回呼叫者。

```jsx {5} | pure
public protocol CHBleManagerDelegate: AnyObject {
    func didDiscoverUnRegisteredCHDevices(_ devices: [CHDevice])
}

```
### 4.连接设备
在建立连接之前，应首先确认设备状态为可连接状态

```jsx {5} | pure
if sesame5.deviceStatus == .receivedBle() {
    sesame5.connect() { _ in }
}
```
此时，您将收到Sesame设备的连接状态回调

```jsx {5} | pure
public protocol CHDeviceStatusDelegate: AnyObject {
    func onBleDeviceStatusChanged(device: CHDevice, status: CHDeviceStatus, shadowStatus: CHDeviceStatus?)
    func onMechStatus(device: CHDevice)
}
```
### 5.注册设备
当连接状态变为“准备注册”时，即可注册设备完成配对。注册是绑定设备的必要步骤

```jsx {5} | pure
if device.deviceStatus == .readyToRegister() {
    device.register( _ in )
}
```
注册完成后，您可以通过CHDeviceManager获取已配对的设备

```jsx {5} | pure
var chDevices = [CHDevice]()
CHDeviceManager.shared.getCHDevices { result in
    if case let .success(devices) = result {
        chDevices = devices.data
    }
}
```
完成注册和配对后，您就可以通过蓝牙控制Sesame设备了

### 6.查看更多详情
关于SesameSDK的设计细节，请参考以下设计图和流程图。


## iOS 项目结构示例



## Sesame项目框架

* 注册登录:[Amazon Web Services](https://docs.amplify.aws/sdk/auth/getting-started/q/platform/android/)

* 藍芽: [CoreBluetooth](https://developer.apple.com/documentation/corebluetooth/)

* 本地存儲: [CoreData](https://developer.apple.com/documentation/coredata)

* 使用庫為: [AWSMobileClientXCF](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSMobileClient/index.html)

* Siri Intents:[Intents](https://developer.apple.com/documentation/appintents) 
* 參考文章:[appintents](https://medium.com/simform-engineering/how-to-integrate-siri-shortcuts-and-design-custom-v-tutorial-e53285b550cf)


* 手機通知[User Notifications](https://developer.apple.com/documentation/usernotifications)

## App界面对象说明  


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

<!-- 3. [选用框架相关示例](./bleproduct/meframeword.md) -->
1. [Class对象讲解](/doc/sesame_code_cls)
2. [固件升级](/doc/bleproduct/firewareUpgradation)
3. [蓝牙连接](/doc/bleproduct/BleConnect)
4. [NFC连接](/doc/bleproduct/nfcconnect)
5. [传输加密](/doc/cls/SesameOS3BleCipher)
6. [Ble注册](/doc/other/register)
7. [Ble登录](/doc/other/login)


## 蓝牙状态转换流程图
![BleConnect](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/ref/BleConnect.svg)

#### Framework
![framework_diagram](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/framework_diagram.png)


### 序列图
![Sequence_diagram](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/sequence_diagram.svg)

### 类图
![Class_diagram](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/class_diagram.svg)
