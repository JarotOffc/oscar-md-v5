let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Spin yang akan diberi'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu lah'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'
    let poin = parseInt(txt)
    let spin = poin
    if (spin < 1) throw 'Minimal 1'
    let ms = 200
    let users = global.db.data.users
    if ( users[m.sender].maxspin >= ms) throw 'jatah kamu minggu ini sudah habis'
    if ( spin >= ms) throw 'Max Add Spin 200 Kak'
    if ( spin < ms)
    users[m.sender].maxspin += poin
    users[who].spin += poin

    conn.reply(m.chat, `Selamat @${who.split`@`[0]}. Kamu mendapatkan +${poin} spin!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }
    ) 
}

handler.help = ['has'] 
handler.tags = ['xp']
handler.command = /^has$/
handler.helper = true
handler.owner = false

module.exports = handler

