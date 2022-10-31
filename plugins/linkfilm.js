let handler = async (m, { conn, participants }) => {
 m.reply(`
*『 Doctor Strange In The Multiverse Of Madness 』*
https://doyanfilm21.xyz/?movies=doctor-strange-in-the-multiverse-of-madness

*『 Stand By Me Doraemon 』*
https://doyanfilm21.xyz/?movies=stand-by-me-doraemon

*『 Stand By Me Doraemon 2 』*
https://doyanfilm21.xyz/?movies=stand-by-me-doraemon-2

*『 The Journey Anime 』*
https://drive.google.com/file/d/13hO4sZDaKd3jRvrAUG475gsysDJc_5ZT/view
`)
       }
       handler.help = ['Film']
       handler.command = /^film$/i
       handler.rowner = true
                                           module.exports = handler