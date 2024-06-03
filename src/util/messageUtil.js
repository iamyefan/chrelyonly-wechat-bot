import { FileBox } from "file-box";
import { http } from "./https.js";
import { apiList } from "../config/apiList.js";
import { getWaterGroupsWin } from "./waterGroupsUtil.js";

// 自定义更据消息回复事件
export function myOnMessage(message, room, bot) {
  // 根据消息内容回复
  let text = message.text();
  // 获取发送者
  let talker = message.talker()
  if (text.toString().includes("看看菜单")) {
    let menu = "菜单：\n";
    for (let i = 0; i < getAllApiName().length; i++) {
      menu += (i + 1) + "." + getAllApiName()[i] + "\n";
    }
    room.say(menu)
    return;
  }
  // 水群王
  // if (text.toString().includes("水群王")) {
  //   getWaterGroupsWin(room, bot)
  //   return;
  // }
  let apiItem = getApi(text);
  if (apiItem) {
    // 定义参数
    let params = {}
    // 不同接口的请求参数不同单独区分一下
    if (apiItem.type === 9) {
      //musicjx.com/
      let n = null;
      // 判断是否包含#号 包含就是点歌
      if (apiItem.msg.includes("#")) {
        let arr = apiItem.msg.split("#")
        apiItem.msg = arr[0]
        n = arr[1]
      }
      params = {
        key: 'Sbk3cZM1WUlulr6Trgd',
        msg: apiItem.msg,
        n: n,
      }


    } else {
      if (apiItem.type == 17) {
        params = {
          msg: apiItem.msg,
          n: Math.floor(Math.random() * 10) + 1
        }
      } else if (apiItem.type == 28) {
        params = {
          msg: apiItem.msg,
        }
      } else if (apiItem.type == 29) {
        let arr = apiItem.msg.split(" ")
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (i == 0) {
            params[`msg`] = item
          } else {
            params[`msg${i}`] = item
          }
        }
        params.rgb1 = 2
      } else if (apiItem.type == 36) {
        params = {
          city: apiItem.msg
        }
        console.log(params, 'params');
      } else if (apiItem.type == 37) {
        params = {
          name: apiItem.msg,
          type: 'aqq',
          mos: 'json'
        }
      } else if (apiItem.type == 38) {
        params = {
          name: apiItem.msg,
          type: 'awx',
          mos: 'json'
        }
      } else {
        params = {
          "QQ": apiItem.msg,
          "name": apiItem.msg,
          "msg": apiItem.msg,
          "url": apiItem.type === 12 ? "https://qlogo2.store.qq.com/qzone/" + apiItem.msg + "/" + apiItem.msg + "/100" : null,
        }
      }
      //api.lolimi.cn

    }
    http(apiItem.url, "get", params, apiItem.requestType, {}).then(res => {
      if (apiItem.type === 1) {
        room.say(res.data.data, talker)
      } else if (apiItem.type === 2) {
        room.say(res.data.data.output, talker)
      } else if (apiItem.type === 3) {
        console.log(res.data, 'moyu');
        const fileBox = FileBox.fromBuffer(res.data, "2222.png")
        room.say(fileBox)
      } else if (apiItem.type === 4) {
        const fileBox = FileBox.fromUrl(res.data.text, "1.png")
        room.say(fileBox)
      } else if (apiItem.type === 5) {
        const fileBox = FileBox.fromUrl(res.data.data.image, "1.png")
        room.say(fileBox)
      } else if (apiItem.type === 6) {
        const fileBox = FileBox.fromUrl(res.data.data.data[0], "1.png")
        room.say(fileBox)
      } else if (apiItem.type === 7) {
        let data = res.data
        data = data.replaceAll(/\n/g, '$')
        data = data.replaceAll(/\t/g, ' ')

        console.log(data, '1111');
        console.log(data.includes('$'), '2222');

        let text = ''
        if (data.includes('$')) {
          data = data.split('$')
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            text +=
              `${item}
  `
          }
        } else {
          text = data
        }

        room.say(text, talker)
      } else if (apiItem.type === 8) {
        const fileBox = FileBox.fromBuffer(res.data, "1.gif")
        room.say(fileBox)
      } else if (apiItem.type === 9) {
        //点歌专用
        // 获取数据连接
        try {
          if (res.data.data.text) {
            room.say(res.data.data.text + "\n通过#号点歌可以选择播放次数\n如：歌曲名#3")
            return;
          }
          let url = res.data.data.url
          let params = {

          }
          http(url, "get", params, 3, {}).then(res2 => {
            if (res2.headers["content-type"].includes("application/json")) {
              // 还原arraybuffer至msg
              let data = new TextDecoder("utf-8").decode(res2.data)
              if (data.code !== 200) {
                room.say(data)
              } else {
                room.say(data.data)
              }
              return
            }
            const fileBox = FileBox.fromBuffer(res2.data, res.data.data.name + "-" + res.data.data.songname + ".mp3")
            room.say(fileBox)
          })
        } catch (e) {
          room.say("没有找到相关歌曲:" + e.msg)
        }
      } else if (apiItem.type === 10) {
        room.say(res.data.data.Message, talker)
      } else if (apiItem.type === 11) {
        let params = {

        }
        http(res.data.text, "get", params, 3, {}).then(res2 => {
          const fileBox = FileBox.fromBuffer(res2.data, "1.gif")
          room.say(fileBox)
        })
      } else if (apiItem.type === 12) {
        const fileBox = FileBox.fromBuffer(res.data, "1.png")
        room.say(fileBox)
      } else if (apiItem.type === 13) {
        console.log(res.data.data.name);
        room.say(`给您挑选了一个随机名字,喜欢您喜欢噢! 『${res.data.data.name}』`)
      } else if (apiItem.type === 14) {
        const fileBox = FileBox.fromBuffer(res.data, "1.png")
        room.say(fileBox)
      } else if (apiItem.type === 15) {
        console.log(res.data.data, 'dddd');
        // console.log(res.dat);
        room.say(`让我们一起来读一下《${res.data.data.title}》吧》
          ${res.data.data.Msg}
          `, talker)
      } else if (apiItem.type === 16) {

        // let mp4 = FileBox.fromBuffer(res.data, "1.mp4")
        let img = FileBox.fromBuffer(res.data, "1.png")
        room.say(img, talker)
      } else if (apiItem.type === 16.5) {

        // let mp4 = FileBox.fromBuffer(res.data, "1.mp4")
        let img = FileBox.fromBuffer(res.data, "原神KFC语录.mp3")
        room.say(img, talker)
      } else if (apiItem.type === 17) {
        let talkerS = talker
        let data = res.data
        console.log(res.data, '返回的数据');
        try {
          if (res.data.video) {
            let mp4 = FileBox.fromUrl(data.video, "22.mp4")
            room.say(mp4, talkerS).then().catch(err => {
              console.log(err, '报错了');
              room.say(`很抱歉,关于${apiItem.msg}的视频传输失败,请直接浏览器内打开>>>>
             结果标题: ${data.desc}
             ----------------------
             作者: ${data.author}
             ----------------------
             ${data.video}`, talkerS)
            })
          } else {
            room.say(`没有找到关于${apiItem.msg}的资源,请重新搜索`, talker)
          }

        } catch (error) {

        }
      } else if (apiItem.type === 18) {
        let index = Math.floor(Math.random() * 10) + 1
        let mp4 = FileBox.fromBuffer(res.data.data[index].data.photoUrl.split('.mp4')[0] + '.mp4', "1233.mp4")
        room.say(mp4, talker)
        // let mp4 = FileBox.fromBuffer(res.data, "23333.mp4")
        // room.say(mp4)
      }
      else if (apiItem.type === 19) {
        let img = FileBox.fromBuffer(res.data, "1.png")
        room.say(img, talker)
        // let index = Math.floor(Math.random() * 10) + 1
        // let mp4 = FileBox.fromBuffer(res.data.data[index].data.photoUrl.split('.mp4')[0]+'.mp4', "1233.mp4")
        // room.say(mp4, talker)
        // let mp4 = FileBox.fromBuffer(res.data, "23333.mp4")
        // room.say(mp4)
      } else if (apiItem.type === 20 || apiItem.type === 21) {
        console.log(res.data, '数据');
        let mp4 = FileBox.fromBuffer(res.data, "1.mp4")

        room.say(mp4, talker)
      }
      else if (apiItem.type === 22 || apiItem.type === 23) {

        let mp4 = FileBox.fromBuffer(res.data, "1.mp4")
        room.say(mp4, talker)
      } else if (apiItem.type === 24) {
        try {
          setTimeout(async () => {
            let length = res.data.image_count
            let index = Math.floor(Math.random() * length)
            const fileBox = await FileBox.fromUrl(res.data.images[index]+'?v='+ +new Date(), "1.png")
            room.say('写真来了~', talker)
            room.say(fileBox)
          }, 0);

        } catch (error) {
          console.log(error, 'error');
          room.say('获取写真失败', talker)
        }
      } else if (apiItem.type === 25) {
        console.log(res.data, 'ddddd');
        room.say(res.data, talker)
      } else if (apiItem.type === 26) {

        let mp3 = FileBox.fromBuffer(res.data, "我是IKUN.mp3")
        room.say(mp3)
      }
      else if (apiItem.type === 27) {

        let png = FileBox.fromBuffer(res.data, "1.png")
        room.say(png)
      }
      else if (apiItem.type === 28) {
        let mp3 = FileBox.fromUrl(res.data.music, "丁真说的话.mp3")
        room.say(mp3)
      }
      else if (apiItem.type === 29) {
        try {
          let img = FileBox.fromBuffer(res.data, "1.png")
          room.say(img)
        } catch (error) {
          room.say('错误')
        }
      }
      else if (apiItem.type === 30) {
        let mp3 = FileBox.fromUrl(res.data.music, "孙笑川说的话.mp3")
        room.say(mp3)
      }
      else if (apiItem.type === 31) {
        let text = res.data.mealwhat
        room.say(text, talker)
      }
      else if (apiItem.type === 32) {
        console.log(res.data, 'dddd');
        let mp4 = ''
        if (res.data.data.msg) {
          mp4 = FileBox.fromUrl(res.data.data.msg, "22222.mp4")
        } else {
          mp4 = '获取失败'
        }
        room.say(mp4)
      }
      else if (apiItem.type === 34) {
        console.log(res.data, 'dddd');
        let arr = res.data.msg.list || []
        let text =
          `
`
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          text +=
            `${i + 1}、${item}
`
        }
        room.say(text, talker)
        // let mp4 = ''
        // if (res.data.data.msg) {
        //   mp4 = FileBox.fromUrl(res.data.data.msg, "22222.mp4")
        // } else {
        //   mp4 = '获取失败'
        // }
        // room.say(mp4)
      } else if (apiItem.type === 35) {
        let mp4 = FileBox.fromBuffer(res.data, "22222.mp4")
        room.say(mp4)
      }
      else if (apiItem.type === 36) {
        let data = res.data.data
        console.log(res.data, '天气数据');
        let text = ''
        if (data && data.city) {
          let current = data.current
          let living = data.living
          text =
            `
查询城市: ${data.city}
城市英文名字: ${data.cityEnglish}
今日天气情况: ${data.weather}
今日风向: ${data.wind}
今日风速: ${data.windSpeed}
---------------------
当前天气情况:
天气: ${current.weather}
当前体感温度: ${current.temp}℃
湿度: ${current.humidity}
当前风向: ${current.wind}
当前风速: ${current.windSpeed}
当前大气能见度: ${current.visibility}
空气质量: ${setAir(Number(current.air))}
最后更新时间: ${current.date}-${current.time}`
          if (living && living.length > 0) {
            text +=
              `
---------------------`
            for (let i = 0; i < living.length; i++) {
              const item = living[i];
              text +=
                `
${item.name}: ${item.index} 小提示: ${item.tips}`
            }
          }
          text +=
            `
---------------------
 数据来源于网络, 仅供参考,祝生活愉快, 事事顺心~ 😁
`

        } else {
          text = res.data.text || '你说的这个城市是正经的吗?'
        }
        room.say(text, talker)
        // let mp4 = FileBox.fromBuffer(res.data, "22222.mp4")
        // room.say(mp4)
      }else if (apiItem.type === 37 || apiItem.type === 38) {
        console.log(res.data);
        if (res.data.code == 200) {
          let datas = res.data.data
          let {
            name,
            alias,
            platform,
            guobiao,
            provincePower,
            province,
            city,
            cityPower,
            area,
            areaPower,
            updatetime
          } = datas
          let text =
            `查询英雄: ${name}
学名: ${alias}
查询大区: ${platform}
国标最低战力: ${guobiao}
省标最低战力: ${provincePower}(${province})
市标最低战力: ${cityPower}(${city})
县标最低战力: ${areaPower}(${area})
最后更新时间: ${updatetime}
`
          room.say(text, talker)
        } else {
          room.say(res.data, talker)
        }

      }
    })
  }
}


const getAllApiName = () => {
  let nameList = []
  for (let i = 0; i < apiList.length; i++) {
    if (apiList[i].des) {
      nameList.push(apiList[i].des)
    } else {
      nameList.push(apiList[i].name)
    }
  }
  return nameList;
}
const getApi = (name) => {
  for (let i = 0; i < apiList.length; i++) {
    let item = apiList[i]
    if (name.includes(item.name) && name.split('')[0] !== '#') {
      item.msg = name.split(item.name)[1].trim()
      if (!item.msg.trim()) {
        item.msg = "1172576293"
      }
      return item;
    }
  }
  return null;
}
function setAir(air) {
  let text = ''
  if (air <= 50) {
    text = '优'
  } else if (air <= 100) {
    text = '良'
  } else if (air <= 150) {
    text = '轻度污染'
  } else if (air <= 200) {
    text = '中度污染'
  } else if (air <= 300) {
    text = '重度污染'
  } else if (air > 300) {
    text = '严重污染'
  } else {
    text = '查不到,仙界吗?'
  }
  return text
}