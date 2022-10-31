let fetch = require('node-fetch')

let timeout = 120000
let poin = 5000
let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
  let id = m.chat
  if (id in conn.tebakanime) {
    conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0])
    throw false
  }
  let res = await fetch(global.API('adi', '/api/game/tebakanime', {}, 'apikey'))
  if (res.status !== 200) throw await res.text()
  let json = await res.json()
  if (!json.status) throw json
  let caption = `
${json.deskripsi}
  
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}nime untuk bantuan
Bonus: ${poin} XP

*Note : Reply Pesan Ini Jika Ingin Menjawab Soal*
    `.trim()
  conn.tebakanime[id] = [
    await conn.sendFile(m.chat, json.image, 'tebakanime.jpg', caption, m),
    json, poin,
    setTimeout(() => {
      if (conn.tebakanime[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakanime[id][0])
      delete conn.tebakanime[id]
    }, timeout)
  ]
}
handler.help = ['tebakanime']
handler.tags = ['game']
handler.command = /^tebakanime/i
handler.limit = true
handler.group = false

module.exports = handler