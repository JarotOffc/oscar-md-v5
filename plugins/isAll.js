let handler = m => m

handler.before = function (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner, text}) {
	if (m.isGroup) {
		if (opts['restrict'] == false) {
		console.log(`isAll aktif`) 
		conn.reply(m.chat, `IsAll berhasil diaktifkan`) 
		opts['restrict'] = true
		}
		}
		}
		
		module.exports = handler