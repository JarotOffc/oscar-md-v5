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
\nš¾ *šššš š½ššš*: ${username}
\n\nš *š³šššššššš*: ${description}
\n\nš® *š¼ššš š±š¢*: Ā© š¹šššš š¾ššš
`, m, false, { contextInfo: { forwardingScore: 999, isForwarded: true }})
}

handler.help = ['tiktok <url>']
handler.tags = ['downloader']

handler.command = /^(tt|tiktok)$/i
handler.limit = true
module.exports = handler
