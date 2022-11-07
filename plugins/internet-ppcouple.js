let fetch = require("node-fetch")
let handler = async (m, { conn }) => {
/*let res = await fetch(`https://api.lolhuman.xyz/api/random/ppcouple?apikey=${lolkey}`)
if (res.status != 200) throw await res.text()
let json = await res.json()
if (!json.status) throw json
m.reply('_*Mohon Tunggu Sebentar*_')
  await conn.sendFile(m.chat, json.result.male, '', 'cowo', m)
  await conn.sendFile(m.chat, json.result.female, '', 'cewe', m)*/

let jsn = await fetch(`https://ziy.herokuapp.com/api/gacha/ppcouple?apikey=xZiyy`)
let json = await jsn.json()
m.reply('_*Mohon Tunggu Sebentar*_')
  await conn.sendFile(m.chat, json.result.male, '', 'cowo', m)
  await conn.sendFile(m.chat, json.result.female, '', 'cewe', m)
}
handler.help = ['ppcouple']
handler.tags = ['internet']
handler.command = /^(ppcp|ppcouple)$/i
module.exports = handler
