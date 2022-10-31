let fetch = require('node-fetch')
let teks = 'gcbot'
let handler = async (m, { conn }) => conn.send2ButtonLoc(m.chat, await (await fetch('https://telegra.ph/file/c6d47e0aa9dca2263bee9.png'+ teks)).buffer(), `

*𝐇𝐚𝐥𝐨 𝐁𝐚𝐧𝐡 𝐉𝐚𝐧𝐠𝐚𝐧 𝐋𝐮𝐩𝐚 𝐉𝐨𝐢𝐧 && 𝐁𝐚𝐜𝐚 𝐑𝐮𝐥𝐞𝐬❗*
╔═══════════════════
║ _*Group All*_  𝐉𝐚𝐫𝐨𝐭 ×͜×
╠═══════════════════
║➸ 𝐆𝐫𝐨𝐮𝐩 𝐁𝐨𝐭 1
║ https://tinyurl.com/2nchxnpa
║➸ 𝐆𝐫𝐨𝐮𝐩 𝐁𝐨𝐭 2
║ https://tinyurl.com/2gptyhqs
║➸ 𝐆𝐫𝐨𝐮𝐩 𝐁𝐨𝐭 3
║ https://bit.ly/3zvNS1w
╚════════════════════
╔════════════════════
║ *RULES GROUP BOT*
╠════════════════════
║𝐍𝐨 𝐒𝐡𝐚𝐫𝐞 18+
║𝐍𝐨 𝐬𝐡𝐚𝐫𝐞 𝐋𝐢𝐧𝐤
║𝐍𝐨 𝐒𝐡𝐚𝐫𝐞 𝐕𝐢𝐫𝐮𝐬 
║𝐍𝐨 𝐒𝐩𝐚𝐦 𝐂𝐨𝐦𝐦𝐚𝐧𝐝
║𝐃𝐢𝐥𝐚𝐫𝐚𝐧𝐠 𝐓𝐞𝐥𝐟𝐨𝐧 𝐁𝐨𝐭
║𝐉𝐚𝐧𝐠𝐚𝐧 𝐋𝐮𝐩𝐚 𝐁𝐞𝐫 𝐄𝐭𝐢𝐤𝐚
║𝐃𝐢𝐥𝐚𝐫𝐚𝐧𝐠 𝐇𝐢𝐧𝐚 𝐁𝐨𝐭
║𝐌𝐚𝐮 𝐒𝐞𝐰𝐚? 𝐊𝐞𝐭𝐢𝐤 .owner
╚════════════════════

`.trim(), wm, 'Owner', '.owner', 'Menu', '.menu')
handler.help = ['gcbot']
handler.tags = ['info']
handler.command = /^gc(bot|groupbot)$/i

module.exports = handler
