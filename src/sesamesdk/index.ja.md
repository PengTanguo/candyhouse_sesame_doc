---
# toc: content
group: ドキュメント
title: iOS SDK
order: 4
---

# iOS SesameSDKインストールプロセスです



## iOSインストール要件です

* <img src="https://img.shields.io/badge/Swift-5.3-FA7343" />
* <img src="https://img.shields.io/badge/Bluetooth-4.0LE +-0082FC" />
* <img src="https://img.shields.io/badge/iOS-12.0 +-000000" /> <img src="https://img.shields.io/badge/macOS-10.15 +-000000" /> <img src="https://img.shields.io/badge/watchOS-7.0 +-000000" />  <img src="https://img.shields.io/badge/iPadOS-12.0 +-000000" />
* <img src="https://img.shields.io/badge/Xcode-11.0 +-1575F9" />


### 1.インストール依存症です

#### SesameSDK
* 1. Scheme 切ります **SesameSDK**, 選択します Any iOS Device
* 2. `command` + `shift` + `k` 一掃します product ファイルファイルです
* 3. `command` + `b` 梱包します SDK
* 4. 完成しましたら Xcode -> SDK project -> `Products` ファイルの下から見つけました SesameSDK.framework 右クリックです 選択します Finder 開けます, 取得します `SesameSDK.framework`.

#### SesameWatchKitSDK
* 1. Scheme 切ります **SesameWatchKitSDK**, 選択します Any watch OS Device
* 2. `command` + `shift` + `k` 一掃します product ファイルファイルです
* 3. `command` + `b` 打包 SDK
* 4. 完成しましたら Xcode -> SDK project -> `Products` ファイルの下です 找到 SesameWatchKitSDK.framework 點擊右鍵 選擇在 Finder 打開, 取得 `SesameWatchKitSDK.framework`.



#### Swift Package
[Swift Package Manager](https://www.swift.org/package-manager/) Swiftのコード配信を管理するツールです。Swift構築システムと統合され、依存項目のダウンロード、コンパイル、リンクが自動的に実行されます。
Swiftパッケージマネージャを使ってSesameSDKをXcodeプロジェクトに統合します。

```
dependencies: [
    .package(url: "https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp.git", .branch("master"))
]
```
![img](https://raw.githubusercontent.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/master/doc/src/resources/spm.png)

#### 手動です

If you don't want to use any dependency manager, you can manually integrate SesameSDK into your project.
![img](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/manually.png)

### 2.ライセンスを追加します。
```jsx {5} | pure
<key>NSBluetoothAlwaysUsageDescription</key>
<string>To connect Sesame Smart Lock and lock/unlock the door.</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app would like to make data available to nearby bluetooth devices even when you're not using the app.</string>
```

### 3.初期化です
適切なタイミングでブルートゥーススキャンを起動します。

```jsx {5} | pure
CHBluetoothCenter.shared.enableScan { res in }
```
bluetoothの状態が変わったときにコールバックします。

```jsx {5} | pure
public protocol CHBleStatusDelegate: AnyObject {
    func didScanChange(status: CHScanStatus)
}
```
スキャンされたゴマデバイスのリストは、発信者に1秒に1回送信されます。

```jsx {5} | pure
public protocol CHBleManagerDelegate: AnyObject {
    func didDiscoverUnRegisteredCHDevices(_ devices: [CHDevice])
}

```
### 4.機器を接続します
接続を確立する前に、機器の状態が接続可能であることを確認します。


```jsx {5} | pure
if sesame5.deviceStatus == .receivedBle() {
    sesame5.connect() { _ in }
}
```
この時点で、Sesameデバイスの接続ステータスコールを受信します。

```jsx {5} | pure
public protocol CHDeviceStatusDelegate: AnyObject {
    func onBleDeviceStatusChanged(device: CHDevice, status: CHDeviceStatus, shadowStatus: CHDeviceStatus?)
    func onMechStatus(device: CHDevice)
}
```
### 5.登録機器です
接続状態が「登録準備」になると、登録デバイスのペアリングが完了します。登録はデバイスのバインディングに必要な手順です。

```jsx {5} | pure
if device.deviceStatus == .readyToRegister() {
    device.register( _ in )
}
```
登録が完了すれば、CHDeviceManagerでペア化されたデバイスを取得できます。

```jsx {5} | pure
var chDevices = [CHDevice]()
CHDeviceManager.shared.getCHDevices { result in
    if case let .success(devices) = result {
        chDevices = devices.data
    }
}
```
登録とペアリングが完了すると、bluetoothでSesameデバイスを制御できます。

### 6.查看更多详情
SesameSDKの設計詳細につきましては、下記の設計図とフローチャートをご参照ください。

## iOS 项目结构示例



## Sesameプロジェクトフレームワークです

* 登録します:[Amazon Web Services](https://docs.amplify.aws/sdk/auth/getting-started/q/platform/ios/)

* 青い芽です: [CoreBluetooth](https://developer.apple.com/documentation/corebluetooth/)

* ローカルストレージです: [CoreData](https://developer.apple.com/documentation/coredata)

* AWS: [AWSMobileClientXCF](https://aws-amplify.github.io/aws-sdk-ios/docs/reference/AWSMobileClient/index.html)

* Siri Intents:[Intents](https://developer.apple.com/documentation/appintents) 
* 記事を参考にします:[appintents](https://medium.com/simform-engineering/how-to-integrate-siri-shortcuts-and-design-custom-v-tutorial-e53285b550cf)


* 携帯電話の通知です[User Notifications](https://developer.apple.com/documentation/usernotifications)

## Appインタフェースオブジェクトの説明です


## Ble製品コードの解説例の一覧です。

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




##  関連リンク解説です

<!-- 3. [选用框架相关示例](./bleproduct/meframeword.md) -->
1. [Class対象解説です](/doc/sesame_code_cls)
2. [ファームウェアアップデートです](/doc/bleproduct/firewareUpgradation)
3. [ブルートゥース接続です](/doc/bleproduct/BleConnect)
4. [NFC接続です](/doc/bleproduct/nfcconnect)
5. [転送暗号化です](/doc/cls/SesameOS3BleCipher)
6. [Ble登録します](/doc/other/register)
7. [Ble登録](/doc/other/login)


## bluetoothの状態遷移フロー図です
![BleConnect](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/ref/BleConnect.svg)

#### Framework
![framework_diagram](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/framework_diagram.png)


### シーケンス図です
![Sequence_diagram](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/sequence_diagram.svg)

### クラス図です
![Class_diagram](https://github.com/CANDY-HOUSE/SesameSDK_iOS_with_DemoApp/raw/master/doc/src/resources/class_diagram.svg)
