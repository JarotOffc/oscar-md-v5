let { MessageType } = require('@adiwajshing/baileys')
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
let harsam = 100
let harsal = 500
let harcod = 1250
let hartro = 3000
let hargol = 7000
let harpuf = 15000

let handler = async (m, { conn, text, usedPrefix}) => { 
    let jumlah = parseInt(text)
    if (!jumlah) {
    jumlah = 1
}
    let bobas = global.db.data.users[m.sender]
    let tzy = global.db.data.invmenu[m.sender]
   if (!text) throw `Jual apa kak?
- sell sampah
  - 100
- sell salmon
  - 500
- sell cod
  - 1250
- sell tropical
  - 3000
- sell golden
  - 7000
- sell puffer
  - 15000
  
  contoh: /sell sampah all
  contoh: /sell all`
  if (text == 'sampah') {
    if (tzy.sampah < jumlah) throw 'Yang kamu miliki tidak sama dengan yang kamu impikan'
    if (tzy.sampah > jumlah) {
    let anja = jumlah * harsam
    tzy.sampah -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} sampah`) 
    }
  }
  if (text == 'sampah all') {
    jumlah = tzy.sampah
    let anja = jumlah * harsam
    tzy.sampah -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} sampah`) 
    
  }
  if (text == 'cod') {
    if (tzy.cod < jumlah) throw 'Yang kamu miliki tidak sama dengan yang kamu impikan'
    if (tzy.cod > jumlah) { 
    let anja = jumlah * harcod
    tzy.cod -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} cod`) 
    }
  }
  if (text == 'cod all') {
    jumlah = tzy.cod
    let anja = jumlah * harcod
    tzy.cod -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} cod`) 
    
  }
  if (text == 'salmon') {
    if (tzy.salmon < jumlah) throw 'Yang kamu miliki tidak sama dengan yang kamu impikan'
    if (tzy.salmon > jumlah) { 
    let anja = jumlah * harsal
    tzy.salmon -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} salmon`) 
    }
  }
  if (text == 'salmon all') {
    jumlah = tzy.salmon
    let anja = jumlah * harsal
    tzy.salmon -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} salmon`) 
    
  }
  
  if (text == 'all') {
    let jumlah1 = tzy.sampah
    let anja1 = jumlah1 * harsam
    tzy.sampah -= jumlah1
    tzy.moneyfish += anja1
    
    let jumlah2 = tzy.cod
    let anja2 = jumlah2 * harcod
    tzy.cod -= jumlah2
    tzy.moneyfish += anja2
    
    let jumlah3 = tzy.salmon
    let anja3 = jumlah3 * harsal
    tzy.salmon -= jumlah3
    tzy.moneyfish += anja3
    
    let jumlah4 = tzy.puffer
    let anja4 = jumlah4 * harpuf
    tzy.puffer -= jumlah4
    tzy.moneyfish += anja4
    
    let jumlah5 = tzy.tropical
    let anja5 = jumlah5 * hartro
    tzy.tropical -= jumlah5
    tzy.moneyfish += anja5
    
    let jumlah6 = tzy.golden
    let anja6 = jumlah6 * hargol
    tzy.golden -= jumlah6
    tzy.moneyfish += anja6
    
    conn.reply(m.chat, `Berhasil menjual ${jumlah1} sampah, ${jumlah2} cod, ${jumlah3} salmon, ${jumlah4} puffer, ${jumlah5} tropical, ${jumlah6} golden`) 
  }
  
  if (text == 'puffer') {
    if (tzy.puffer < jumlah) throw 'Yang kamu miliki tidak sama dengan yang kamu impikan'
    if (tzy.puffer > jumlah) { 
    let anja = jumlah * harpuf
    tzy.puffer -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} puffer`) 
    }
  }
  if (text == 'puffer all') {
    jumlah = tzy.puffer
    let anja = jumlah * harpuf
    tzy.puffer -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} puffer`) 
    
  }
  
  if (text == 'tropical') {
    if (tzy.tropical < jumlah) throw 'Yang kamu miliki tidak sama dengan yang kamu impikan'
    if (tzy.tropical > jumlah) { 
    let anja = jumlah * hartro
    tzy.tropical -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} tropical fish`) 
    }
  }
  if (text == 'tropical all') {
    jumlah = tzy.tropical
    let anja = jumlah * hartro
    tzy.tropical -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} tropical`) 
        
  }
  if (text == 'golden') {
    if (tzy.golden < jumlah) throw 'Yang kamu miliki tidak sama dengan yang kamu impikan'
    if (tzy.golden > jumlah) { 
    let anja = jumlah * hargol
    tzy.golden -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} golden fish`) 
    }
  }
  if (text == 'golden all') {
    jumlah = tzy.golden
    let anja = jumlah * hargol
    tzy.golden -= jumlah
    tzy.moneyfish += anja
    conn.reply(m.chat, `Berhasil menjual ${jumlah} golden fish`) 
        
 }
   
}

handler.help = ['sell']
handler.tags = ['main']
handler.command = /^s(ell)$/
handler.rowner = false

module.exports = handler
