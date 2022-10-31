let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan jumlah exp yang akan diberi'
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) throw 'Tag salah satu lah'
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (isNaN(txt)) throw 'Hanya angka'
  let xp = parseInt(txt)
  let exp = xp
  if (xp >= 9999999999) throw `Anjir lu mau bot overload? `
  else if (xp < 9999999999) {
  let users = global.db.data.users
  users[who].exp += xp
  
  conn.reply(m.chat, `Selamat @${who.split`@`[0]}. Kamu mendapatkan +${xp}XP!`, m, { mentions: [who] }, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) }
}
handler.help = ['addxp @user <amount>']
handler.tags = ['owner']
handler.command = /^addxp$/
handler.rowner = false
handler.premium = false
handler.rowner = true

module.exports = handler