let PhoneNumber = require('awesome-phonenumber')
const { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, {conn, text}) => { 
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let name = conn.getName(who)
  let users = global.DATABASE.data.users[who]
  
  let uang = users.money

  
  conn.reply(m.chat, `
┏━━━━━━━♡ *ATM* ♡━━━━━━━┓
┃╭───────────────────
┃│➸ NAMA : ${name}
┃│➸ NOMOR : ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
┃│➸ UANG : ${users.money}
┃╰───────────────────
┗━━━━━━━━━━━━━━━━━━━━┛`, m,
     

) 
}

handler.help = ['money']
handler.tags = ['money']
handler.command = /^money$/
handler.rowner = false

module.exports = handler