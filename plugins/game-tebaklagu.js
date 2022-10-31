let fetch = require('node-fetch')

let timeout = 120000
let poin = 2000
let handler = async (m, { conn, usedPrefix, args}) => {
    conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
    let id = m.chat
    if (id in conn.tebaklagu) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklagu[id][0])
        throw false
    }
    // ubah isi 'id' kalo mau ganti playlist spotifynya
    
    let src = await (await fetch('https://raw.githubusercontent.com/Aiinne/scrape/main/tebaklagu.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let judul = json.judul.length
    let juduls = ''
    for(let i=0;i<judul;i++){
    	juduls += "_"
    }
    // if (!json.status) throw json
    let caption = `
TEBAK JUDUL LAGU 
Artis : ${json.artis}
Judul : ${juduls}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}cek* untuk bantuan
Bonus: ${poin} XP

*Note : Reply Pesan Ini Jika Ingin Menjawab Soal*
*Balas pesan ini untuk menjawab!*`.trim()
    conn.tebaklagu[id] = [
        await m.reply(caption),
        json, poin,
        setTimeout(() => {
            if (conn.tebaklagu[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.judul}*`, conn.tebaklagu[id][0])
            delete conn.tebaklagu[id]
        }, timeout)
    ]
    await conn.sendMessage(m.chat, { quoted: m, fileName: 'audio.mp3', audio: { url: json.lagu }, ptt: (args[0] !== 'true') ? false : true }) 
}
handler.help = ['tebaklagu']
handler.tags = ['game']
handler.command = /^tebaklagu$/i
handler.limit = true
handler.group = false
module.exports = handler