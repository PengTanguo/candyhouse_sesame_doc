---
# toc: content
group: ドキュメント
title: Android SDK
order: 4
---


<!-- ![img](./doc/img/SesameSDK_20231201.png) -->
# Ja SesameSDK3.0 for Android

- Sesame app on <img src="https://img.shields.io/badge/Play Store-34A853?logo=googleplay&logoColor=white"/> [https://play.google.com/store/apps/details?id=co.candyhouse.sesame2](https://play.google.com/store/apps/details?id=co.candyhouse.sesame2)
- Sesame app on <img src="https://img.shields.io/badge/Google Drive-1A73E8?logo=googledrive&logoColor=white"/> [https://drive.google.com/file/d/15aRQl6aWBVwJSE4l3ZL-eMisPoe-f2lW/](https://drive.google.com/file/d/15aRQl6aWBVwJSE4l3ZL-eMisPoe-f2lW/)



#### Sesame SDK OS3プロジェクトはSesame 5、Sesame 5 Pro、Sesame Bike2、Sesame BLE Connector1、Sesame Open Sensor、Sesame Touch 1に関連しています。Pro、Sesame Touch 1、WIFI Module2などのハードウェアをbluetoothで接続します。Androidのモバイルアプリでスマートにハードウェアを操作できるようにします。ゴマロボット1、ゴマ3、ゴマ4、ゴマ自転車の場合です


 ## Androidインストール要件です

* <img src="https://img.shields.io/badge/Kotlin-1.4-7F52FF" />.  
* <img src="https://img.shields.io/badge/Bluetooth-4.0LE +-0082FC" />  
* <img src="https://img.shields.io/badge/Android-5.0 +-3DDC84" />  
* <img src="https://img.shields.io/badge/Android Studio-2022 +-3DDC84" />  

## インストールプロセスです

### 1.インストール依存症です

```swift
   implementation project(':sesame-sdk')
```

### 2.manifest.xmlでAndroidの権限を設定します。

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
### 3.初期化です
```jsx {5} | pure

   override fun onCreate() 
   {
    super.onCreate()
    CHBleManager(this)
    }
```
CHBleManagerの初期化は、端末のbluetoothが正常に動作しているか、端末から権限を取得しているか、bluetoothが起動しているかを判定します。全てが正常ならbluetoothスキャンを開始します
Bluetooth Service Uuid:0000FD81-0000-1000-8000-00805f9b34fb

```jsx {5} | pure
 bluetoothAdapter.bluetoothLeScanner.startScan(
 mutableListOf(ScanFilter.Builder().setServiceUuid(ParcelUuid(UUID.fromString("0000FD81-0000-1000-8000-00805f9b34fb"))).build()), ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build(), bleScanner)
```
bleScannerでスキャンしたデバイスをCHDeviceMapに入れます

### 4.新しいデバイスはScanNewDeviceFGオブジェクトに追加され、AdapterはCHDeviceMapフィルタリングされます(it.rssi!=空)でデータをリスト表示します。

```jsx {5} | pure
    private var mDeviceList = ArrayList<CHDevices>()
    CHBleManager.delegate = object : CHBleManagerDelegate {
            override fun didDiscoverUnRegisteredCHDevices(devices: List<CHDevices>) {
                mDeviceList.clear()
                mDeviceList.addAll(devices.filter { it.rssi != null }
                    .filter { it.rssi!! > -65 }///登録リストは距離が近いものだけ表示されます。
                )
                mDeviceList.sortBy { it.getDistance() }
                mDeviceList.firstOrNull()?.connect { }
                leaderboard_list.post((leaderboard_list.adapter as GenericAdapter<*>)::notifyDataSetChanged)
            }
        }
    }
```
### 5.機器との接続手順はconnectを実行し、onBleDeviceStatusChangedで機器の状態を監視します。

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
           // ログインできました
       }
       it.onFailure {
          //  ログインに失敗しました
           }
       }
   }
```
### 6. device.register登録コマンドのコールバック成功または失敗により、属する製品のdevice modelを判定することができます。

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

## Androidプロジェクトの構成例です

<!-- ![SesameOs3](./other/SesameOs3.png) -->
以下はコードとリソースファイルを作成するためのAndroidプロジェクトの構成例です。

- `libs/`:フォルダは通常、第三者ライブラリ(。jar、。aarなど)のバイナリファイルを保存するのに使われます。
- `java/`: javaコードを保存します。例えば`activities/`は活働類を格納し、`adapters/`はアダプタ類を格納します。
- `res/`:レイアウトファイル、文字列、アイコンなどのリソースファイルを格納します。例えば`layout/`はレイアウトファイルを、`drawable/`はグラフィックリソースを、`values/`は文字列とスタイルリソースを格納します。
- `build.gradle`:依存項目、プラグイン、ビルド設定を設定するアプリケーションレベルのgradleプロファイルです。
- `proguard-rules.pro`:コード混乱と最適化のためのproguardプロファイルです。これはオプションで、リリース時に適用されます。

## Sesameプロジェクトフレームワークです

* 登録します:[Amazon Web Services](https://docs.amplify.aws/sdk/auth/getting-started/q/platform/android/)(Mobile)  
* 権限の枠組みです:[Easypermissions](https://github.com/googlesamples/easypermissions) 
* ローカルデータベースの永続化です:[Room](https://developer.android.com/training/data-storage/room?hl=zh-cn) 
* クラウドデータホストです:[Amazon Web Services](https://docs.aws.amazon.com/iot/latest/developerguide/iot-sdks.html) (IOT)  
* インターフェイスナビゲーションです:[Navigation ](https://developer.android.com/guide/navigation?hl=zh-cn)   
* インタフェースデータ管理です:[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel?hl=zh-cn)   
* ファームウェアアップデートライブラリです:[Dfu](https://github.com/NordicSemiconductor/Android-DFU-Library)   
* 地図セットです:[Maps for Google](https://developers.google.com/maps/documentation/android-sdk/release-notes)   
* ローカルストレージです:[Preference](https://developer.android.com/jetpack/androidx/releases/preference?hl=zh-cn)   
* 応答型フレームワーク:[Rxjava](https://github.com/ReactiveX/RxJava)   
* QR Scan:依赖libs/qrcodecore\-release.aar&nbsp;&nbsp;&nbsp;[Zxing](https://mvnrepository.com/artifact/com.google.zxing/core)  
* メッセージ伝達です:[Firebase-messaging](https://firebase.google.com/docs/cloud-messaging/android/client?hl=zh-cn)
#### コンポーネントライブラリです:
* プルダウンリフレッシュです:  [Swiperefreshlayout](https://developer.android.com/jetpack/androidx/releases/swiperefreshlayout?hl=zh-cn) 
* Recyclerview 頭部貼り付けです:[StickyHeaders](https://github.com/ShamylZakariya/StickyHeaders) 
* EditText適応性です:[AutoResizeEditText](https://github.com/victorminerva/AutoResizeEditText) 
* ローテーションキャスト図です:[LoopView](https://github.com/AWarmHug/androidWheelView) 
* スライドバー庫です:[Indicatorseekbar](https://github.com/warkiz/IndicatorSeekBar) 

## App界面对象说明  

**SesameApp:** Applicationプロセスが起動します。
**MainActivity:**メインアプリケーションインターフェースです。
**ScanQRcodeFG:** qrコードです
**ScanNewDeviceFG:**新しいデバイスを追加します。
**WM2SettingFG:** WIFI Module設定画面です。
**SSM2SetAngleFG:** SS4、SS2角度設定インターフェースです。
**SSM5SettingFG:** SS5、SS5PRO設定インターフェースです。
**SSM2SettingFG:** SS4、SS2設定画面です。
** sesamebosettingfg:** SesameBot1設定インターフェースです。
**SesameBikeSettingFG:** BiKeLock1、BiKeLock2はインターフェースを設定します。
**SesameKeyboardSettingFG:** Sesame5設定インターフェースです。
* * sesameopensensornoblesettingfg: * * ssmopensensor設置インタフェース
**SesameTouchProSettingFG:** SSMTouchPro、SSMTouch、BLEConnector設定インターフェースです。
**SesameKeyboardCards:** NFCカード設定インターフェースです。
**SSMTouchProFingerprint:**指紋設定インターフェースです。
**SesameKeyboardPassCode:**数字パスワード設定インターフェースです。
* * ssmtouchproselectlockerlistfg: * * ssmtouchpro設備の分かち合いのインタフェース
**GuestKeyListFG:**ゲストリストインターフェースです。
**SSM2NoHandLockFG:**全自動施錠インターフェイスです
**MeFG:**トップページです-&gt;私のインターフェースです
**MyQrCodeFG:**トップページです-&gt;私のインターフェイス-&gt;私のqrコードです
**LoginMailFG:**トップページです-&gt;私のインターフェイス-&gt;登録画面です
**LoginVerifiCodeFG:**トップページです-&gt;私のインターフェイス-&gt;インターフェースを登録します-&gt;qrコードチェック画面です
**FriendListFG:**トップページです-&gt;アドレス帳の画面です
**FriendDetailFG:**トップページです-&gt;アドレス帳のインターフェース-&gtです;友達詳細画面です
* * friendselectlockerlistfg: * *トップページ—& gt;アドレス帳のインターフェース-&gtです;インターフェイスの詳細-&gtの親友です;インターフェースを共有します
DeviceListFG:トップページです-&gt;ゴマのリスト画面です
**MainRoomFG:**トップページです-&gt;ゴマのリストのインターフェイス-&gt;SS4、SS2の機器詳細履歴です
**MainRoomSS5FG:**トップページです-&gt;ゴマのリストのインターフェイス-&gt;SS5、SS5PRO機器詳細履歴記録です
**AddMemberFG:**トップページ-&gtです;ゴマのリストのインターフェイス-&gt;メンバーシップを追加します
**KeyQrCodeFG:**トップページです-&gt;ゴマのリストのインターフェイス-&gt;二次元コードを共有します
**WM2ScanSSIDListFG:**トップページ-&gtです;ゴマのリストのインターフェイス-&gt;WIFIの詳細-&gtです;WIFIスキャニングリストの画面です
**WM2SelectLockerListFG:**トップページ-&gtです;ゴマのリストのインターフェイス-&gt;WIFIの詳細-&gtです;ごまデバイスの画面を選択します


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

1. [Class対象解説です](/doc/sesame_code_cls)
2. [ファームウェアアップデートです](/doc/bleprotocol/firewareUpgradation)
3. [ブルートゥース接続です](/doc/bleprotocol/BleConnect)
4. [NFC接続します](/doc/bleprotocol/nfcconnect)

## Android関連知識です
- [android ble] (https://developer.android.com/guide/topics/connectivity/bluetooth-le?hl=zh-cn)
- [android nfc] (https://developer.android.com/guide/topics/connectivity/nfc?hl=zh-cn)
- [android jetpack] (https://developer.android.com/jetpack?hl=zh-cn)


