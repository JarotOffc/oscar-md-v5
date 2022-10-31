let handler = async (m, { conn, args }) => {
let fs = require('fs')
 let ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net'
  aki = m.quoted ? [m.quoted.sender] : m.mentionedJid
  let users = aki.filter(u => !(u == ownerGroup || u.includes(conn.user.jid)))
  wayy = '_* 𝐌𝐚𝐦𝐩𝐮𝐬 𝐝𝐢 𝐤𝐢𝐜𝐤 𝐒𝐞𝐦𝐨𝐠𝐚 𝐚𝐣𝐚 𝐃𝐢 𝐤𝐢𝐜𝐤 𝐃𝐚𝐫𝐢 𝐃𝐮𝐧𝐢𝐚 𝐣𝐮𝐠𝐚 😐'
  for (let i of users) {
  wayy += ` @${i.split('@')[0]}`
  }
  conn.reply(m.chat, wayy, m, { contextInfo: { mentionedJid: users }})
  for (let user of users) if (user.endsWith('@s.whatsapp.net')) await conn.groupParticipantsUpdate(m.chat, [user], "remove")
}
handler.help = ['okick'].map(v => v + ' @user')
handler.tags = ['group']
handler.command = /^(okick|\-)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.owner = true
handler.botAdmin = true

handler.fail = null
handler.limit = false

module.exports = handler