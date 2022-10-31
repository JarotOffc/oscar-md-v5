let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Uang yang akan diberi'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu lah'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'
    let poin = parseInt(txt)
    let money = poin
    let users = global.db.data.users
    if (users[m.sender].owner == true) {
    if (money < 1000) throw 'Minimal 1000'
    if (money > 1000) {
    users[who].money += poin

    conn.reply(m.chat, `Selamat @${who.split`@`[0]}. Kamu mendapatkan +${poin} Money!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) }}
    else {
    if (money > 10000) return m.reply(`Maks 10000`) 
    if (money < 1000) return m.reply('Minimal 1000') 
    if (money < 10001) {
    users[who].money += poin

    conn.reply(m.chat, `Selamat @${who.split`@`[0]}. Kamu mendapatkan +${poin} Money!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) }}
   
}

handler.help = ['addmoney @user <amount>']
handler.tags = ['police']
handler.command = /^addmoney$/
handler.rowner = false
handler.mods = false
handler.police = true

module.exports = handler