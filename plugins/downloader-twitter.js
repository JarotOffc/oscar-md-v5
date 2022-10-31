let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Uhm...url nya mana?'
  global.API('xteam', '/dl/twitter', {
    url: args[0]
  }, 'APIKEY')
  conn.sendFile(m.chat, undefined, '', '', m)
}
handler.help = ['twiter'].map(v => v + ' <url>')
handler.tags = ['downloader']

handler.command = /^(twiter)$/i
handler.limit = true

module.exports = handler
