let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Uang yang akan diberi'
    let who
    let rate = 1000
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu lah'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'
    let poin = parseInt(txt)
    let money = poin
    let users = global.db.data.users
    if (money > users[m.sender].money) return m.reply('Uang Kamu Kurang') 
    if (users.premium == false) {
    	if (money + 1000 > users[m.sender].money) return m.reply('uang kamu kurang! ') 
        if (money + 1000 < users[m.sender].money)
        {
    	    	users[m.sender].money -= money + 1000
                users[who].money += money
            	conn.reply(m.chat, `@${m.sender.split`@`[0]} mentransfer ke @${who.split`@`[0]} sebesar ${money} dan rate ${rate}`, m, 
                {
                    contextInfo: {
                        mentionedJid: [who]
                        }
               })
         }
    }
    if (users.premium == true) {
    	if (money > users[m.sender].money) return m.reply('uang kamu kurang! ') 
    
    if (money < users[m.sender].money) {
    	users[m.sender].money -= money
        users[who].money += money
    	conn.reply(m.chat, `@${m.sender.split`@`[0]} mentransfer ke @${who.split`@`[0]} sebesar ${money}`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) }}
    if (users.owner == true) {
    	if (money > users[m.sender].money) return m.reply('uang kamu kurang! ') 
    
    if (money < users[m.sender].money) {
    	users[m.sender].money -= money
        users[m.sender].money += money
        users[who].money += money
    	conn.reply(m.chat, `@${m.sender.split`@`[0]} mentransfer ke @${who.split`@`[0]} sebesar ${money}`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) }}
   
}

handler.help = ['givemoney @user <amount>']
handler.tags = ['xp']
handler.command = /^gi(vemoney)$/
handler.rowner = true
handler.mods = false

module.exports = handler