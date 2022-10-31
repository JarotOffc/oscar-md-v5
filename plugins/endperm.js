let handler = async function (m, { text, args, usedPrefix }) {
	let who = m.mentionedJid[0]
  let user = global.db.data.users[who]
  if (!args[0]) return m.reply('tag orang') 
  if (!args[1]) return m.reply('Izinnya? kasih/hapus') 
  if (args[1] == 'kasih') {
  	user.end = true
      conn.reply(m.chat, `Ok kak`,m) 
  }else if (args[1] == 'hapus'){
    user.end = false
      conn.reply(m.chat, `Ntaps kak`, m)
  }else{
     conn.reply(m.chat, `Command Tidak Di Temukan Coba Perhatikan Lagi Kak Chat Nya`, m)
  }
}
  
handler.tags = ['owner']
handler.rowner = true
handler.command = /^(izin)$/i

module.exports = handler