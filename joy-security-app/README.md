## Joy Security 使用说明

### 简要说明
该程序主要功能为获取用户的各个网络接口的物理地址发送到指定的服务器以供登录校验或其他业务逻辑的使用.  
调用方式为通过协议 `joy-security://` 调用启动.  


### 使用方式
该软件的使用方式为在页面主动打开,或者在你业务里需要的时候主动打开,以下代码可供参考:  

```js
    // 定义一个 a 标签
    <a id="security-login-a" href="" />
    
    
    // 在业务需求部分
    // href 赋值
    $('#security-login-a').attr('href', "joy-security://" + sessionId + "_" + window.location.host + "/sendMac");
    // 主动点击 a 标签进行调用
    document.getElementById("security-login-a").click();
```

调用的链接方式为: `joy-security://arg1_arg2`  
其中参数:  
arg1: 为当前用户的 sessionId  
arg2: 为你的服务器用来接收数据的接口地址,为此,你需要事先写好一个接口,类型为 POST,传入的参数为 json 字符串, 且需要支持跨域, 接口的处理逻辑开发者根据自己的业务来实现.  
注意:  
arg1 和 arg2 的位置不能变,且使用 `_` 进行分割  


### 数据格式
以下是一个参考的数据格式:  

```json
    {
      lo0: [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.1/8'
        },
        {
          address: '::1',
          netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
          family: 'IPv6',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '::1/128',
          scopeid: 0
        },
        {
          address: 'fe80::1',
          netmask: 'ffff:ffff:ffff:ffff::',
          family: 'IPv6',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: 'fe80::1/64',
          scopeid: 1
        }
      ],
      en0: [
        {
          address: '169.254.127.45',
          netmask: '255.255.0.0',
          family: 'IPv4',
          mac: 'dc:a9:04:7d:16:93',
          internal: false,
          cidr: '169.254.127.45/16'
        }
      ],
      utun0: [
        {
          address: 'fe80::ea2b:6770:d24d:f67',
          netmask: 'ffff:ffff:ffff:ffff::',
          family: 'IPv6',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: 'fe80::ea2b:6770:d24d:f67/64',
          scopeid: 16
        }
      ],
      utun1: [
        {
          address: 'fe80::ccab:2dac:6087:33b2',
          netmask: 'ffff:ffff:ffff:ffff::',
          family: 'IPv6',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: 'fe80::ccab:2dac:6087:33b2/64',
          scopeid: 17
        }
      ],
      en5: [
        {
          address: 'fe80::aede:48ff:fe00:1122',
          netmask: 'ffff:ffff:ffff:ffff::',
          family: 'IPv6',
          mac: 'ac:de:48:00:11:22',
          internal: false,
          cidr: 'fe80::aede:48ff:fe00:1122/64',
          scopeid: 7
        }
      ],
      en7: [
        {
          address: 'fe80::48c:36f3:f58b:1dfb',
          netmask: 'ffff:ffff:ffff:ffff::',
          family: 'IPv6',
          mac: '00:e0:4c:6c:7e:02',
          internal: false,
          cidr: 'fe80::48c:36f3:f58b:1dfb/64',
          scopeid: 18
        },
        {
          address: '192.168.10.74',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: '00:e0:4c:6c:7e:02',
          internal: false,
          cidr: '192.168.10.74/24'
        }
      ],
      bridge100: [
        {
          address: '192.168.2.1',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: 'de:a9:04:d7:f2:64',
          internal: false,
          cidr: '192.168.2.1/24'
        },
        {
          address: 'fe80::dca9:4ff:fed7:f264',
          netmask: 'ffff:ffff:ffff:ffff::',
          family: 'IPv6',
          mac: 'de:a9:04:d7:f2:64',
          internal: false,
          cidr: 'fe80::dca9:4ff:fed7:f264/64',
          scopeid: 19
        }
      ]
    }

```

不同机器返回的数据量会有不同,但是数据格式不会变化,这些数据需要用户自行筛选过滤,我这里给出的参考方法为过滤掉 ipv6 的接口和 MAC 地址无意义的接口  

比如上述地址过滤后得到:  
- en0: dc:a9:04:7d:16:93  
- en7: 00:e0:4c:6c:7e:02  
- bridge100: de:a9:04:d7:f2:64  

三条有效数据.  


### Q & A
1. 如何检测软件是否安装?  
很简单,检测软件是否安装,即检查协议 `joy-security://` 是否存在即可, 那么如何检查协议是否存在, 以下代码可供参考:  

```js
    let downloadURL = "http://xxxx";
    window.location = "joy-security://xxxxxx_xxxxxxx";
    setTimeout(function() {
      window.location = downloadURL;
    },1000)
```

该段代码用来发出请求协议,由于是本地协议,相应速度很快,如果 1 秒内无响应则说明协议不存在,则跳转到下载页面进行安装.  
可根据自己的逻辑适当调整代码.  

2. Mac 电脑打开软件提示不受信任的开发者?  
这是因为代码没有进行签名,而签名代码需要苹果开发者账号,需要支付年费.  
解决方式很简单: 进入设置 - Security & Privacy - Allow apps downloaded from 下点击允许即可.  

3. 在浏览器中尝试打开时会弹出提示框  
这是正常的,为了保证在得到用户的授权下才启动该软件.如果不想每次都提示,可以勾选上提示上的勾选框.  

4. 软件不使用时是否可关闭?  
完全可以,甚至在你使用系统时也可随时关闭,因为在你需要它的时候可以通过代码唤醒启动.  

5. 软件是否有安全问题?会不会偷偷监听上传我的文件?  
完全不会!  