let handler = async (m, { conn, text }) => {
	let users = global.db.data.users
	let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if  (!who) throw 'Owner Stress'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (users[who].police == false) {
    	conn.reply(m.chat, `Dia Bukan Police`) }
    if (users[who].police == true) {
    users[who].police = false
    console.log(`masa premium habis`) 
    conn.reply('Hai @${who.split`@`[0]}. Kamu Telah Di Demote, Karena Kamu Telah Melanggar Rules Yaitu ${text}, Silahkan Dibaca Lagi Rulesnya', '© 𝐀𝐫𝐢𝐞 𝐓𝐮𝐛𝐞', {'button[0]': 'Rules', 'row[0]': '.rules' }, m) 
    conn.reply(m.chat, `Done!`) } }
    
handler.help = ['dpolice'] 
handler.tags = ['owner']
handler.command = /^d(police)$/
handler.helper = false
handler.rowner = true

module.exports = handler
