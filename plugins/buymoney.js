let { MessageType } = require('@adiwajshing/baileys')
const { createHash } = require('crypto')
let handler = async (m, { conn, text }) => {
	let user = global.db.data.users[m.sender]
	if (user.acc == true) {
  let sn = createHash('md5').update(m.sender).digest('hex')
  if (!text) throw 'Masukkan jumlah Exp yang Mau di ubah ke Money Server'
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) throw 'Tag ArTube (Admin dengan pp hitam saja'
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (isNaN(txt)) throw 'Hanya angka'
  let xp = parseInt(txt)
  let exp = xp
  if (exp < 100) throw 'Minimal convert 100 exp'
  if (exp > users[m.sender].exp) throw 'Exp tidak mencukupi untuk convert'
  users[m.sender].exp -= xp
  users[who].exp += xp

  conn.reply(m.chat, `Transaksi berhasil. Anda mendapatkan MoneyServer dengan jumlah ${xp * 10}.Silahkan SS bukti dan kirim ke @${who.split`@`[0]}. SN transaksi: ${sn}`, who, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) }
}
handler.help = ['bms @user JumlahXp  ------- 1000Xp = 10K Money Server', 'BuyMoneyServer @user JumlahXp']
handler.tags = ['money']
handler.command = /^bms$/
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

module.exports = handler
