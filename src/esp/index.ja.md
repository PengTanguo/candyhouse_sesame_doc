---
# toc: content
group: ドキュメント
title: ESP32ドキュメント
order: 3
---

# ESP32制御パラダイムです


# ESP32- 3- devkitm-1 Sesame5スイッチ制御例です

このプロジェクトはesp32-33-devkitm-1マイクロコントローラを使ってSesame5スマートロックを登録し制御する方法を示しています。この例では、ESP-IDF開発フレームワークを使用し、BLE技術を介して自動的に近くのSesame5デバイスを探し、接続し、登録します。esp32-33-devkitm-1がSesame5が解錠位置に達したことを検知すると、自働的に施錠するよう指示を出します。

## 前提条件です
ESP-IDFをインストールする必要があります。ESP-IDFのinstal.shのピンを通して、必要なツールチェーンとアクセサリをインストールすることができます。

## インストールと環境設定です
1. ESP-IDFの「install.sh」でツールチェーンがインストールされていることを確認してください。
2.端末机を開いて、ESP-IDFまでの経路をナビゲートして、そして`export.sh`を実行して環境変数に加入します。
3. esp32-3-devkitm-1をUSBでパソコンに接続します。
4.プロジェクトファイルに戻って、`idf.py flash`を実行してコンパイルして書き込みます。

使い方です。
esp32-33-devkitm-1を録画して再起動すると、近くにある未登録のSesameデバイスを自動的に検索します。接続して登録すると、esp32-33-devkitm-1はSesame5の状態をチェックし、適切なタイミングでロックダウン命令を送信します。

## 特徴と機能です
**自働机器探索**:自働的に近くのSesame5スマートロックを検索して接続します。
- **オートロック**:Sesame5が予め設定された開錠位置に到達すると、esp32-3-devkitm-1が施錠指示を出します。

## 原始碼參考
```c
typedef enum {
    SESAME_5 = 5,
    SESAME_BIKE_2 = 6,
    SESAME_5_PRO = 7,
} candy_product_type;

typedef enum {
    SSM_NOUSE = 0,
    SSM_DISCONNECTED = 1,
    SSM_SCANNING = 2,
    SSM_CONNECTING = 3,
    SSM_CONNECTED = 4,
    SSM_LOGGIN = 5,
    SSM_LOCKED = 6,
    SSM_UNLOCKED = 7,
    SSM_MOVED = 8,
} device_status_t;

typedef enum {
    SSM_OP_CODE_RESPONSE = 0x07,
    SSM_OP_CODE_PUBLISH = 0x08,
} ssm_op_code_e;

typedef enum {
    SSM_ITEM_CODE_NONE = 0,
    SSM_ITEM_CODE_REGISTRATION = 1,
    SSM_ITEM_CODE_LOGIN = 2,
    SSM_ITEM_CODE_USER = 3,
    SSM_ITEM_CODE_HISTORY = 4,
    SSM_ITEM_CODE_VERSION_DETAIL = 5,
    SSM_ITEM_CODE_DISCONNECT_REBOOT_NOW = 6,
    SSM_ITEM_CODE_ENABLE_DFU = 7,
    SSM_ITEM_CODE_TIME = 8,
    SSM_ITEM_CODE_INITIAL = 14,
    SSM_ITEM_CODE_MAGNET = 17,
    SSM_ITEM_CODE_MECH_SETTING = 80,
    SSM_ITEM_CODE_MECH_STATUS = 81,
    SSM_ITEM_CODE_LOCK = 82,
    SSM_ITEM_CODE_UNLOCK = 83,
    SSM2_ITEM_OPS_TIMER_SETTING = 92,
} ssm_item_code_e;
```

## 追加リソースです
- [candy house公式サイトを訪問してください] (https://jp.candyhouse.co/) 多sesame5智能键についての情報を知る。

## ライセンスです
このプロジェクトはMITライセンスを使用しています。詳細は`LICENSE`ファイルを参照されます。