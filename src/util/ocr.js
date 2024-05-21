import { http } from "./https.js";
// 识别咸鱼之王资源图
export const readImage = async function (base64, room, user) {
  http('https://www.tulingyun.com/api/ocr', 'post', {
    token: "www.tulingyun.com",
    upfile_b64: base64,
    return_text: 0,
    only_rec: 0
  }, 2).then(async (res) => {
    console.log(res.data.text, '识别结果')
    let result = await setText(res.data.text)
    if (result.flag) {
      room.say(result.text, user)
    }
  }).catch(err => {
    console.log(err, '错误了!');
  })
}
function setText(txtArr) {
  return new Promise(resolve => {
    let arr = txtArr
    let text = ''
    let obj = {
      flag: false
    }
    let zmlFlag = arr.findIndex(item => item.includes('招募令'))
    let xyzwFlag = arr.findIndex(item => item.includes('咸鱼之王'))
    let jzFlag = arr.findIndex(item => item.includes('金砖'))
    let qtbzFlag = arr.findIndex(item => item.includes('青铜宝箱'))
    let mzbzFlag = arr.findIndex(item => item.includes('木质宝箱'))
    let bjbxFlag = arr.findIndex(item => item.includes('铂金宝箱'))
    let jfFlag = arr.findIndex(item => item.includes('宝箱积分'))
    let yfFlag = arr.findIndex(item => item.includes('黄金鱼竿'))
    let flag = { zmlFlag, xyzwFlag, jzFlag, qtbzFlag, mzbzFlag, bjbxFlag, jfFlag, yfFlag }
    console.log(flag, 'flag');
    let allTrue = Object.values(flag).every(item => item !== -1)
    if (allTrue) {
      obj.flag = true
      let jfNum = 0
      let jzNum = 0
      let ygNum = 0
      let mzxNum = 0
      let qtxNum = 0
      let hjxNum = 0
      let bjxNum = 0
      let bxjf = 0
      let zmlNum = 0
      let jz = arr.find(item => item.includes('金砖'))
      let yf = arr.find(item => item.includes('黄金鱼竿'))
      let zml = arr.find(item => item.includes('招募令'))
      let mzx =  arr.find(item => item.includes('木质宝箱'))
      let qtx =  arr.find(item => item.includes('青铜宝箱'))
      let hjx =  arr.find(item => item.includes('黄金宝箱'))
      let bjx =  arr.find(item => item.includes('铂金宝箱'))
      // 金砖
      if (jz.includes('万')) {
        jzNum = (jz.split('×')[1] ||  jz.split('x')[1]).split('万')[0] * 10000
      } else {
        jzNum = jz.split('×')[1] ||  jz.split('x')[1]
      }
      if (jzNum < 250000) {
        text =`
金砖数量不足,缺少 ${(250000 - jzNum).toFixed(0)}个`
      } else {
        text =`
金砖已足够,已经超出 ${(jzNum - 250000).toFixed(0)}个`
      }
      // 鱼竿
      ygNum = yf.split('x')[1] ||  yf.split('×')[1]
      if (ygNum < 700) {
text+=`
鱼竿数量不足,缺少${(700 - ygNum).toFixed(0)}个`
      } else {
text+=`
鱼竿已足够,已经超出${(ygNum - 700).toFixed(0)}个`
      }
      // 招募令
      zmlNum = zml.split('x')[1] ||  zml.split('×')[1]
      if(zmlNum < 3300) {
text+=`
招募令数量不足,缺少${(3300 - zmlNum).toFixed(0)}个`
      }else {
text+=`
招募令数量已足够,已经超出${(zmlNum - 3300).toFixed(0)}个`  
      }
      // 宝箱
      mzxNum = (mzx.split('x')[1] ||  mzx.split('×')[1]) * 1
      qtxNum =( qtx.split('x')[1] ||  qtx.split('×')[1]) * 10
      hjxNum = (hjx.split('x')[1] ||  hjx.split('×')[1]) * 20
      bjxNum =(bjx.split('x')[1] ||  bjx.split('×')[1]) * 50
      bxjf = (mzxNum + qtxNum + hjxNum + bjxNum).toFixed(0)
      if(bxjf <29580) {
        let lun = ((29580 - bxjf) / 3480).toFixed(2)
        let num = (29580 - bxjf).toFixed(0)
text+=`
宝箱积分不足,缺少${lun}轮,约${num}积分)`
      }else{
        let lun = ((bxjf - 29580  ) / 3480).toFixed(2)
        let num = (bxjf -29580).toFixed(0)
text+=`
宝箱积分充足,超出${lun}轮,约${num}积分)`
      }
text += `
🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 
参考资源:金砖25万个,招募3300个,宝箱积分8.5轮(实际宝箱积分29580分),宝轮估算每轮3480积分(非酋算法),金鱼竿700个
请根据实际情况分析
🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 
数据来源自宸宇的小助手,仅供参考, 最终解释权归咸鱼之王所有!
 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 
      `
      obj.text = text
      resolve(obj)
    } else {
      resolve(obj)
    }

  })
}