let { MessageType } = require('@adiwajshing/baileys') 
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Siapa kak yg mau dijadikan Moderator Bot?'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (global.mods.includes(who.split`@`[0])) throw 'Sudah Moderator!'
    global.mods.push(`${who.split`@`[0]}`)
    conn.reply(m.chat, `Hai, @${who.split`@`[0]}. Kamu sudah menjadi Moderator, jangan iseng ya atau di demote!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
  
}
handler.help = ['addmods *@user*']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)mods$/i
handler.rowner = true
module.exports = handler