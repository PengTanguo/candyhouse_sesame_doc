---
# toc: content
group: ドキュメント
title: Web API
order: 7
---

# APIインタフェース文書です

## 方法です

*   orderWithType
*   パラメータです：【オペレーティング・エニュメレーション】
*   回参します： Block戻します feedBack



## 1、デバイスの影を取ります【CHIoTManager】

* 方法です：getCHDeviceShadow
* パラメータです：deviceId
* ネットワーク要求です get, /device/v1/sesame2


```c
       func getCHDeviceShadow(_ sesameLock: CHSesameLock, onResponse: (CHResult<CHDeviceShadow>)? = nil) {
        func getShadow() {
            CHAccountManager.shared.API(request: .init(.get, "/device/v1/sesame2/\(sesameLock.deviceId.uuidString)")) { apiResult in
                switch apiResult {
                case .success(let data):
                    L.d("⌚️ API getShadow ok",data)

                    if let shadow = CHDeviceShadow.fromRESTFulData(data!) {
                        onResponse?(.success(.init(input: shadow)))
                    }
                case .failure(let error):
                    L.d("⌚️ API error",error )
                    onResponse?(.failure(error))
                }
            }
        }
        getShadow()
    }
```
## 2、wifi moudle2にメッセージを送ります

方法です：sendCommandToWM2
パラメータです：cmd history sign
ネットワーク要求です post, /device/v1/iot/sesame2/deviceId


```c
    let parameter = [
        "cmd": command.rawValue,
        "history": keyData.historyTag!.base64EncodedString(),
            "sign": keyCheck[0...3].toHexString()
    ] as [String : Any]

    func sendCommandToWM2(_ command: SesameItemCode, _ device: CHDevice, onResponse: @escaping (CHResult<CHEmpty>)) {
        guard let keyData = device.getKey() else {
            return
        }
        if keyData.historyTag == nil {
            keyData.historyTag = Data()
        }
        var data = command.rawValue.data
        data += device.deviceId.uuidString.data(using: .utf8)!
        data += Data.createOS2Histag(keyData.historyTag)
        var timestamp: UInt32 = UInt32(Date().timeIntervalSince1970)
        let timestampData = Data(bytes: &timestamp,
                                 count: MemoryLayout.size(ofValue: timestamp))
        let randomTag = Data(timestampData.arrayOfBytes()[1...3])

        let keyCheck = CC.CMAC.AESCMAC(randomTag,
                                       key: keyData.secretKey.hexStringtoData())
        data = keyCheck[0...3] + data
        let parameter = [
            "cmd": command.rawValue,
            "history": keyData.historyTag!.base64EncodedString(),
            "sign": keyCheck[0...3].toHexString()
        ] as [String : Any]
        
        CHAccountManager.shared.API(request: .init(.post, "/device/v1/iot/sesame2/\(device.deviceId.uuidString)",
                                                   parameter)) { apiResult in
            if case let .failure(error) = apiResult {
                onResponse(.failure(error))
            } else {
                onResponse(.success(.init(input: .init())))
            }
        }

    }

```

## 3、登録サイクルロックです【CHSesameBikeDevice+Register】

* 方法です：onRegisterStage1
* パラメータです：[ak:publicKey,sessionToken,e:er,t:bikelock.rawValue]
* ネットワーク要求です post, /device/v1/sesame2/deviceId


```
[
            "s1": [
                "ak": (Data(appKeyPair.publicKey).base64EncodedString()),
                "n": bikeLockSessionToken!.base64EncodedString(),
                "e": er,
                "t": CHProductModel.bikeLock.rawValue
            ]
            ]
```

```
    func onRegisterStage1(er: String, result: @escaping CHResult<CHEmpty>) {

        L.d("[bike][register]onRegisterStage1")

        let request = CHAPICallObject(.post, "/device/v1/sesame2/\(self.deviceId.uuidString)", [
            "s1": [
                "ak": (Data(appKeyPair.publicKey).base64EncodedString()),
                "n": bikeLockSessionToken!.base64EncodedString(),
                "e": er,
                "t": CHProductModel.bikeLock.rawValue
            ]
            ]
        )
        
        CHAccountManager
            .shared
            .API(request: request) { response in
                switch response {
                case .success(let data):
                    L.d("[bike][request]success")

                    guard let data = data else {
                        result(.failure(NSError.noContent))
                        return
                    }
                    // todo kill this parcer with json decoder
                    if let dict = try? data.decodeJsonDictionary() as? [String: String],
//                        let b64PayloadTime = dict["r"],
//                        let timePayload = Data(base64Encoded: b64PayloadTime) ,
                        let b64Sig1 = dict["sig1"],
                        let b64ServerToken = dict["st"],
                        let b64SesamePublicKey = dict["pubkey"],
                        let sig1 = Data(base64Encoded: b64Sig1),
                        let serverToken = Data(base64Encoded: b64ServerToken),
                        let sesamePublicKey = Data(base64Encoded: b64SesamePublicKey) {
                        
                        self.deviceStatus = .registering()
                        
                        self.onRegisterStage2(
                            appKey: self.appKeyPair,
                            sig1: sig1,
                            serverToken: serverToken,
                            sesame2PublicKey: sesamePublicKey,
                            result: result
                        )
                    } else {
                        result(.failure(NSError.parseError))
                        self.deviceStatus = .readyToRegister()
                    }
                case .failure(let error):
                    result(.failure(error))
                }
        }
    }
```

## 4、アップロード履歴です【CHSesameDevice+History】

* 方法です：postProcessHistory
* パラメータです：[ s:deviceId, v:historyData ]
* ネットワーク要求です post, /device/v1/sesame2/historys


```
    func postProcessHistory(_ historyData: Data) {
        let request: CHAPICallObject = .init(.post, "/device/v1/sesame2/historys", [
            "s": self.deviceId.uuidString,
            "v": historyData.toHexString()
        ])
        
        CHAccountManager
            .shared
            .API(request: request) { result in
                switch result {
                case .success(_): break
                    
                case .failure(let error):
                    L.d("上傳歷史失敗,掉歷史  : \(error)")
                }
            }
    }
```


## 5、登録しますSesameBot【CHSesameBotDevice+Register】

* 方法です：onRegisterStage1
* パラメータです：[ak:publicKey,sessionToken,e:er,t:bikelock.rawValue]
* ネットワーク要求です post, /device/v1/sesame2/deviceId

```
func onRegisterStage1(er: String, result: @escaping CHResult<CHEmpty>) {

        let request = CHAPICallObject(.post, "/device/v1/sesame2/\(self.deviceId.uuidString)", [
            "s1": [
                "ak": (Data(appKeyPair.publicKey).base64EncodedString()),
                "n": self.sesameBotSessionToken!.base64EncodedString(),
                "e": er,
                "t": CHProductModel.sesameBot.rawValue
            ]
        ]
        )
        
        CHAccountManager
            .shared
            .API(request: request) { response in
                switch response {
                case .success(let data):
                    
                    guard let data = data else {
                        result(.failure(NSError.noContent))
                        return
                    }
                    // todo kill this parcer with json decoder
                    if let dict = try? data.decodeJsonDictionary() as? [String: String],
                       let b64Sig1 = dict["sig1"],
                       let b64ServerToken = dict["st"],
                       let b64SesamePublicKey = dict["pubkey"],
                       let sig1 = Data(base64Encoded: b64Sig1),
                       let serverToken = Data(base64Encoded: b64ServerToken),
                       let sesamePublicKey = Data(base64Encoded: b64SesamePublicKey) {
                        
                        self.deviceStatus = .registering()
                        
                        self.onRegisterStage2(
                            appKey: self.appKeyPair,
                            sig1: sig1,
                            serverToken: serverToken,
                            sesame2PublicKey: sesamePublicKey,
                            result: result
                        )
                    } else {
                        result(.failure(NSError.parseError))
                        self.deviceStatus = .readyToRegister()
                    }
                case .failure(let error):
                    result(.failure(error))
                }
            }
    }

```

## 6、登録しますSesame2Device【CHSesame2Device+Register】

* 方法です：onRegisterStage1
* パラメータです：[ak:publicKey,sessionToken,e:er,t:bikelock.rawValue]
* ネットワーク要求です post, /device/v1/sesame2/deviceId

```c
        let request = CHAPICallObject(.post, "/device/v1/sesame2/\(self.deviceId.uuidString)", [
            "s1": [
                "ak": (Data(appKeyPair.publicKey).base64EncodedString()),
                "n": self.sesameBotSessionToken!.base64EncodedString(),
                "e": er,
                "t": CHProductModel.sesameBot.rawValue
            ]
        ]
        )
```

```c
    func onRegisterStage1(er: String, result: @escaping CHResult<CHEmpty>) {

        let request = CHAPICallObject(.post, "/device/v1/sesame2/\(self.deviceId.uuidString)", [
            "s1": [
                "ak": (Data(appKeyPair.publicKey).base64EncodedString()),
                "n": self.sesameBotSessionToken!.base64EncodedString(),
                "e": er,
                "t": CHProductModel.sesameBot.rawValue
            ]
        ]
        )
        
        CHAccountManager
            .shared
            .API(request: request) { response in
                switch response {
                case .success(let data):
                    
                    guard let data = data else {
                        result(.failure(NSError.noContent))
                        return
                    }
                    // todo kill this parcer with json decoder
                    if let dict = try? data.decodeJsonDictionary() as? [String: String],
                       let b64Sig1 = dict["sig1"],
                       let b64ServerToken = dict["st"],
                       let b64SesamePublicKey = dict["pubkey"],
                       let sig1 = Data(base64Encoded: b64Sig1),
                       let serverToken = Data(base64Encoded: b64ServerToken),
                       let sesamePublicKey = Data(base64Encoded: b64SesamePublicKey) {
                        
                        self.deviceStatus = .registering()
                        
                        self.onRegisterStage2(
                            appKey: self.appKeyPair,
                            sig1: sig1,
                            serverToken: serverToken,
                            sesame2PublicKey: sesamePublicKey,
                            result: result
                        )
                    } else {
                        result(.failure(NSError.parseError))
                        self.deviceStatus = .readyToRegister()
                    }
                case .failure(let error):
                    result(.failure(error))
                }
            }
    }
```



## 7、非同期時間を取得します【CHSesame2Device+Login】

* 方法です：requestSyncTime
* パラメータです：[st:sessionToken]
* ネットワーク要求です post, device/v1/sesame2/deviceId/time


```c
            let reqBody: NSDictionary = [
                "st": sessionToken.base64EncodedString()
            ]

    func requestSyncTime( _ result: @escaping CHResult<Any>) {
        if let sessionToken = self.cipher?.sessionToken {
            let reqBody: NSDictionary = [
                "st": sessionToken.base64EncodedString()
            ]
            
            CHAccountManager
                .shared
                .API(request: .init(.post, "/device/v1/sesame2/\(deviceId.uuidString)/time", reqBody)) { response in
                    switch response {
                    case .success(let data):
                        guard let data = data else {
                            L.d("🕒", NSError.noContent)
                            return
                        }
                        // todo kill this parcer
                        guard let dict = try? data.decodeJsonDictionary() as? NSDictionary,
                              let b64Payload = dict["r"] as? String,
                              let payload = Data(base64Encoded: b64Payload) else {
                            L.d("🕒Parse data failed.")
                            return
                        }
                        self.sendSyncTime(payload: payload){ res in
                            result(.success(CHResultStateBLE(input: CHEmpty())))
                            
                        }
                    case .failure(let error):
                        L.d("🕒",error)
                    }
                }
        }
    }
```

## 8、アップロード履歴です【CHSesame2Device+History】

* 方法です：postProcessHistory
* パラメータです：[s:deviceId, v:historyData]
* ネットワーク要求です post, /device/v1/sesame2/historys

```c
        let request: CHAPICallObject = .init(.post, "/device/v1/sesame2/historys", [
            "s": self.deviceId.uuidString,
            "v": historyData.toHexString()
        ])
        
        CHAccountManager
            .shared
            .API(request: request) { result in
                switch result {
                case .success(_):
                    L.d("藍芽", "上傳歷史成功")
                    break
                case .failure(let error):
                    L.d("藍芽", "上傳歷史失敗,掉歷史  : \(error)")
                    break
            }
        }
    }
  ``` 

## 9、登録しますSesame Touch Pro【CHSesameTouchPro+Register】

* 方法です：register
* パラメータです：[t:productType, pk:sesameToken]
* ネットワーク要求です post, /device/v1/sesame5/deviceId

```c
        let request = CHAPICallObject(.post, "/device/v1/sesame5/\(self.deviceId.uuidString)", [
            "t":advertisement!.productType!.rawValue,
            "pk":self.mSesameToken!.toHexString()
        ] as [String : Any])
```        
        
## 10、登録しますBike 2【CHSesameBike2Device+Register】

* 方法です：register
* パラメータです：[t:productType, pk:sesameToken]
* ネットワーク要求です post, /device/v1/sesame5/deviceId

```c
        let request = CHAPICallObject(.post, "/device/v1/sesame5/\(self.deviceId.uuidString)", [
            "t":advertisement!.productType!.rawValue,
            "pk":self.mSesameToken!.toHexString()
        ])
```

## 11、登録しますSesame 5【CHSesame5Device+Register】
* 方法です：register
* パラメータです：[t:productType, pk:sesameToken]
* ネットワーク要求です post, /device/v1/sesame5/deviceId

```c

        let request = CHAPICallObject(.post, "/device/v1/sesame5/\(self.deviceId.uuidString)", [
            "t":advertisement!.productType!.rawValue,
            "pk":self.mSesameToken!.toHexString()
        ])
```

## 12、アップロード履歴です【CHSesame5Device+History】

* 方法です：postProcessHistory
* パラメータです：[s:deviceId, v:historyData,t:5]
* ネットワーク要求です post, /device/v1/sesame2/historys


```c
        let request: CHAPICallObject = .init(.post, "/device/v1/sesame2/historys", [
            "s": self.deviceId.uuidString,
            "v": historyData.toHexString(),
            "t":"5",
        ])

        CHAccountManager
            .shared
            .API(request: request) { result in
                switch result {
                case .success(_):
                    L.d("[ss5][history]藍芽", "上傳歷史成功")
                    break
                case .failure(let error):
                    L.d("[ss5][history]藍芽", "上傳歷史失敗,server掉歷史: \(error)")
                    break
                }
            }
    }
```
    
## 13、ゲストキーを作成します createGuestKey【CHDevice】

* 方法です：createGuestKey
* パラメータです：[keyName：name]
* ネットワーク要求です post, /device/v1/sesame2/deviceId/guestkey


```c

    func createGuestKey(result: @escaping CHResult<String>) {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        let deviceKey = getKey() //返回CHDeviceKey
        let jsonData = try! encoder.encode(deviceKey)
        var data = try! JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
        let date = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM/dd HH:mm"
        dateFormatter.locale = Locale(identifier: "ja_JP")
        data["keyName"] = dateFormatter.string(from: date)
        CHAccountManager.shared.API(request: .init(.post, "/device/v1/sesame2/\(deviceId.uuidString)/guestkey", data)) { postResult in
            switch postResult {
            case .success(let data):
                let decoder = JSONDecoder()
                let guestKey = try! decoder.decode(String.self, from: data!)
                result(.success(.init(input: guestKey)))
            case .failure(let error):
                result(.failure(error))
            }
        }
    }
    
```

## 14、IoTトピックに登録する前に検証を呼び出す必要があります【CHDevice】

* 方法です：iotCustomVerification
* パラメータです：[a：getTimeSignature]
* ネットワーク要求です get, /device/v1/iot/sesame2/deviceId

```c
    func iotCustomVerification(result: @escaping CHResult<CHEmpty>) {
        CHAccountManager.shared.API(request: .init(.get, "/device/v1/iot/sesame2/\(deviceId.uuidString)", queryParameters: ["a": getTimeSignature()])) { verifyResult in
            switch verifyResult {
            case .success(_):
                result(.success(.init(input: .init())))
            case .failure(let error):
                result(.failure(error))
            }
        }
    }
```

## 15、訪問者の鍵を入手します【CHDevice】

* 方法です：getGuestKeys
* パラメータです：[a：getTimeSignature]
* ネットワーク要求です get, /device/v1/sesame2/deviceId/guestkeys

```c
    func getGuestKeys(result: @escaping CHResult<[CHGuestKey]>) {
        CHAccountManager.shared.API(request: .init(.get, "/device/v1/sesame2/\(deviceId.uuidString)/guestkeys")) { getResult in
            switch getResult {
            case .success(let data):
                let guestKeys = try! JSONDecoder().decode([CHGuestKey].self, from: data!)
                result(.success(.init(input: guestKeys)))
            case .failure(let error):
                result(.failure(error))
            }
        }
    }
 ```  
 
## 16、訪問者のキーを更新します【CHDevice】

* 方法です：updateGuestKey
* パラメータです：["guestKeyId": guestKeyId, "keyName": name]
* ネットワーク要求です get, /device/v1/sesame2/deviceId/guestkeys

## 17、ゲストのキーを削除します【CHDevice】

* 方法です：removeGuestKey
* パラメータです：[ "guestKeyId": guestKeyId, "randomTag": keyCheck[0...3]]
* ネットワーク要求です delete, /device/v1/sesame2/deviceId/guestkeys

```c
        CHAccountManager.shared.API(request: .init(.delete, "/device/v1/sesame2/\(deviceId.uuidString)/guestkey", [ "guestKeyId": guestKeyId, "randomTag": keyCheck[0...3].toHexString()])) { deleteResult in
            switch deleteResult {
            case .success(_):
                result(.success(.init(input: .init())))
            case .failure(let error):
                result(.failure(error))
            }
        }
        
 ```     
## 18、プッシュを開きます【CHDevice】

* 方法です：enableNotification
* パラメータです：["token": token,"deviceId":deviceId,"name": name]
* ネットワーク要求です get, /device/v1/token

```c
    func enableNotification(token: String, name: String, result: @escaping CHResult<CHEmpty>) {
        CHAccountManager.shared.API(request: .init(.post, "/device/v1/token",
                                                   ["token": token,
                                                    "deviceId":deviceId.uuidString,
                                                    "name": name])) { createResult in
            if case let .failure(error) = createResult {
                result(.failure(error))
            } else {
                result(.success(.init(input: .init())))
            }
        }
    }
 ``` 
 
## 19、プッシュが開いていますか【CHDevice】

* 方法です：isNotificationEnabled
* パラメータです：["deviceId": deviceId, "deviceToken": token, "name": name]
* ネットワーク要求です get, /device/v1/token


## 20、キー呼び出しですsignedToken【CHDevice】
//  取session token並上傳server以secretKey簽章後得到login token

* 方法です：signedToken
* パラメータです：["deviceId": deviceId., "token": token, "secretKey": keyData.secretKey]
* ネットワーク要求です post, /device/v1/sesame2/sign/

```c
    func sign(token: String, result: @escaping CHResult<String>) {
        guard let keyData = getKey() else {
            return
        }
        L.d("API:/device/v1/sesame2/sign",token, deviceId.uuidString,keyData.secretKey)
        
        CHAccountManager.shared.API(request: .init(.post, "/device/v1/sesame2/sign", ["deviceId": deviceId.uuidString, "token": token, "secretKey": keyData.secretKey])) { serverResult in
            switch serverResult {
            case .success(let data):
                let signedToken = String(data: data!, encoding: .utf8)!
                //                L.d("sign ok:",signedToken)
                result(.success(.init(input: signedToken)))
            case .failure(let error):
                L.d("sign error!")
                
                result(.failure((error)))
            }
        }
    }
```
    
    
## 21、プッシュをオフにします【CHDeviceManager】

* 方法です：disableNotification
* パラメータです：["token": token, "deviceId": deviceId, "name": name]
* ネットワーク要求です delete, /device/v1/token/

```c
    public func disableNotification(deviceId: String, token: String, name: String, result: @escaping CHResult<CHEmpty>) {
        CHAccountManager.shared.API(request: .init(.delete, "/device/v1/token", ["token": token, "deviceId": deviceId, "name": name])) { deleteResult in
            switch deleteResult {
            case .success(_):
                result(.success(.init(input: .init())))
            case .failure(let error):
                result(.failure(error))
            }
        }
    }
    
```
