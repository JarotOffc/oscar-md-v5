//powered by jarot offc
let fetch = require('node-fetch')
let axios = require('axios')
let handler = async (m, { conn, args }) => {
if (!args[0]) throw 'Uhm..url nya mana?'
m.reply('wait')
 let res = (await axios.get(API('males', '/tiktok', { url: args[0] } ))).data;
if (res.status != 200) throw res.message;
if (!res) throw res.message;
let result = `❖❖⟝⟮ *𝚃𝚒𝚝𝚕𝚎:* ⟯⟞❖❖
 ${res.title}

❖❖⟝⟮ *Author* ⟯⟞❖❖
${res.author}
`
await conn.sendFile(m.chat, res.video, 'video.mp4', result, m)
}
handler.help = ['tiktok <url>']
handler.tags = ['downloader']

handler.command = /^(tt|tiktok)$/i
handler.limit = true
module.exports = handler
