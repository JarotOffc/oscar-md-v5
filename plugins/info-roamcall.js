//made by Jarot offc
let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {
let text = `
「 Nih Kak 」
https://call.whatsapp.com/video/dKpgWAWt8pSe4HdGhj6wBU

`.trim()
  m.reply(text)
}
handler.help = ['roamcall']
handler.tags = ['info']
handler.command = /^(roamcall)$/i

module.exports = handler
