module.exports = {
    async all(m, chatUpdate) {
        if (m.isBaileys) return
        if (!m.message) return
        if (!m.msg.fileSha256) return
        if (!(m.msg.fileSha256.toString('hex') in global.data.sticker)) return
        let hash = global.data.sticker[m.msg.fileSha256.toString('hex')]
        let { text, mentionedJid } = hash
        
        this.sudoMessage(m.sender, m.chat, `${text}`, { parti: m.sender }) 
    }
}