let handler = async (m, { isAdmin, isOwner, conn, command }) => {
  if (!(isAdmin || isOwner)) {
                global.dfail('admin', m, conn)
                throw false
                }
  conn.groupRevokeInvite(m.chat)
  await delay(1000)
  let linknya = await conn.groupInviteCode(m.chat)
  conn.reply(m.chat, `Link Group Berhasil Direset!\n\nLink Baru:\nhttps://chat.whatsapp.com/` + linknya, m)
}
handler.help = ['revoke']
handler.tags = ['group']
handler.command = /^revoke$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler

const delay = time => new Promise(res => setTimeout(res, time))