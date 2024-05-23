
import "./newdate.js";
console.log(new Date().Format("hh:mm:ss"))
import { http } from "./https.js";
import { FileBox } from "file-box";
const listTime = [
  "08:50:00",
  "09:09:00",
  "09:10:00",
  "09:19:00",
  "10:00:00",
  "12:00:00",
  "21:50:00",
  "22:22:22",
  "23:40:30",
  "23:11:11"
]
let weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let currentDate = new Date();
let dayOfWeek = weekDays[currentDate.getDay()];

// // 判断时间是否到点啦
export const isTimeTo = (bot) => {
  const now = new Date().Format("hh:mm:ss");
  if (listTime.includes(now)) {
    saveTime(bot);
  }
}

const saveTime = (bot) => {
  // waterGroups@@91d480af5b0828d3e4681c58de53a218d5a4026a92e0d6e643a212dd4fb6ff6820240513.json
  // const roomList = await bot.Room.find()
  // const roomList = await bot.Room.find({topic: '🍓酱の后🌸园  SVIP内部群1'})
  // promise实现
  // 寻找指定群
  bot.Room.find({ topic: '虹团大本营' }).then(async (room) => {

    if (room) {
      const now = new Date().Format("hh:mm:ss");
      const today = new Date().Format("yyyy-MM-dd hh:mm:ss");
      if (now == '09:09:00') {
        room.say(`现在是${today} - ${dayOfWeek} ,虹团的朋友们大家好, 宸宇的小助手即将为您播报今日热点新闻`)
        http('https://api.yujn.cn/api/60SReadWorld.php', 'get', {}, 3).then(res => {
          let img = FileBox.fromBuffer(res.data, '2.png')
          room.say(img)
        })
      } else if (now == '09:19:00' || now == '22:22:22') {
        http(' http://api.yujn.cn/api/wyrp.php', 'get', {}, 1).then(res => {
          let text = `
现在是北京时间 ${today}-${dayOfWeek}, 宸宇的小助手为您奉上每日网抑云,
${res.data}
祝你晚安好梦!
          `
          room.say(text)
        })

      }  else if (now == '12:00:00') {
       if(dayOfWeek == '周一') {
        room.say('重要的事情说两遍,准备打马厩了!!!!')
        setTimeout(()=> {
          room.say('重要的事情说两遍,准备打马厩了!!!!')
        }, 1000)
       }else if (dayOfWeek == '周二') {
        room.say('厨神不要忘记打了,已经打了的当我没说')
       }else if (dayOfWeek == '周三' || dayOfWeek == '周四' || dayOfWeek == '周五') {
        room.say('排位赛不要忘记报名咯!')
       }
      }
    }
  })
  bot.Room.find({ topic: '🍓酱の后🌸园  SVIP内部群1' }).then(async (room) => {
    if (room) {
      const now = new Date().Format("hh:mm:ss");
      const today = new Date().Format("yyyy-MM-dd");
        if (now == '23:11:11') {
        http(' http://api.yujn.cn/api/wyrp.php', 'get', {}, 1).then(res => {
          let text = 
`今天是${today}, 现在是北京时间晚上11点11分, 今天是${dayOfWeek}, 龙骑士的小助手为您奉上每日网抑云,
${res.data}
祝你晚安好梦!`
          room.say(text)
        })
      }else  if (now == '09:10:00') {
        const today = new Date().Format("yyyy-MM-dd");
        room.say(`今天是${today}- ${dayOfWeek}, 现在是上午九点十分, 后花园的朋友们大家好, 龙骑士的小助手即将为您播报今日热点新闻`)
        http('https://api.yujn.cn/api/60SReadWorld.php', 'get', {}, 3).then(res => {
          let img = FileBox.fromBuffer(res.data, '2.png')
          room.say(img)
        })
      } 
    }
  })
}
