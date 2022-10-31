let { MessageType } = require('@adiwajshing/baileys') 
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Siapa kak yg mau dijadikan Premium?'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    let user = global.db.data.users[who]
    let a = new Date();
    let d = a.setTime(a.getTime() + 2592000000);
    console.log(d)
    console.log(`Addprem`) 
    user.expired = d
    user.premium = true
    
    conn.reply(m.chat, `Hai, @${who.split`@`[0]}. Kamu sudah menjadi premium selama 30 hari `, m, { mentions: [who] }, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
  
}
handler.help = ['sprem *@user*']
handler.tags = ['owner']
handler.command = /^sprem$/i
handler.owner = true
module.exports = handler