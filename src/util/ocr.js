import { http } from "./https.js";
// 识别咸鱼之王资源图
export const readImage = async function (base64, room, user) {
  http('https://www.tulingyun.com/api/ocr', 'post', {
    token: "www.tulingyun.com",
    upfile_b64: base64,
    return_text: 0,
    only_rec: 0
  }, 2).then(async (res) => {
    console.log(res.data, '识别结果')
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
    let jzFlag = arr.findIndex(item => item.includes('金砖'))
    let qtbzFlag = arr.findIndex(item => item.includes('青铜宝箱'))
    let mzbzFlag = arr.findIndex(item => item.includes('木质宝箱'))
    let bjbxFlag = arr.findIndex(item => item.includes('铂金宝箱'))
    let jfFlag = arr.findIndex(item => item.includes('宝箱积分'))
    let yfFlag = arr.findIndex(item => item.includes('黄金鱼竿'))
    let flag = { zmlFlag, jzFlag, qtbzFlag, mzbzFlag, bjbxFlag, jfFlag, yfFlag }
    let allTrue = Object.values(flag).every(item => item !== -1)
    let pwArr = []
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.includes('总战力')) {
        pwArr.push(item)
      }
    }
    let pwFlag = pwArr.length == 10
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
      let mzx = arr.find(item => item.includes('木质宝箱'))
      let qtx = arr.find(item => item.includes('青铜宝箱'))
      let hjx = arr.find(item => item.includes('黄金宝箱'))
      let bjx = arr.find(item => item.includes('铂金宝箱'))
      let lun = ''
      // 金砖
      if (jz.includes('万')) {
        jzNum = (jz.split('×')[1] || jz.split('x')[1] || jz.split('X')[1]).split('万')[0] * 10000
      } else {
        jzNum = jz.split('×')[1] || jz.split('x')[1] || jz.split('X')[1]
      }
      if (jzNum < 250000) {
        text = `
金砖: -${(250000 - jzNum).toFixed(0)} ❌`
      } else {
        text = `
金砖: +${(jzNum - 250000).toFixed(0)} ✅`
      }
      // 鱼竿
      ygNum = yf.split('x')[1] || yf.split('×')[1] || yf.split('X')[1]
      if (ygNum < 700) {
        text += `
金鱼竿: -${(700 - ygNum).toFixed(0)}❌`
      } else {
        text += `
金鱼竿: +${(ygNum - 700).toFixed(0)} ✅`
      }
      // 招募令
      zmlNum = zml.split('x')[1] || zml.split('×')[1] || zml.split('X')[1]
      if (zmlNum < 3300) {
        text += `
招募令: -${(3300 - zmlNum).toFixed(0)} ❌`
      } else {
        text += `
招募令: +${(zmlNum - 3300).toFixed(0)} ✅`
      }
      // 宝箱
      mzxNum = (mzx.split('x')[1] || mzx.split('×')[1] || mzx.split('X')[1]) * 1
      qtxNum = (qtx.split('x')[1] || qtx.split('×')[1] || qtx.split('X')[1]) * 10
      hjxNum = (hjx.split('x')[1] || hjx.split('×')[1] || hjx.split('X')[1]) * 20
      bjxNum = (bjx.split('x')[1] || bjx.split('×')[1] || bjx.split('X')[1]) * 50
      bxjf = (mzxNum + qtxNum + hjxNum + bjxNum).toFixed(0)
      if (bxjf < 29580) {
        let num = (29580 - bxjf).toFixed(0)
         lun = ((29580 - bxjf) / 3480).toFixed(2)
        text += `
宝箱积分:  -${num}分,约${lun}轮 ❌`
      } else {
        let num = (bxjf - 29580).toFixed(0)
        lun = ((bxjf -29580) / 3480).toFixed(2)
        text += `
宝箱积分: +${num}分,约${lun}轮 ✅`
      }
     let bxzLun = (bxjf/3480).toFixed(2)
      text +=
`
------------------------------
木质宝箱：${mzxNum}个
青铜宝箱：${qtxNum}个
黄金宝箱：${hjxNum}个
铂金宝箱：${bjxNum}个
原始积分： ${bxjf}分
宝箱周： ${bxzLun}轮`
      text += 
`
------------------------------
以上分析仅供参考!
祝大吉大利,天天吃鱼[烟花][烟花][烟花]`
      obj.text = text
      resolve(obj)
    } else if (pwFlag) {
      obj.flag = true
      let a1 = setZZLText(pwArr[0], 'a1')
      let a2 = setZZLText(pwArr[1], 'a2')
      let b1 = setZZLText(pwArr[2], 'b1')
      let b2 = setZZLText(pwArr[3], 'b2')
      let c1 = setZZLText(pwArr[4], 'c1')
      let c2 = setZZLText(pwArr[5], 'c2')
      let d1 = setZZLText(pwArr[6], 'd1')
      let d2 = setZZLText(pwArr[7], 'd2')
      let e1 = setZZLText(pwArr[8], 'e1')
      let e2 = setZZLText(pwArr[9], 'e2')
      text =
        `
排位赛对阵识别预计对阵结果:
✅ 第一种: 钻石以下 🚀
周4️⃣:
${a1} 🆚 ${e2}
${e1} 🆚 ${a2}
周5️⃣:
${a1} 🆚 ${e1}
${a2} 🆚 ${e2}
------------------------------
✅ 第二种: 钻石/大师 🚀
周4️⃣:
${a1} 🆚 ${c2}
${b1} 🆚 ${a2}
周5️⃣:
${a1} 🆚 ${b2}
${c1} 🆚 ${a2}
------------------------------
提示: 只能识别周三的排位对战截图,请勿发其他的对战截图
以上数据均为估算,或许存在一定偏差,具体还请以实际对战为准!
------------------------------
`
      obj.text = text
      resolve(obj)
      console.log(pwArr, '排位');
    } else {
      resolve(obj)
    }

  })
}
function setZZLText(text, position) {
  let str = ''
  let positionObj = {
    a1: '左一',
    a2: '右一',
    b1: '左二',
    b2: '右二',
    c1: '左三',
    c2: '右三',
    d1: '左四',
    d2: '右四',
    e1: '左五',
    e2: '右五',
  }
  if (text.includes('总战力:')) {
    str = text.split(':')[1]
  } else if (text.includes('总战力：')) {
    str = text.split('：')[1]
  } else {
    str = text
  }
  str = positionObj[position] + ' ' + str
  return str
}