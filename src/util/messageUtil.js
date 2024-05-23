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
          if(i == 0) {
            params[`msg`] = item
          }else {
            params[`msg${i}`] = item
          }
        }
        params.rgb1 = 2
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
        const fileBox = FileBox.fromBuffer(res.data, "1.png")
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
        room.say(res.data, talker)
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

        let mp4 = FileBox.fromBuffer(res.data, "1.mp4")
        room.say(mp4, talker)
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

        let mp4 = FileBox.fromBuffer(res.data, "1.mp4")
        room.say(mp4, talker)
      }
      else if (apiItem.type === 22 || apiItem.type === 23) {

        let mp4 = FileBox.fromBuffer(res.data, "1.mp4")
        room.say(mp4, talker)
      } else if (apiItem.type === 24) {
        try {
          let length = res.data.images.length
          let index = Math.floor(Math.random() * length)
          let index2 = Math.floor(Math.random() * length)
          const fileBox =  FileBox.fromUrl(res.data.images[index], "1.png")
          const fileBox2 = FileBox.fromUrl(res.data.images[index2], "2.png")
          room.say('写真来了~', talker)
          room.say(fileBox)
          room.say(fileBox2)
        } catch (error) {
          console.log(error,'error');
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
      else if (apiItem.type ===30) {
        let mp3 = FileBox.fromUrl(res.data.music, "孙笑川说的话.mp3")
        room.say(mp3)
      }
      else if (apiItem.type ===31) {
        let text = res.data.mealwhat
        room.say(text, talker)
      }
      else if (apiItem.type ===32) {
        console.log(res.data,'dddd');
        let mp4 =''
        if(res.data.data.msg) {
           mp4 = FileBox.fromUrl(res.data.data.msg, "22222.mp4")
        }else {
          mp4 = '获取失败'
        }
        room.say(mp4)
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
