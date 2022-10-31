let handler = async (m, { conn }) => {
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

m.reply(`
┌─〔 𝐏𝐞𝐦𝐢𝐥𝐢𝐤 𝐛𝐨𝐭 〕
├ 𝐉𝐚𝐫𝐨𝐭 𝐨𝐟𝐟𝐜
├ http://wa.me/6285850539404
├ 𝐍𝐨𝐦𝐞𝐭 𝐛𝐨𝐭 𝐁𝐲 𝐎𝐬𝐜𝐚𝐫-𝐌𝐝
├ http://wa.me/6285328754243
└────
┌─〔 R U N T I M E 〕
├ 𝐁𝐨𝐭 𝐀𝐤𝐭𝐢𝐟 𝐒𝐞𝐥𝐚𝐦𝐚
├ ${uptime}
├𝐉𝐚𝐧𝐠𝐚𝐧 𝐋𝐮𝐩𝐚 𝐒𝐮𝐬𝐜𝐫𝐢𝐛𝐞
├ https://tinyurl.com/2qsejxnw
└────
    `)
}
handler.help = ['runtime']
handler.tags = ['info']
handler.command = /^(uptime|runtime)$/i

module.exports = handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
