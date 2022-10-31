let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Uhm...url nya mana?'
  global.API('xteam', '/dl/', {
    url: args[0]
  }, 'APIKEY')
  conn.sendFile(m.chat, undefined, '', '', m)
}
handler.help = ['snack'].map(v => v + ' <url>')
handler.tags = ['downloader']

handler.command = /^snack$/i
handler.premium = true

module.exports = handler
