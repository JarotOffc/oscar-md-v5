function handler(m) {
  m.reply('Mau matikan?\nMau hidupkan?')
  this.send2ButtonLoc(m.chat, "https://telegra.ph/file/3324243c9673f484c5930.jpg", `╭─〔  SET MODE  〕─⬡
  
⊙ Mode : ${global.opts['self'] ? 'Self' : 'Publik'}`, 'Click Here', 'BOT PUBLIC', '.public', 'BOT SELF', '.self')
}
handler.help = [ 'setmode']
handler.tags = ['main']

handler.command = /^(mode|setmode)$/i
handler.owner = false

module.exports = handler
