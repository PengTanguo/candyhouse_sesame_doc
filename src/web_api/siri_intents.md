# Siri Intents

使用 iOS Intenes 框架，实现 Siri / 捷径开关锁功能。
App 中有三个 Custom Intents: `Toggle Sesame`/`Lock Sesame`/`Unlock Sesame`
`CHExtensionListener`(详见 AppDelegate) 在 Siri 或 SHort cut 功能切换活跃/非活跃状态时触发 对应的 Intent handler


## Lock/Unlock SesameIntent

```Swift
//1.
func handle(intent: UnlockSesameIntent, completion: @escaping (UnlockSesameIntentResponse) -&gt; Void){
//处理传入的Intents，开启蓝芽扫描装置，判断该装置为蓝芽连线或影子登入情况执行动作。执行动作超过10秒未完成则返回`.failure`结果
}

//2.
func resolveName(for intent: UnlockSesameIntent, with completion: @escaping (INStringResolutionResult) -&gt; Void) {
// 解析 Intent 中的 SesameLock 名称，若有找到设备列表中对应名称(不区分大小写)的设备就对该设备执行动作
}

//3.Lock || Unlock || Toggle Sesame
func unlock/ lock/ toggle CHDevice(_ device: CHSesameLock, completion: @escaping (UnlockSesameIntentResponse) -&gt; Void){
//判断装置执行开关锁动作，并在完成时关闭蓝芽扫描、蓝芽断连所有装置。Sesame bike/bike2只支援开锁，Sesame bot 只支援 .click()
}

```


# iOS UI 架构说明

以视图 View 为文件单位


## 常见说明

- CHUserKey: 要传给 Server 的 Sesame 设备格式(POST to user_devices)
- CHUser: APP 中的 AWS 用户，内含(aws cognito)用户属性: subUUID, email,nickname/keyLevel, gtag

- CHDeviceKey: 要存入本地缓存(Core Data)的设备格式
- CHDevice: 所有设备需遵守的协议，在代码中代表设备
- CHBaseDevice

* mSesameToken：手机与 ssm 蓝芽连线时，ss5 传来的 4 bytes 乱数，用于:
- `Sesame5` &lt;-&gt; `APP` 间沟通的 token
- `APP` &lt;-&gt; `Server` 访问该 Sesame5 相关资料用的 token

## 命名缩写

- VC: UIkit 中的 ViewController
 