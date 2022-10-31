let handler = m => m

handler.before = function (m) {
let chat = global.db.data.users[m.sender]
let su = global.db.data.chats[m.chat]

if (chat.expiredgroup > 1) {
if ( new Date * 1 > chat.expiredgroup ) {
chat.expiredgroup = -1
console.log(`masa grup habis`) 
chat.group = false
conn.reply(m.chat, `Jam Sewa bot di grup ini sudah habis`)
opts['restrict'] = false
conn.groupLeave(chat.id)

}}
}

module.exports = handler