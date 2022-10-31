let handler = async(m, { conn, text }) => {
  if(!text) throw `emotnya mana?`
  if(!m.quoted) throw `balas pesannya!`
  conn.addReact(m.chat, m.quoted.fakeObj, text, true)
}
handler.help = ['reaction <reply>']
handler.tags = ['fun']
handler.command = /^rea(c?t?i?o?n?)?$/i
handler.limit = true

module.exports = handler