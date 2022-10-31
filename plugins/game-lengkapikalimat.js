let fetch = require('node-fetch')

let timeout = 120000
let poin = 1500
let handler = async (m, { conn, usedPrefix }) => {
    conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
    let id = m.chat
    if (id in conn.lengkapikalimat) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.lengkapikalimat[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/qisyana/scrape/main/lengkapikalimat.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `${json.pertanyaan}
    
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}leka untuk bantuan
Bonus: ${poin} XP

*Note : Reply Pesan Ini Jika Ingin Menjawab Soal*
`.trim()
    conn.lengkapikalimat[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.lengkapikalimat[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.lengkapikalimat[id][0])
            delete conn.lengkapikalimat[id]
        }, timeout)
    ]
}
handler.help = ['lengkapikalimat']
handler.tags = ['game']
handler.command = /^lengkapikalimat/i
handler.limit = true
handler.group = false

module.exports = handler