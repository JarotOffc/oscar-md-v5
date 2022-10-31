let handler  = async (m, { conn }) => {
  if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, 'Kenapa nggk langsung ke terminalnya?', m)
  else {
    await conn.reply(m.chat, 'Goodbye bot :\')', m)
    conn.close()
  }
}
handler.help = ['stopjadibot']
handler.tags = ['jadibot']
handler.command = /^(stopjadibot)$/i
handler.owner = true
module.exports = handler
