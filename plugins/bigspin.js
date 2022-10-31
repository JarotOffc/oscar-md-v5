let handler = async (m, {conn, text}) => { 
	let user = global.db.data.users[m.sender]
	if (user.acc == true) {
    function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
spins = 0
if (user.spin <= spins) throw 'spin tidak mencukupi untuk melakukan gacha'
if ( user.spin > spins) 
user.spin -= 2
conn.reply(m.chat,`| ${pickRandom(['💵','💰', '❌', '✅','👑','❤️','U'])} | ${pickRandom(['💵','💰', '❌', '✅', '👑','❤️','W'])} | ${pickRandom(['💵','💰', '❌', '✅', '👑','❤️','U'])} | ${pickRandom(['💵','💰', '❌', '✅', '👑','❤️','W'])} | ${pickRandom(['💵','💰', '❌', '✅', '👑','❤️','U'])} | ${pickRandom(['💵','💰', '❌', '✅', '👑','❤️','W'])} | ${pickRandom(['💵','💰', '❌', '✅', '👑','❤️','U'])} |
-2 Spin`,m)
    }}


handler.help = ['bigspin ']
handler.tags = ['game']
handler.command = /^bigspin$/
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
