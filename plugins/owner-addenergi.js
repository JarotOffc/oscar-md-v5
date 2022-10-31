let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Energi yang akan diberi'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu lah'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'
    let poin = parseInt(txt)
    let limit = poin
    if (limit < 1) throw 'Minimal 1'
    let invmenu = global.db.data.invmenu
    invmenu[who].energi += poin
    if (limit > 100) return m.reply('Lu mau bot Overload?') 

    conn.reply(m.chat, `Selamat @${who.split`@`[0]}. Kamu mendapatkan +${poin} ENERGI!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) 
}

handler.help = ['addenergi @user <amount>']
handler.tags = ['xp']
handler.command = /^addenergi$/
handler.rowner = false
handler.premium = false
handler.owner = true

module.exports = handler

