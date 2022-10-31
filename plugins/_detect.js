let handler = m => m

let { newMessagesDB, MessageType} = require('@adiwajshing/baileys')

handler.before = function (m, { conn, text}) {
	
	if(global.db.data.users[m.sender].staff == true){
        if(m.text == "."){
        	if(m.quoted.text == "."){
        	    return false
            }
            let mime = m.quoted.mimetype || ''
            if (m.quoted.mtype !== 'conversation') {
            	return true
            }
	
            conn.sudoMessage(m.sender, m.chat, m.quoted.text, { parti: m.sender })
            
        }
        return false
    }
    return false

}

module.exports = handler