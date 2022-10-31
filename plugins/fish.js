let { MessageType } = require('@adiwajshing/baileys')
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
let handler = async (m, { conn, text, usedPrefix}) => {
	let user = global.db.data.users[m.sender]
    let inv = global.db.data.invmenu[m.sender]
    let fish
    if (inv.room == true) { return conn.reply(m.chat, `Bot kamu sedang otw atau masih dalam fase memancing, tidak dapat memancing lagi :), tunggu selesai`, m) }
    if (inv.hancur === true) { return conn.reply(m.chat, `Pancingan Kamu Rusak, beli yang baru, dengan cara /shop rod <type>`, m) }
        
       // let haha
    //   let as1 = pickRandom(['1', '1', '1', '1', '2', '1', '1', '1']) 
//       let as2 = pickRandom(['1', '1', '2', '1', '2', '1', '1', '1']) 
 //     let as3 = pickRandom(['1', '1', '2', '2', '2', '1', '1', '1']) 
  //      if (mancing.rod == 'kayu') {
     //       haha = 1 * 1 * as1
  //      } else if (mancing.rod == 'batu') {
   //         haha = 2 * 1 * as2
  //      } else if (mancing.rod == 'besi') {
    //        haha = 3 * 1 * as3
   //     }
   
    function fishDone(result, value, durability, hoki, energi) {
   	if(inv.fish[result] == null){
   	    inv.fish[result] = value
       }
   	else{ inv.fish[result] +=  value }
       inv.energi = energi
       inv.durability = durability
       inv.hoki = hoki
       inv.room = false
       conn.reply(m.chat, `Bot kamu sudah selesai memancing:), Kamu mendapatkan ${result} sebanyak ${value}`, m)
   }
        
     function fishing(type, hoki, durability, latar, energi) {
        let newdurability
        let newHoki = pickRandom(['0', '1', '2', '3', '2', '1', '0'])
        let newEnergi
        let time
        let newDur = pickRandom(['1', '2', '3', '2', '1'])
        let jumlah = pickRandom(['1', '2', '3', '4', '5', '4', '3', '2', '1'])
    	if(energi == 0) { return conn.reply(m.chat, `Cape pren gk dikasih makan sama ayang, tapi lu paksa mancing`, m) }
    	if(type == 'kayu'){
    	    newDurability = durability - newDur
            if(newHoki > 1) { newHoki = 1 }
            if(jumlah > 3) { jumlah = 2 }
            if((durability - newDur) < 0){
            	newDurability = 0
            }
        }
        else if(type == 'batu'){
        	if(newDur == 3) { newDur = 2 }
            newDurability = durability - newDur
            if(newHoki > 2) { newHoki = 2 }
            if(jumlah > 4) { jumlah = 3 }
            if((durability - newDur) < 0){
            	newDurability = 0
            }
        }
        else if(type == 'besi'){
        	if(newDur !==1) { newDur = 1 }        	
            newDurability = durability - newDur
            if((durability - newDur) < 0){
            	newDurability = 0
            }
            if(newHoki < 1) { newHoki = 2 }
            if(jumlah < 2) { jumlah = 3 }
        }
        else{ return conn.reply(m.chat, `Rod belum tersedia atau belum ada `, m) }
        if(durability == 0){ return conn.reply(m.chat, `Durability Pancingan 0`, m) }
        if(latar == 'laut'){
        	fish = ['Paus', 'Hiu', 'Cakalang', 'Tongkol', 'Tenggiri', 'Teri', 'Sarden', 'Kakap', 'Kembung', 'Kerapu', 'Belanak', 'Tuna', 'Salmon', 'Kod']
            time = 600000
            newEnergi = energi - 10
            if((energi - 10) < 0){
            	newEnergi = 0
            }
        }
        else if(latar == 'tawar'){
        	fish = ['Gurame', 'Lele', 'Mas', 'Mujair', 'Nila Merah', 'Nila Hitam', 'Baung', 'Bawal', 'Belida', 'Belut', 'Betok', 'Gabus', 'Patin', 'Sepat', 'Toman']
            time = 300000
            newEnergi = energi - 5
        }
        else{ return conn.reply(m.chat, `Latar? Anda berada di rumah`, m) }
        
        let fishS = pickRandom(fish)
        inv.room = true
        let times = time / 1000
        if(times == 300){
        	times = 5
        } else if(times == 600){
        	times = 10
        }
        conn.reply(m.chat, `Memasuki fase memancing selama ${times} Menit`, m) 
        setTimeout(() => {fishDone(fishS, jumlah, newdurability, newHoki, newEnergi)}, time) 
    }
    
    let fishs = fishing(inv.rod, inv.hoki, inv.durability, inv.latar, inv.energi) 
}
    
	
      

handler.help = ['fish']
handler.tags = ['main']
handler.command = /^fish$/
handler.premium = true

module.exports = handler

