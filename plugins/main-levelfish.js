let range = 12500
let xprange
let aaa
let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
	let inv = global.db.data.invmenu[m.sender]
	let user = global.db.data.users[m.sender]
	aaa = inv.levelbot + 1
	xprange = range * aaa
	if (inv.xpfish >= xprange ) {
		inv.levelbot += 1
		inv.xpfish -= xprange
		user.hoki += 1
		conn.reply(m.chat, `Selamat Kamu telah naik level, dari ${inv.level} -> ${aaa}`) 
		} else if (inv.xpfish < xprange) {
			let wow = xprange - inv.xpfish
			
			conn.reply(m.chat, `Xp Kamu kurang ${wow}, ${inv.xpfish}/${xprange}`) 
			}
			}
		
		
handler.help = ['uplevel']
handler.tags = ['main']
handler.command = /^up(level)$/
handler.rowner = false

module.exports = handler