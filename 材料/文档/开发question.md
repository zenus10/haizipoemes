## VS中Claude代理

### 问题：

Claude在vs中登陆不了（浏览器认证通过，Claude没反应）

![image-20260117221328800](D:\ENTER\astro-theme-pure\src\content\blog\claude_vsc\1.png)

### 问题分析：



在vs上登录clash时，流程是Claude向浏览器发送请求，浏览器再将授权码传回vs。由于Claude需要科学上网，一般开梯子后浏览器用的是系统代理，而vs上Claude的监听大概用的是底层的一些传输，并非系统代理，网络不一致所以失败。

### 解决办法



根据网络上的解决方法：

[Google Antigravity 登录无反应、不加载？教你一步步解决！（真实有效）](https://zhuanlan.zhihu.com/p/1976637026888619563)

[Claude Code for VS Code 设置代理](https://zhuanlan.zhihu.com/p/1977707129361155529)

#### 开启TUN模式

> **[TUN 模式](https://zhida.zhihu.com/search?content_id=266821087&content_type=Article&match_order=1&q=TUN+模式&zhida_source=entity)** **= 把你电脑/手机的全部网络流量（除了极少数例外）强制走代理，不再依赖浏览器或系统的代理设置，直接在“虚拟网卡”层面接管，避免漏网之鱼！**

在梯子中开启

![image-20260117222809410](D:\ENTER\astro-theme-pure\src\content\blog\claude_vsc\2.png)

#### 使用Proxifier强制代理

通过科学上网工具 开启TUN模式之后，可能短暂或一直没有效果。我们可以采用Proxifier 工具，强制进行代理。

此方法要一直开着，不喜欢的可以跳过了！

#### VS插件

在 VS Code 中打开设置，搜索『*Claude Code*』，找到『*Claude Code: Environment Variables*』设置，点击*在*『*settings.json 中编辑*』，在 setting.json 中写入以下设置：

```
    "claudeCode.environmentVariables": [
        {"name": "HTTP_PROXY", "value": "http://localhost:7890"},
        {"name": "HTTPS_PROXY", "value": "http://localhost:7890"}
    ],
```

我用的就是这个方法，设置完毕后就可以了

