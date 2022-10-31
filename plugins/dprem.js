let handler = async (m, { conn, text }) => {
	let users = global.db.data.users
	let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if  (!who) throw 'Owner Stress'
    users[who].premium = false
    users[who].expired = -1
    console.log(`masa premium habis`) 
    conn.reply(m.chat, `Ok`) }
    
handler.help = ['dprem'] 
handler.tags = ['owner']
handler.command = /^dprem$/
handler.helper = false
handler.owner = true

module.exports = handler
