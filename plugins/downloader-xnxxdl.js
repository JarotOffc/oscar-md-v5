let fetch = require('node-fetch')
let fs = require('fs')
let handler = async(m, { conn, usedPrefix, text, command }) => {
    if (!text) throw `Harap masukkan URL sebagai teks \n\nContoh : .xnxxdl https://www.xnxx.com/video-13ezat5c/fuck_while_other_is_away`
    const sentMsg = await m.reply('*_Tunggu Sebentar Kami Sedang Memprosesnya..._*')
    let res = await fetch(`https://api.zacros.my.id/nsfw/xnxx-download?link=${text}`)
    if (!res.ok) throw await `${res.status} ${res.statusText}`
    let json = await res.json()
    await conn.sendFile(m.chat, json.result.files.low, 'bkp.mp4', `Title : ${json.result.title}\nLink : ${json.result.link}\n\nVideo msih kurang HD ?coba klik link di bawah ini \n\n\nHD : ${json.result.files.high}`, m)
}
handler.help = ['xnxxdl *link*']
handler.tags = ['asupan']
handler.command = /^xnxxdl$/i

handler.limit = false
handler.premium = true

module.exports = handler
