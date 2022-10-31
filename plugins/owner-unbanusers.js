let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text, usedPrefix }) => {
	 let user = global.db.data.users[m.sender]
  if (user.bannedPoint > 4) throw `User Telah Toxic Sebanyak 5 Kali\nTidak Bisa Lagi Di Unbanned!!`
  function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

  var hl = []
  hl[0] = text.split('|')[0]
  hl[0] = no(hl[0]) + "@s.whatsapp.net"
  hl[1] = text.split('|')[1]
  
  if (!text) return conn.reply(m.chat, `*『 GET NUMBER 』*\n\n• ${usedPrefix}unban number|days\n*Example:* ${usedPrefix}unban 6283199495313|99\n\n• ${usedPrefix}unban @tag|days\n*Example:* ${usedPrefix}unban @6283199495313|99`, m, { mentions: ['6283199495313@s.whatsapp.net'] }, )
  if (typeof db.data.users[hl[0]] == 'undefined') throw 'Pengguna tidak ada didalam data base'
  // var jumlahHari = 1000 * text
  global.db.data.users[hl[0]].banned = false
  global.db.data.users[hl[0]].bannedDate = 0
  global.db.data.users[hl[0]].bannedReason = ''
  conn.reply(m.chat,`@${hl[0].split('@')[0]} Berhasil Di Unbanned`, m, { mentions: [hl[0]] })
  conn.reply(hl[0],`Hallo, @${hl[0].split('@')[0]} Kamu Telah Di Unbanned`, m, { mentions: [hl[0]] }) 

}
handler.help = ['unban *@tag|days*']
handler.tags = ['owner']
handler.command = /^unban$/i
handler.police = true
handler.owner = true

module.exports = handler

