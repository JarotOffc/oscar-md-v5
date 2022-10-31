let handler = async (m, { conn, args, command }) => {
	let group = m.chat
        await m.reply('Byee👋, Bot akan keluar dari group', m.chat) 
        await conn.delay(1000)
        await conn.groupLeave(group)
        }
    
handler.help = ['gc', 'gcall', 'group'].map(v => 'leave' + v)
handler.tags = ['group']
handler.command = /^leaveg(c|ro?up)(all|semua)?$/i

handler.rowner = true

module.exports = handler

const delay = time => new Promise(res => setTimeout(res, time)) 