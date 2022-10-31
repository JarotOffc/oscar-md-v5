let fetch = require("node-fetch")

let handler = async (m, { conn }) => {
  let res = await fetch(global.API('xteam', '/randomimage/ppcouple', {}, 'APIKEY'))
  if (!res.ok) throw await res.text()
  let json = await res.json()
  if (!json.status) throw json
  m.reply('_*Mohon Tunggu Sebentar*_')
  await conn.sendFile(m.chat, json.result.male, '', 'cowo', m)
  await conn.sendFile(m.chat, json.result.female, '', 'cewe', m)
}
handler.help = ['ppcouple', 'ppcp']
handler.tags = ['internet']
handler.command = /^(pp(cp|couple))$/i

module.exports = handler
