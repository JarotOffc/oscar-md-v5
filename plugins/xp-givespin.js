let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Limit yang akan diberi'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu lah'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'
    let poin = parseInt(txt)
    let spin = poin
    if (spin < 1) throw 'Minimal 1'
    let users = global.db.data.users
    if (spin > users[m.sender].spin) throw 'spin tidak mencukupi untuk give'
    users[m.sender].spin -= poin
    users[who].spin += poin

    m.reply(`(${-poin} spin)`)
    conn.fakeReply(m.chat, `+${poin} spin`, who, m.text)
}
handler.help = ['givespin @user <amount>']
handler.tags = ['xp']
handler.command = /^givespin$/
handler.rowner = true

module.exports = handler

