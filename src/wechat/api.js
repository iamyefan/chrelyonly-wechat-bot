
// 扫码
import { log, ScanStatus } from "wechaty";
import qrTerminal from "qrcode-terminal";
// 引入缓存工具
import { getCache, setCache } from "../util/cacheUtil.js";
import { FileBox } from "file-box";
import { myOnMessage } from "../util/messageUtil.js";
import { roomEventInit } from "../util/roomUtil.js";
import { saveWaterGroups } from "../util/waterGroupsUtil.js";
import { readImage } from '../util/ocr.js'
import { http } from "../util/https.js";

export function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    // 在控制台显示二维码
    qrTerminal.generate(qrcode, { small: true })
    log.info('等待扫码:', ScanStatus[status], status)
  } else {
    console.log('已扫码,请确认登录: %s(%s)', ScanStatus[status], status)
  }
}
// 登录
export function onLogin(user) {
  //保存token以便下次登录
  log.info(`${user} 登陆成功`)
}
// 登录
export function roomTopic(room, topic, oldTopic, changer) {
  console.log(`群 ${room.topic()} 修改名称,旧名称 ${oldTopic} 新名称 ${topic} 来自 ${changer.name()}`)
}
/**
 * 消息监听
 */
export function onMessage(message, bot) {
  // 消息类型是否为文本
  const txtType = message.type()
  // 获取发送者
  let talker = message.talker()
  // 判断是否是群消息  获取发送群
  let room = message.room();
  if (room) {
    //     判断群名称
    room.topic().then(async function (res) {
      // 定义支持的群
      // if (!res.toString().includes("🍓酱の后🌸园  SVIP内部群1")){
      //     // 不支持的群
      //     log.info("不支持的群")
      //     return;
      // }
      // 保存水群次数
      saveWaterGroups(res, room, talker)
      let msg = message.text();
      if (msg === "") {
        //    不支持的消息类型
        log.info("不支持的消息类型")
        return;
      }
      log.info('消息id:', message.id)
      log.info('消息类型:', txtType)
      log.info('群名称:', res + ",收到群消息:" + talker.name() + ",他/她/它说:" + msg)
      let rres = res
      // 6 正常发送的图片
      if (txtType === 6) {
        // 保存缓存
        message.toFileBox().then(function (res) {
          if (!rres.includes('SVIP内部群') && !rres.includes('非人类研究中心')) {
            readImage(res.buffer.toString("base64"), room, talker)
          }
          // const fileBox3 = FileBox.fromBase64(res.buffer.toString("base64"), '1.png')
          let cacheJson = {
            type: 6,
            text: res.buffer.toString("base64")
          }
          setCache(message.id, JSON.stringify(cacheJson))
        })
      }

      // 5 是收藏表情,不知如何解密微信的表情包连接
      // if(txtType === 5){
      //     // 保存缓存
      //     message.toFileBox().then(function (res) {
      //         let cacheJson = {
      //             type: 5,
      //             text: res.remoteUrl
      //         }
      //         setCache(message.id,JSON.stringify(cacheJson))
      //     })
      // }
      // 7是文本
      if (txtType === 7) {
        // 保存缓存
        let cacheJson = {
          type: 7,
          text: msg
        }
        if (message.text().includes('@ㅤ龙骑士的龙')) {
          let talker = message.talker()
          room.say('艾特你龙爹干啥!!!!', talker)
        } else if (message.text().includes('金色水晶')) {
          const fileBox = FileBox.fromFile("./src/img/jssj.jpg")
          room.say(fileBox)
        } else if (message.text().includes('俱乐部击杀奖励')) {
          const fileBox = FileBox.fromFile("./src/img/boss.jpg")
          room.say(fileBox)
        } else if (message.text().includes('看看胖凯')) {
          const fileBox = FileBox.fromFile("./src/img/lk.jpg")
          // room.say(fileBox)
        } else if (message.text().includes('兑换码')) {
          let text = `
taptap666、VIP666、vip666、XY888、QQXY888、happy666、HAPPY666、xyzwgame666、douyin666、douyin777、douyin888、huhushengwei888、APP666、app666`
          room.say(text, talker)
        } else if (message.text().includes('速度')) {
          let sdObj = {
            '查询曹仁速度': `
曹仁速度参考:
1级速度（不带玩具没有科技）: 10
6000级速度（查图鉴）: 2722
玩具被动: 10000
武将等级: 6000
科技总等级: 20
淬炼速度: 0
速度同心（6/7.5/9/12/15）: 0
最终速度: 13995`,
            '查询甄姬速度': `
甄姬速度参考:
1级速度（不带玩具没有科技）: 12
6000级速度（查图鉴）: 2819
玩具被动: 10000
武将等级: 1
科技总等级: 20
淬炼速度: 0
速度同心（6/7.5/9/12/15）: 0
最终速度: 10013`,
            '查询郭嘉速度': `
郭嘉速度参考:
1级速度（不带玩具没有科技）: 12
6000级速度（查图鉴）: 3201
玩具被动: 10000
武将等级: 6000
科技总等级: 20
淬炼速度: 0
速度同心（6/7.5/9/12/15）: 0
最终速度: 14522`,
          }
          let text = sdObj[message.text()]
          if (text) {
            room.say(text, talker)
          }
        } else if (message.text().indexOf('#获取群成员信息') == 0) {
          let all = await room.memberAll()
          let text = ``
          for (let i = 0; i < all.length; i++) {
            const item = all[i];
            text += `
${i + 1}: ${item.name()} 城市: ${item.city() || '--'} 省份: ${item.province() || '--'}, 个性签名: ${item.payload.signature || '--'}`
          }
          room.say(text, talker)
        } else if (message.text().indexOf('写给阳妹的话') == 0) {
          console.log(talker, 'talker');
          http('http://api.yujn.cn/api/wenrou.php?', 'get', {}, 1).then(res => {
            console.log(res.data, '数据');
            let name = talker.name()
            if (h.id == '@176152cc55c74af3e627186460fee5d797bd49e3fe5c4bf53565033d0e634920') {
              room.say(res.data, talker)
            }
          })
        } else if (message.text().indexOf('随机诱惑') == 0) {
          http('http://api.yujn.cn/api/yht.php?type=image', 'get', {}, 3).then(res => {
            console.log(res.data, '数据');
            let img =FileBox.fromBuffer(res.data, '1.png')
            room.say(img)
            
          })
          // room.say('不准色色', talker)
          // room.say('试试就试试', ...contactList)
        }
        else {
          setCache(message.id, JSON.stringify(cacheJson))
          // 自定义文本回复内容
          myOnMessage(message, room, bot)
        }


      }
      if (txtType === 13) {
        let text = msg;
        let reg = /<msgid>(.*?)<\/msgid>/;
        let result = reg.exec(text);
        if (result) {
          // 获取撤回的消息的id
          let oldmsgid = result[1]
          // 从缓存中获取消息
          let cacheTxt = getCache(oldmsgid)
          if (cacheTxt) {
            // 由于是xml格式,获取replacemsg的值
            reg = /<replacemsg><!\[CDATA\[(.*?)]]><\/replacemsg>/;
            result = reg.exec(text);
            if (result) {
              text = result[1]
            }
            let oldMsg = JSON.parse(cacheTxt)
            // 回复文本
            if (oldMsg.type === 7) {
              if (talker.id != '@15370b360c654483f1f22637bc1f10bac242d046391babda46c536a6cafde025') {
                room.say(text + ",撤回的消息是:[ " + oldMsg.text + " ]")
              }else {
                room.say('南悦大人撤回了一条消息,但是我不敢拦截')
              }
            }
            // // 回复表情包
            // if (oldMsg.type === 5){
            //     // 从xml中解析图片地址
            //     let url = oldMsg.text;
            //     let fileBox = FileBox.fromUrl(url);
            //     room.say(fileBox)
            // }
            // 回复图片
            if (oldMsg.type === 6) {
              // 从xml中解析图片地址
              let base64 = oldMsg.text;
              let fileBox = FileBox.fromBase64(base64, "temp.png");
              if (talker.id != '@15370b360c654483f1f22637bc1f10bac242d046391babda46c536a6cafde025') {
                room.say(text + ",撤回的消息是:")
                room.say(fileBox)
              }else {
                room.say('南悦大人撤回了一张图片,但是我不敢拦截')
              }

            }
          }
        }
      }
    })

  } else {
    log.info('收到个人消息')
  }
}
/**
 * 失败操作
 */
export function onError(msg) {
  log.info("启动失败,请检查是否实名,是否绑定手机号,是否绑定银行卡")
  console.log(msg)
  // 停止node
  // process.exit()
}
function transformArrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  for (var len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
} 