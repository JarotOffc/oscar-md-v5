let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
	let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
	let user = global.db.data.users[who]
	let invs = global.db.data.invmenu[who]
	
	
	conn.reply(m.chat, `
	_Hai @${who.split`@`[0]}_
	Inventory Kamu:
	Sampah: ${invs.sampah}
	Salmon: ${invs.salmon}
	Cod: ${invs.cod}
	Tropical: ${invs.tropical}
	Golden Fish: ${invs.golden}
	
	-------------------------------------------------
	
	Pancingan: ${invs.rod}
	Duit: Rp.${invs.moneyfish}
	Duit Bot: Rp.${user.money}
	Level: ${invs.levelbot}
	Xp: ${invs.xpfish}
	Xp Bot: ${user.exp}
	Hoki: ${user.hoki}%
	Durability: ${invs.durability}
    `) 
    }
    
handler.help = ['invmenu']
handler.tags = ['main']
handler.command = /^invmenu$/
handler.rowner = false

module.exports = handler