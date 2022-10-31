let { MessageType } = require('@adiwajshing/baileys') 
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Siapa kak yg mau dijadikan Owner?'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    let user = global.db.data.users[m.sender]
    user.owner = true
    if (global.owner.includes(who.split`@`[0])) throw 'Sudah Owner!'
    global.owner.push(`${who.split`@`[0]}`)
    
    
    conn.reply(m.chat, `Hai, @${who.split`@`[0]}. Kamu sudah menjadi Owner, jangan iseng ya atau di demote!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
  
}
handler.help = ['addowner *@user*']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)owner$/i
handler.rowner = true
module.exports = handler