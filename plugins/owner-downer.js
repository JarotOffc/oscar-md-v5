let { MessageType } = require('@adiwajshing/baileys') 
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Siapa kak yg mau di demote?'
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[who]
    user.owner = false
    
    conn.reply(m.chat, `Hai, @${who.split`@`[0]}. kamu sudah di demote`, m, { mentions: [who] }, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
  
}
handler.help = ['downer *@user*']
handler.tags = ['owner']
handler.command = /^downer$/i
handler.rowner = true
module.exports = handler