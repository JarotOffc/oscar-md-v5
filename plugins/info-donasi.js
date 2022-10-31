let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {
let text = `
「 Suport Bot Dengan Cara donasi 」

⫹⫺ Via Pulsa Indosat : 6285850539404
⫹⫺ Via Dana : 6285850539404
⫹⫺ Via Saweria :
⫹⫺ https://saweria.co/jarotoffc

`.trim()
  m.reply(text)
}
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

module.exports = handler
