let PhoneNumber = require('awesome-phonenumber')
const { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, {conn, text}) => { 
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let name = conn.getName(who)
  let users = global.db.data.users[who]
  
  let ha = users.spin

  
  conn.reply(m.chat, `
┏━━━━━━━♡ *SPIN* ♡━━━━━━━┓
┃╭───────────────────
┃│➸ NAMA : ${name}
┃│➸ NOMOR : ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
┃│➸ SPIN : ${users.spin}
┃╰───────────────────
┗━━━━━━━━━━━━━━━━━━━━┛`, m,
     

) 
}

handler.help = ['myspin']
handler.tags = ['game']
handler.command = /^myspin$/
handler.rowner = false

module.exports = handler