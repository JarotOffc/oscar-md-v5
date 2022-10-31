let handler = m => m

handler.before = function (m, { usedPrefix, text } ) {
  let user = global.users[m.sender]
  if(new Date().getTime() > user.bannedDate && user.bannedDate > 0){
  	user.banned = false
      user.bannedReason = ''
      user.bannedDate = 0
      return conn.reply(m.chat, 'Selamat, masa banned kamu sudah habis!', m) 
  }
  if (user.exp < 0) {
      user.banned = true
      conn.reply(m.chat, `Kamu di Ban karena exp kamu minus`, m)
      user.exp = 0
  }
}

module.exports = handler
