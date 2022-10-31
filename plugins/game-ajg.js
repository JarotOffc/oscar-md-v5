let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Teksnya mana tolol'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat

    m.reply(m.chat, `${text} `, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    }) 
}

handler.help = ['say']
handler.tags = ['game']
handler.command = /^say$/
handler.rowner = true
handler.mods = true

module.exports = handler