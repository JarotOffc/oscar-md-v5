let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
if (!args[0]) throw 'Link Nya Mana'
m.reply('tunggu')
 let res = await fetch(`https://api.ibengtools.my.id/api/download/tiktok?url=${args[0]}&apikey=ibeng`)
if (!res.ok) throw await res.text()
let json = await res.json()
if (!json.status) throw json
let { video, description, username } = json.result
await conn.sendFile(m.chat, video, 'video.mp4', `
\n👾 *𝚄𝚜𝚎𝚛 𝙽𝚊𝚖𝚎*: ${username}
\n\n📜 *𝙳𝚎𝚜𝚔𝚛𝚒𝚙𝚜𝚒*: ${description}
\n\n📮 *𝙼𝚊𝚍𝚎 𝙱𝚢*: © 𝙹𝚊𝚛𝚘𝚝 𝙾𝚏𝚏𝚌
`, m, false, { contextInfo: { forwardingScore: 999, isForwarded: true }})
}

handler.help = ['tiktok <url>']
handler.tags = ['downloader']

handler.command = /^(tt|tiktok)$/i
handler.limit = true
module.exports = handler
