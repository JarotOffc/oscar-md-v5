
let modes = {
  impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
  impossible2: [-9999999999999, 9999999999999, -999, 999, '/', 30000, 50000], 
  impossible3: [-999999999999999999, 999999999999999999, -999999, 999999, '*/', 60000, 100000, 20]
} 

let operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷'
}

function genMath(mode) {
  let [a1, a2, b1, b2, ops, time, bonus1, bonus2] = modes[mode]
  let a = randomInt(a1, a2)
  let b = randomInt(b1, b2)
  let c = randomInt(a1, b2)
  let d = randomInt(a2, b1)
  let op = pickRandom([...ops])
  let op2 = pickRandom([...ops])
  let op3 = pickRandom([...ops])
  let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b} ${op2.replace('/', '*')} ${c} ${op3.replace('/', '*')} ${d}`))()
  if (op == '/') [a, result] = [result, a]
  return {
    str: (mode === 'impossible3') ? `${a} ${operators[op]} ${b} ${operators[op2]} ${c} ${operators[op3]} ${d}` : (mode === 'impossible2') ? `${a} ${operators[op]} ${b} ${operators[op2]} ${c}` : `${a} ${operators[op]} ${b}`,
    mode,
    time,
    bonus1,
    bonus2, 
    result
  }
}

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from]
  from = Math.floor(from)
  to = Math.floor(to)
  return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}


let handler = async (m, { conn, text, args, usedPrefix }) => {
  conn.math = conn.math ? conn.math : {}
  if (args.length < 1) throw `
Mode: ${Object.keys(modes).join(' | ')}

Contoh penggunaan: ${usedPrefix}math medium
`.trim()
  let mode = args[0].toLowerCase()
  if (!(mode in modes)) throw `
Mode: ${Object.keys(modes).join(' | ')}

Contoh penggunaan: ${usedPrefix}math impossible
`.trim()
  let id = m.chat
  if (id in conn.math) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.math[id][0])
  let math = genMath(mode)
  let bonus2
  if (text == 'impossible') {
  	math.bonus1 = 35000
      math.bonus2 = 1 }
  if (text == 'impossible2') {
  	math.bonus1 = 50000
      math.bonus2 = 5 }
  let as = global.db.data.users[m.sender]
  if (as.owner == true) {
  	conn.math[id] = [
    await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout: ${(120).toFixed(2)} detik\nBonus Jawaban Benar: ${math.bonus1} XP & ${math.bonus2} spin\n\n*Note : Reply Pesan Ini Jika Ingin Menjawab Soal*`, m),
    math, 4,
    setTimeout(() => {
      if (conn.math[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah ${math.result}`, conn.math[id][0])
      delete conn.math[id]
    }, 120000)
  ]}
  else if (as.premium == true) {
  conn.math[id] = [
    await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout: ${(60).toFixed(2)} detik\nBonus Jawaban Benar: ${math.bonus1} XP & ${math.bonus2} spin\n\n*Note : Reply Pesan Ini Jika Ingin Menjawab Soal*`, m),
    math, 4,
    setTimeout(() => {
      if (conn.math[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah ${math.result}`, conn.math[id][0])
      delete conn.math[id]
    }, 60000)
  ]} else {
  	conn.math[id] = [
    await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout: ${(25).toFixed(2)} detik\nBonus Jawaban Benar: ${math.bonus1} XP & ${math.bonus2} spin\n\n*Note : Reply Pesan Ini Jika Ingin Menjawab Soal*`, m),
    math, 4,
    setTimeout(() => {
      if (conn.math[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah ${math.result}`, conn.math[id][0])
      delete conn.math[id]
    }, 25000)
  ]}
}
handler.help = ['math <mode>']
handler.tags = ['game']
handler.command = /^math/i
handler.limit = true

module.exports = handler