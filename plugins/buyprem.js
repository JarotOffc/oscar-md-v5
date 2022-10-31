let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn }) => {
  let who = m.sender
  let money
  let harga = 10000000
  let users = global.db.data.users[who]
  if (harga > users.money) throw `uang kamu kurang ${10000000 - users.money} untuk membeli premium`
  if (harga = users.money) {
  users.money -= harga
  
  let a = new Date();
    let d = a.setTime(a.getTime() + 2592000000);
    console.log(d)
    console.log(`Addprem`) 
    users.expired = d
    users.premium = true
  
  m.reply(m.chat, `Berhasil Membeli premium @${m.sender`@`[0]}`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
    }
    
    if (harga < users.money) {
  users.money -= harga
  
  let a = new Date();
    let d = a.setTime(a.getTime() + 2592000000);
    console.log(d)
    console.log(`Addprem`) 
    users.expired = d
    users.premium = true
  
  m.reply(m.chat, `Berhasil Membeli premium @${m.sender`@`[0]}`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
    }
}
handler.help = ['buyprem']
handler.tags = ['money']
handler.command = /^buyprem$/
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

module.exports = handler