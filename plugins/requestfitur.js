// By Razen
let handler = async(m, { conn, text }) => {
    if (!text) throw 'Request Fitur Apa?\n\n*Contoh : .requestfitur Fish*'
    if (text.length > 300) throw 'Maaf Huruf Terlalu Panjang, Maksimal 300!'
    const alasan = `*「 Request 」* _Request Fitur_ \nNomor : wa.me/${m.sender.split`@`[0]}\nPesan : ${text}`
    for (let jid of global.you.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net'))
    m.reply(alasan, jid)
    m.reply('✔️Request Fitur telah di dikirimkan ke Owner Bot, request palsu/main2 tidak akan ditanggapi dan di ban!\n\nHormat Kami Staff Jarot ofc') 
}
handler.help = ['requestfitur'].map(v => v + ' <teks>')
handler.tags = ['main']
handler.command = /^(requestfitur)$/i

module.exports = handler

