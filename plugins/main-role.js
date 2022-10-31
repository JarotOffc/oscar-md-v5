let handler = async (m, { conn, participants }) => {
    m.reply(` *『 𝐈𝐧𝐟𝐨 𝐑𝐨𝐥𝐞 』*
    
𖣘 Level 0 - 10 = Beginner
𖣘 Level 11-20 = Warrior
𖣘 Level 21-30 = Elite
𖣘 Level 31-40 = Master
𖣘 Level 41-50 = Grandmaster
𖣘 Level 51-60 = Epic
𖣘 Level 61-100 = Legend
𖣘 Level 101-150 = Mytich
𖣘 Level 151- ~ = Mytich Glory
`) 
   }
handler.help = ['role']
handler.tags = ['main']
handler.command = /^role$/i
handler.premium = false

module.exports = handler