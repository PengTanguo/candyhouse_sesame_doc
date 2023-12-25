---
# toc: content
group: ドキュメント
title: 制御プロトコルです
order: 7
---


携帯電話とSesameのコミュニケーションには2つの方法があります。1つ目はPublishで、Sesameが携帯電話にサブスクリプションメッセージを送信します。例えば`8_mechStatus`です。第2種はResponse、携帯電話はSesame仕事をして、Sesame返事、例えば`82_lock`です。

# Application layer 指令対照表です


## Publish【Sesame->Mobile】

NotifyValue=Trueの時に使用します。，Sesame 携帯電話にメッセージを送ります，です `81_mechStatus`。

| Byte |   0  |      1     |  2 \~ N |
| ---- | :--: | :--------: | :-----: |
| Data | type | item_code | payload |
| 説明します   | プッシュ型です |    指令番号です    | 携帯に送った資料です |

```c
#pragma pack(1)
typedef struct {
    uint8_t type;               /// プッシュ型です : publish
    uint8_t item_code;          /// 指令です(詳見 item_details)
    union ss5_payload payload;  /// 携帯に送った資料です
} ss5_publish;
#pragma pack()
```

## Request 資料格式

電話はSesame仕事をして、Sesame返事、例えば`82_lock`です。

| Byte    |      0     |     1 ~ N    |   N+    |
| ----    | :--------: | :-----------: | :-----------: |
| Data    | item_code |    payload    |    others    |
| 指令    | 番号     | Sesameさんへの資料です |その他の資料です |
| Reg    |    1    | 1-64【publicKeyA】 | 65-68【timestamp】 |
| Login  |    2    | 1-4【ccmkeyA】 |
| History|    4    | 1【is peek】 | ispeek=true No delete |
| Version|    5    | none |
| Time update|    8    | 1-4【timestamp】 |
| Auto lock|    11    | 1-2【秒数】 |
| megnet  |    17    | none |
| mechSetting   |    80    | 1-5【autolock+Lock Angel】 |
| mechStatus   |    81    | none |
| lock   |    82    | 1-7【History Tag】 |
| unlock   |    83    | 1-7【History Tag】 |
| ops door open   |    90    | none |
| ops door close   |    91    | none |
| ops timmer   |    92    | none |
|  reset   |    104    | none |
| touch add ssm   |    101    | 1-16【Device Name】 | 17-32【secretKey】 |
| touch remove ssm  |    103    | 1-16【Device Name】 |
| touch card change   |    107    | 0【Card ID Len】1-id_len【CardID】 | CardIDLen+1【CardNameLen】etc | 
| touch card delete   |    108    | 1-16【Card ID】 |
| toch card get   |    113    | none |
| card mode set   |    114    | none |
| finger change   |    115    | 0【FingerIDLen】 |1-Len【FingerID】】 |
| finger delete   |    116    | 1【FingerID】 |
| finger get   |    117    | none |
| finger mode get   |    121    | none |
| finger mode set   |    114    | none |
| pw change   |    123    | 0【PwIDlen】 | 1-pwLen【Password】】 |
| pw delete   |    124    | none |
| pw get   |    125    | none |
| pw mode get   |    121    | none |
| pw mode set    |    130    | 0验证1新增 |


### type プッシュ型です

```c
typedef enum {
    SSM2_OP_CODE_RESPONSE = 0x07,
    SSM2_OP_CODE_PUBLISH = 0x08,
} ssm2_op_code_e;
```


```c
#pragma pack(1)
typedef struct {
    uint8_t item_code;              /// 指令(詳しく見ます item_details)
    union ss5_payload payload;      /// Sesame5への資料です
} ss5_request;
#pragma pack()
```

### 3 Response & Publish資料のフォーマットです

| Byte |   0  |      1     |    2   |   3～N   |  2N   | 3N   |
| ---- | :--: | :--------: | :----: | :-----: |:-----: |:-----: |
| Data | type | item_code |   res  | payload |payload |payload |
| 説明します | プッシュ型です |    指令番号    | 命令処里状態です | 携帯への資料1です |携帯への資料2です |携帯への資料3です |
| Init   | 8 |    14    | 0 | 0-3【random code】 | none  |
| Reg    | 7 |     1    | 0 | 0-6【mechStatus】 | 7-12【mechSetting】】 | 13~76【publicKeyS】】 |
| Login  | 7 |    2   | 0 | 0-3【timestamp】 |
| History| 7 |    4    | 0 | 0-3【id】】 | 4【type】 | 5-8【timestamp】 |
| Version| 7 |    5    | 0 | 0-11【version】 |
| mechSetting   | 8 |    80    | 0 | 0-1【lock】 | 2-3【unlock】】 | 4-5【autolock_second】 |
| mechStatus   | 8 |    81    | 0 | 0-3【random code】 |
| touch pub ssm key   | 8 |    102    | 0 | 0-21【ssm0-name】 |22【ssm0-status】 |23-44【ssm1_name】etc |
| toch card get   | 7 |    109    | 0 | 0-3【CardID】 |
| finger get   | 7 |    117    | 0 | 0-3【FingerID】|
| finger mode get   | 8 |    14    | 0 | 0-3【random code】 |
| pw notify   | 8 |    118    | 0 | 0【PW Type】 | 1【PWIDLen】 |



```c
#pragma pack(1)
typedef struct {
    uint8_t type;                   /// プッシュ型です : Response
    uint8_t item_code;              /// 指令(詳しく見ます item_details)
    uint8_t res;                    /// コマンド処理状態です (success)
    union ss5_payload payload;      /// 携帯に送った資料です
} ss5_response;
#pragma pack()
```


### item_code

各コマンドの相互作用の詳細はこちらです `item_details` 説明します。

