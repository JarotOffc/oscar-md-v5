let { GroupSettingChange } = require('@adiwajshing/baileys')
let handler  = async (m, { conn, args, usedPrefix, command }) => {
	
	let Presence = {
		composing: 'composing', 
		unavailable: 'unavailable',
        available: 'available',
        recording: 'recording',
        paused: 'paused'
   }
	
	let isClose = (args[0] === 'open') ? 'not_announcement' : 'announcement'
	await conn.sendPresenceUpdate(Presence.composing, m.chat)
	if (isClose === undefined)
		throw `
*Format salah! Contoh :*

  *○ ${usedPrefix + command} close*
  *○ ${usedPrefix + command} open*
`.trim()
	await conn.groupSettingUpdate(m.chat, isClose)
}
handler.help = ['group *open / close*']
handler.tags = ['group']
handler.command = /^(group)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = true
handler.botAdmin = true
handler.fail = null
handler.exp = 0
module.exports = handler
