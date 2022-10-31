
let modes = {
  noob: [-3, 3,-3, 3, '+-', 15000, 10],
  easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
  medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
  hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
  extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
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
  let op = pickRandom([...ops])
  let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
  if (op == '/') [a, result] = [result, a]
  return {
    str: `${a} ${operators[op]} ${b}`,
    mode,
    time,
    bonus1,
    bonus2: `0`, 
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


let handler = async (m, { conn, args, usedPrefix }) => {
	conn.math = conn.math ? conn.math : {}
  if (args.length < 1) throw `
Mode: ${Object.keys(modes).join(' | ')}

Contoh penggunaan: ${usedPrefix}mtk medium
`.trim()
  let mode = args[0].toLowerCase()
  if (!(mode in modes)) throw `
Mode: ${Object.keys(modes).join(' | ')}

Contoh penggunaan: ${usedPrefix}mtk medium
`.trim()
  let id = m.chat
  if (id in conn.math) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.math[id][0])
  let math = genMath(mode)
  conn.math[id] = [
    await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout: ${(math.time / 1000).toFixed(2)} detik\nBonus Jawaban Benar: ${math.bonus1} XP & ${math.bonus2}\n\n*Note : Reply Pesan Ini Jika Ingin Menjawab Soal*`, m),
    math, 4,
    setTimeout(() => {
      if (conn.math[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah ${math.result}`, conn.math[id][0])
      delete conn.math[id]
    }, math.time)
  ]}
handler.help = ['mtk <mode>']
handler.tags = ['game']
handler.command = /^mtk/i
handler.limit = true

module.exports = handler
