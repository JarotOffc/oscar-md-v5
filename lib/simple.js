const {
    default: makeWASocket,
    proto,
    downloadContentFromMessage,
    getBinaryNodeChild,
    jidDecode,
    areJidsSameUser,
    generateForwardMessageContent,
    generateWAMessageFromContent, 
    sha256, 
    aesDecryptWithIV, 
    Mimetype, 
    MessageType, 
    getHttpStream, 
    toBuffer, 
    extractImageThumb
} = require('@adiwajshing/baileys')
const { toAudio, toPTT, toVideo } = require('./converter')
const chalk = require('chalk')
const fetch = require('node-fetch')
const FileType = require('file-type')
const PhoneNumber = require('awesome-phonenumber')
const fs = require('fs')
const path = require('path')

exports.makeWASocket = (...args) => {
    const conn = makeWASocket(...args)
    const event = conn.ev
    
    conn.urlToBuffer = async function urlToBuffer(url) {
    	//console.log(url)
    	//if(url.startsWith('https://') === false || url.startsWith('http://') === false) url = 'https://'+url
        let stream = await getHttpStream(url)
        let extract = await extractImageThumb(stream)
        let result = extract.toString('base64') 
        return result
    }

    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            jid = decode.user + '@' + decode.server
            return decode.user && decode.server && jid
        } else return jid
    }
    if (conn.user && conn.user.id) conn.user.jid = conn.decodeJid(conn.user.id)
    conn.chats = {}
    conn.contacts = {}

    function updateNameToDb(contacts) {
        if (!contacts) return
        for (let contact of contacts) {
            let id = conn.decodeJid(contact.id)
            if (!id) continue
            let chats = conn.contacts[id]
            if (!chats) chats = { id }
            let chat = {
                ...chats,
                ...({
                    ...contact, id, ...(id.endsWith('@g.us') ?
                        { subject: contact.subject || chats.subject || '' } :
                        { name: contact.notify || chats.name || chats.notify || '' })
                } || {})
            }
            conn.contacts[id] = chat
        }
    }
    conn.ev.on('contacts.upsert', updateNameToDb)
    conn.ev.on('groups.update', updateNameToDb)
    conn.ev.on('group-participants.update', async function updateParticipantsToDb({ id, participants, action }) {
        id = conn.decodeJid(id)
        if (!(id in conn.contacts)) conn.contacts[id] = { id }
        let groupMetadata = Object.assign((conn.contacts[id].metadata || {}), await conn.groupMetadata(id))
        for (let participant of participants) {
            participant = conn.decodeJid(participant)
            switch (action) {
                case 'add': {
                    if (participant == conn.user.jid) groupMetadata.readOnly = false
                    let same = (groupMetadata.participants || []).find(user => user && user.id == participant)
                    if (!same) groupMetadata.participants.push({ id, admin: null })
                }
                    break
                case 'remove': {
                    if (participant == conn.user.jid) groupMetadata.readOnly = true
                    let same = (groupMetadata.participants || []).find(user => user && user.id == participant)
                    if (same) {
                        let index = groupMetadata.participants.indexOf(same)
                        if (index !== -1) groupMetadata.participants.splice(index, 1)
                    }
                }
                    break
            }
        }
        conn.contacts[id] = {
            ...conn.contacts[id],
            subject: groupMetadata.subject,
            desc: groupMetadata.desc.toString(),
            metadata: groupMetadata
        }
    })

    conn.ev.on('groups.update', function groupUpdatePushToDb(groupsUpdates) {
        for (let update of groupsUpdates) {
            let id = conn.decodeJid(update.id)
            if (!id) continue
            if (!(id in conn.contacts)) conn.contacts[id] = { id }
            if (!conn.contacts[id].metadata) conn.contacts[id].metadata = {}
            let subject = update.subject
            if (subject) conn.contacts[id].subject = subject
            let announce = update.announce
            if (announce) conn.contacts[id].metadata.announce = announce
        }
    })
    conn.ev.on('chats.upsert', function chatsUpsertPushToDb(chats_upsert) {
        console.log({ chats_upsert })
    })
    conn.ev.on('presence.update', function presenceUpdatePushToDb({ id, presences }) {
        let sender = Object.keys(presences)[0] || id
        let _sender = conn.decodeJid(sender)
        let presence = presences[sender]['lastKnownPresence'] || 'composing'
        if (!(_sender in conn.contacts)) conn.contacts[_sender] = {}
        conn.contacts[_sender].presences = presence
    })

    conn.logger = {
        ...conn.logger,
        info(...args) { console.log(chalk.bold.rgb(57, 183, 16)(`INFO [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.cyan(...args)) },
        error(...args) { console.log(chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.rgb(255, 38, 0)(...args)) },
        warn(...args) { console.log(chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.keyword('orange')(...args)) }
    }

    /**
     * getBuffer hehe
     * @param {String|Buffer} path
     * @param {Boolean} returnFilename
     */
    conn.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data
        }
    }

    /**
     * waitEvent
     * @param {*} eventName 
     * @param {Boolean} is 
     * @param {Number} maxTries 
     * @returns 
     */
    conn.waitEvent = (eventName, is = () => true, maxTries = 25) => {
        return new Promise((resolve, reject) => {
            let tries = 0
            let on = (...args) => {
                if (++tries > maxTries) reject('Max tries reached')
                else if (is()) {
                    conn.ev.off(eventName, on)
                    resolve(...args)
                }
            }
            conn.ev.on(eventName, on)
        })
    }
    
  conn.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    
    /**
    * Send Media/File with Automatic Type Specifier
    * @param {String} jid
    * @param {String|Buffer} path
    * @param {String} filename
    * @param {String} caption
    * @param {Object} quoted
    * @param {Boolean} ptt
    * @param {Object} options
    */
    conn.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await conn.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } }
            catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) if (options.asDocument) options.asDocument = true
        let mtype = '', mimetype = type.mime
        if (/webp/.test(type.mime)) mtype = 'sticker'
        else if (/image/.test(type.mime)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) (
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        return await conn.sendMessage(jid, {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        }, {
            ...opt,
            ...options
        })
    }

    /**
     * Send Contact
     * @param {String} jid 
     * @param {String} number 
     * @param {String} name 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendContact = async (jid, number, name, quoted, options) => {
        number = number.replace(/[^0-9]/g, '')
        let njid = number + '@s.whatsapp.net'
        let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
END:VCARD
    `
        return await conn.sendMessage(jid, {
            contacts: {
                displayName: name,
                contacts: [{ vcard }],
                quoted, ...options
            },
            quoted, ...options
        })
    }

    /**
     * Reply to a message
     * @param {String} jid
     * @param {String|Object} text
     * @param {Object} quoted
     * @param {Object} options
     */
    conn.reply = (jid, text = '', quoted, options) => {
    	//let mention = (typeof options.contextInfo === 'object') ?  options.contextInfo.mentionedJid : []
        //options.mentions = mention
        //let opt = (options.mentions === 'object') ? options.mentions : []
        return Buffer.isBuffer(text) ? this.sendFile(jid, text, 'file', '', quoted, false, options) : conn.sendMessage(jid, { ...options, text }, { quoted, ...options })
    }

   /**
   * getBuffer hehe
   * @param {String|Buffer} path
   * @param {Boolean} returnFilename
   */
  conn.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await fetch(PATH)).buffer()
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && returnAsFilename && !filename)
      (filename = path.join(
        __dirname,
        "../tmp/" + new Date() * 1 + "." + type.ext
      )),
        await fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      ...type,
      data,
    };
  };

  conn.resize = async (buffer, ukur1, ukur2) => {
    return new Promise(async (resolve, reject) => {
      var baper = await Jimp.read(buffer);
      var ab = await baper.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG);
      resolve(ab);
    });
  };

  conn.generateProfilePicture = async (buffer) => {
    const jimp_1 = await Jimp.read(buffer);
    const resz =
      jimp_1.getWidth() > jimp_1.getHeight()
        ? jimp_1.resize(550, Jimp.AUTO)
        : jimp_1.resize(Jimp.AUTO, 650);
    const jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG));
    return {
      img: await resz.getBufferAsync(Jimp.MIME_JPEG),
    };
  };

    /**
     * waitEvent
     * @param {*} eventName 
     * @param {Boolean} is 
     * @param {Number} maxTries 
     * @returns 
     */
    conn.waitEvent = (eventName, is = () => true, maxTries = 25) => {
        return new Promise((resolve, reject) => {
            let tries = 0
            let on = (...args) => {
                if (++tries > maxTries) reject('Max tries reached')
                else if (is()) {
                    conn.ev.off(eventName, on)
                    resolve(...args)
                }
            }
            conn.ev.on(eventName, on)
        })
    }
    
  conn.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    
    /**
    * Send Media/File with Automatic Type Specifier
    * @param {String} jid
    * @param {String|Buffer} path
    * @param {String} filename
    * @param {String} caption
    * @param {Object} quoted
    * @param {Boolean} ptt
    * @param {Object} options
    */
    conn.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await conn.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } }
            catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) if (options.asDocument) options.asDocument = true
        let mtype = '', mimetype = type.mime
        if (/webp/.test(type.mime)) mtype = 'sticker'
        else if (/image/.test(type.mime)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) (
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        return await conn.sendMessage(jid, {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        }, {
            ...opt,
            ...options
        })
    }

    /**
     * Send Contact
     * @param {String} jid 
     * @param {String} number 
     * @param {String} name 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendContact = async (jid, number, name, quoted, options) => {
        number = number.replace(/[^0-9]/g, '')
        let njid = number + '@s.whatsapp.net'
        let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
END:VCARD
    `
        return await conn.sendMessage(jid, {
            contacts: {
                displayName: name,
                contacts: [{ vcard }],
                quoted, ...options
            },
            quoted, ...options
        })
    }

    /**
     * Reply to a message
     * @param {String} jid
     * @param {String|Object} text
     * @param {Object} quoted
     * @param {Object} options
     */
    conn.reply = (jid, text = '', quoted, options) => {
    	//let mention = (typeof options.contextInfo === 'object') ?  options.contextInfo.mentionedJid : []
        //options.mentions = mention
        //let opt = (options.mentions === 'object') ? options.mentions : []
        return Buffer.isBuffer(text) ? this.sendFile(jid, text, 'file', '', quoted, false, options) : conn.sendMessage(jid, { ...options, text }, { quoted, ...options })
    }
     /**
   * Send a list message
   * @param jid the id to send to
   * @param button the optional button text, title and description button
   * @param rows the rows of sections list message
   */
  conn.sendListM = async (jid, button, rows, quoted, options = {}) => {
    const sections = [
      {
        title: button.title,
        rows: [...rows],
      },
    ];
    const list2Message = {
      text: button.description,
      footer: button.footerText,
      mentions: await conn.parseMention(button.description),
      ephemeralExpiration: 86400,
      title: "",
      buttonText: button.buttonText,
      sections,
    };
    conn.sendMessage(jid, list2Message, {
      quoted,
      ephemeralExpiration: 86400,
      contextInfo: {
        forwardingScore: 999999,
        isForwarded: true,
        mentions: await conn.parseMention(
          button.description + button.footerText
        ),
        ...options,
      },
    });
  };
    /**
     * send Button
     * @param {String} jid 
     * @param {String} contentText 
     * @param {String} footer
     * @param {Buffer|String} buffer 
     * @param {String[]} buttons 
     * @param {Object} quoted 
     * @param {Object} options 
     */
     
     conn.sendButtonImg = async (jid, buffer, contentText, footerText, button1, id1, quoted, options) => {
        let type = await conn.getFile(buffer)
        let { res, data: file } = type
        if (res && res.status !== 200 || file.length <= 65536) {
        try { throw { json: JSON.parse(file.toString()) } }
        catch (e) { if (e.json) throw e.json }
        }
        const buttons = [
        { buttonId: id1, buttonText: { displayText: button1 }, type: 1 }
        ]

        const buttonMessage = {
            image: file,
            fileLength: 800000000000000,
            caption: contentText,
            footer: footerText,
            mentions: await conn.parseMention(contentText + footerText),
            ...options,
            buttons: buttons,
            headerType: 4
        }

        return await conn.sendMessage(jid, buttonMessage, { quoted, ephemeralExpiration: 86400, contextInfo: { mentionedJid: conn.parseMention(contentText + footerText) }, ...options })
    }
    conn.send2ButtonImg = async (jid, buffer, contentText, footerText, button1, id1, button2, id2, quoted, options) => {
        let type = await conn.getFile(buffer)
        let { res, data: file } = type
        if (res && res.status !== 200 || file.length <= 65536) {
        try { throw { json: JSON.parse(file.toString()) } }
        catch (e) { if (e.json) throw e.json }
        }
        const buttons = [
        { buttonId: id1, buttonText: { displayText: button1 }, type: 1 },
        { buttonId: id2, buttonText: { displayText: button2 }, type: 1 }
        ]

        const buttonMessage = {
            image: file,
            fileLength: 800000000000000,
            caption: contentText,
            footer: footerText,
            mentions: await conn.parseMention(contentText + footerText),
            ...options,
            buttons: buttons,
            headerType: 4
        }

        return await conn.sendMessage(jid, buttonMessage, { quoted, ephemeralExpiration: 86400, contextInfo: { mentionedJid: conn.parseMention(contentText + footerText) }, ...options })
    }
    conn.send3ButtonImg = async (jid, buffer, contentText, footerText, button1, id1, button2, id2, button3, id3, quoted, options) => {
        let type = await conn.getFile(buffer)
        let { res, data: file } = type
        if (res && res.status !== 200 || file.length <= 65536) {
        try { throw { json: JSON.parse(file.toString()) } }
        catch (e) { if (e.json) throw e.json }
        }
        const buttons = [
        { buttonId: id1, buttonText: { displayText: button1 }, type: 1 },
        { buttonId: id2, buttonText: { displayText: button2 }, type: 1 },
        { buttonId: id3, buttonText: { displayText: button3 }, type: 1 }
        ]

        const buttonMessage = {
            image: file,
            fileLength: 800000000000000,
            caption: contentText,
            footer: footerText,
            mentions: await conn.parseMention(contentText + footerText),
            ...options,
            buttons: buttons,
            headerType: 4
        }

        return await conn.sendMessage(jid, buttonMessage, { quoted, ephemeralExpiration: 86400, contextInfo: { mentionedJid: conn.parseMention(contentText + footerText) }, ...options })
    }
  
    // const { generateWAMessageFromContent, proto } = require('@adiwajshing/baileys-md')
    // const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    //     templateMessage: {
    //         hydratedTemplate: {
    //             hydratedContentText: 'Testing',
    //             hydratedButtons: [{
    //                 urlButton: {
    //                     displayText: 'test',
    //                     url: 'whatsapp://send?text=HI'
    //                 }
    //             }, {
    //                 callButton: {
    //                     displayText: 'call ...',
    //                     phoneNumber: '+62 8733'
    //                 }
    //             },
    //             {
    //                 quickReplyButton: {

    //                     displayText: 'Hii',
    //                     id: 'id1'
    //                 }
    //             }
    //             ]
    //         }
    //     }
    // }), { userJid: m.sender, quoted: m });
    // return await conn.relayMessage(
    //     m.chat,
    //     template.message,
    //     { messageId: template.key.id }
    // )
    // templateMessage: {
    //     hydratedTemplate: {
    //       hydratedContentText: text.trim(),
    //       hydratedButtons: [{
    //         urlButton: {
    //           displayText: 'RestApi',
    //           url: 'https://api.dhamzxploit.my.id'
    //         }

    //       },
    //           {
    //         callButton: {
    //           displayText: 'Call Me',
    //           phoneNumber: '+6285294959195'
    //         }
    //       },
    //           {
    //         quickReplyButton: {
    //           displayText: 'BUTTON 1 ',
    //           id: '.ping'
    //         }

    //       },
    //           {
    //         quickReplyButton: {
    //           displayText: 'BUTTON 2',
    //           id: '.ping'
    //         }

    //       },
    //           {
    //         quickReplyButton: {
    //           displayText: 'BUTTON 3',
    //           id: '.ping'
    //         }

    //       }]
    //     }
    //   }
    // }), { userJid: m.sender, quoted: m });
    // return await conn.relayMessage(
    //   m.chat,
    //   template.message,
    //   { messageId: template.key.id }
    // )
    
    /**
    * cMod
    * @param {String} jid 
    * @param {*} message 
    * @param {String} text 
    * @param {String} sender 
    * @param {*} options 
    * @returns 
    */

    conn.sendButtons = async (jid, contentText, footer, buffer, buttons, quoted, options) => {
        if (buffer) try { buffer = (await conn.getFile(buffer)).data } catch { buffer = null }
        
        let data = JSON.parse(JSON.stringify(buttons))
        const buttonList = []
        for(let i=1; i<Object.keys(buttons).length;i++){
      	  buttonList[i-1] = {buttonId: data['row['+i+']'], buttonText: {displayText: data['button['+i+']']}, type: 1}
        }
        const butt = { buttons: buttonList }
        
        let message = {
            ...options,
            ...(buffer ? { caption: contentText || '' } : { text: contentText || '' }),
            footer,
            buttons: [ butt ],
            ...(buffer ? { image: buffer } : {})
        }
        return await conn.sendMessage(jid, message, {
            quoted,
            upload: conn.waUploadToServer,
            ...options
        })
    }
    //buttons.map(btn => {
     //          return {
    //                buttonId: btn[1] || btn[0] || '',
    //               buttonText: {
    //                  displayText: btn[0] || btn[1] || ''
     //               }
     //           }
     //       })
    // const { generateWAMessageFromContent, proto } = require('@adiwajshing/baileys-md')
    // const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    //     templateMessage: {
    //         hydratedTemplate: {
    //             hydratedContentText: 'Testing',
    //             hydratedButtons: [{
    //                 urlButton: {
    //                     displayText: 'test',
    //                     url: 'whatsapp://send?text=HI'
    //                 }
    //             }, {
    //                 callButton: {
    //                     displayText: 'call ...',
    //                     phoneNumber: '+62 8733'
    //                 }
    //             },
    //             {
    //                 quickReplyButton: {

    //                     displayText: 'Hii',
    //                     id: 'id1'
    //                 }
    //             }
    //             ]
    //         }
    //     }
    // }), { userJid: m.sender, quoted: m });
    // return await conn.relayMessage(
    //     m.chat,
    //     template.message,
    //     { messageId: template.key.id }
    // )
    // templateMessage: {
    //     hydratedTemplate: {
    //       hydratedContentText: text.trim(),
    //       hydratedButtons: [{
    //         urlButton: {
    //           displayText: 'RestApi',
    //           url: 'https://api.dhamzxploit.my.id'
    //         }

    //       },
    //           {
    //         callButton: {
    //           displayText: 'Call Me',
    //           phoneNumber: '+6285294959195'
    //         }
    //       },
    //           {
    //         quickReplyButton: {
    //           displayText: 'BUTTON 1 ',
    //           id: '.ping'
    //         }

    //       },
    //           {
    //         quickReplyButton: {
    //           displayText: 'BUTTON 2',
    //           id: '.ping'
    //         }

    //       },
    //           {
    //         quickReplyButton: {
    //           displayText: 'BUTTON 3',
    //           id: '.ping'
    //         }

    //       }]
    //     }
    //   }
    // }), { userJid: m.sender, quoted: m });
    // return await conn.relayMessage(
    //   m.chat,
    //   template.message,
    //   { messageId: template.key.id }
    // )

    /**
    * cMod
    * @param {String} jid 
    * @param {*} message 
    * @param {String} text 
    * @param {String} sender 
    * @param {*} options 
    * @returns 
    */
    
    conn.cMod = (jid, message, text = '', sender = conn.user.jid, options = {}) => {
        let copy = message
        let mtype = Object.keys(copy.message)[0]
        let isEphemeral = false // mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') msg[mtype] = { ...content, ...options }
        if (copy.participant) sender = copy.participant = sender || copy.participant
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
        copy.key.remoteJid = jid
        copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
        return proto.WebMessageInfo.fromObject(copy)
    }

    /**
     * Exact Copy Forward
     * @param {String} jid
     * @param {Object} message
     * @param {Boolean|Number} forwardingScore
     * @param {Object} options
     */
    conn.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
        let m = generateForwardMessageContent(message, !!forwardingScore)
        let mtype = Object.keys(m)[0]
        if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
        m = generateWAMessageFromContent(jid, m, { ...options, userJid: conn.user.id })
        await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
        return m
    }
    /**
     * Download media message
     * @param {Object} m
     * @param {String} type 
     * @param {fs.PathLike|fs.promises.FileHandle} filename
     * @returns {Promise<fs.PathLike|fs.promises.FileHandle|Buffer>}
     */
    conn.downloadM = async (m, type, filename = '') => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        if (filename) await fs.promises.writeFile(filename, buffer)
        return filename && fs.existsSync(filename) ? filename : buffer
    }

    /**
     * Read message
     * @param {String} jid 
     * @param {String|undefined|null} participant 
     * @param {String} messageID 
     */
    conn.chatRead = async (jid, participant, messageID) => {
        return await conn.sendReadReceipt(jid, participant, [messageID])
    }

    /**
     * Parses string into mentionedJid(s)
     * @param {String} text
     */
    conn.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    
    /**
    * Sudo Message
    * @param {String} jid
    * @param {String} jidGroup
    * @param {String} text
    * @param {Array} {...opt}
    */
    
    conn.sudoMessage = async function(jid, jidGroup, text, {...opt}) {
    	let M = proto.WebMessageInfo
        let parti = opt.parti ? opt.parti : undefined //sender
        let teks = await proto.Message.fromObject({
        	conversation: text
        })
        let name = opt.name ? opt.name : conn.getName(opt.parti)
        let m = [{
            	key: {
        	        remoteJid: jidGroup, 
                    fromMe: opt.me,
                    id: opt.idM, 
                    participant: parti
                }, 
                pushName: name,
                message: teks
            }]
        conn.ev.emit('messages.upsert', { messages: m, type: 'notify'})
        return m
    }
    
        /**
     * Send Buttons
     * @param {String} jid
     * @param {String} content
     * @param {String} footer
     * @param {Array} list => { "row[0]": '', "button[0]": '' } <= 
     * @param {Object} quoted
     * @param {Object} options
     * @param {String} type
     * @param {Buffer|Url} url
     */
    conn.sendButton = async (jid, content, footer, list = {}, quoted, options = {}, type, url) => {
      let buffer = null
      if (url) try { buffer = (await conn.getFile(url)).data } catch { buffer = null }
      try{ let data = JSON.parse(JSON.stringify(list))
      const buttonList = []
      for(let i=0; i<(Object.keys(list).length / 2);i++){
      	buttonList[i] = {buttonId: data['row['+i+']'], buttonText: {displayText: data['button['+i+']']}, type: 1}
      }
      let buttonString = JSON.stringify(buttonList)
      if(type === 'image'){
      	conn.sendMessage(jid, {
      	  image: buffer, 
            buttons: buttonList, 
            caption: content,
            footer: footer,
            headerType: 4,
            ...options
          }, { quoted })
     } else if(type === 'location'){
      	conn.sendMessage(jid, {
      	  location: { jpegThumbnail: buffer }, 
            buttons: buttonList, 
            caption: content,
            footer: footer,
            headerType: 6,
            jpegThumbnail: buffer, 
            ...options
          }, { quoted })
     } else if(type === 'video'){
     	conn.sendMessage(jid, {
      	  video: buffer, 
            buttons: buttonList, 
            caption: content,
            footer: footer,
            headerType: 4,
            ...options
          }, { quoted })
    } else {
        conn.sendMessage(jid, {
          buttons: buttonList, 
          text: content,
          footer: footer,
          headerType: 1, 
          ...options
        }, { quoted }
   //, { quoted, ...options }
     ) } } catch (e) { console.log('Error: '+ e) }
    }
    
    /**
     * Send Button with Image
     * @param {String} jid
     * @param {String|Buffer} urls
     * @param {String} content
     * @param {String} footer
     * @param {Array} list => { "row[0]": '', "button[0]": '' } <=
     * @param {Object} quoted
     * @param {Object} options
     */
    conn.sendButtonImg = async(jid, buffer, content, footer, list = {}, quoted, options = {}) => {
      const buttonList = []
      for(let i=1; i<list.length;i++){
      	buttonList[i] = {buttonId: list.row[i], buttonText: {displayText: list.button[i]}, type: 1}
      }
      return await conn.sendMessage(jid, {
        caption: content,
        footerText: footer,
        buttons: buttonList,
        headerType: 4,
        image: buffer
      }, {
        quoted, ...options
      })
    }
    
    /**
     * Send Button with Video
     * @param {String} jid
     * @param {String|Buffer} buffer
     * @param {String} content
     * @param {String} footer
     * @param {Array} list => { "row[0]": '', "button[0]": '' } <= 
     * @param {Object} quoted
     * @param {Object} options
     */
    
    conn.sendButtonVid = async(jid, buffer, content, footer, list = {}, quoted, options = {}) => {
      const buttonList = []
      for(let i=1; i<list.length;i++){
      	buttonList[i] = {buttonId: list.row[i], buttonText: {displayText: list.button[i]}, type: 1}
      }
      return await conn.sendMessage(jid, {
        caption: content,
        footerText: footer,
        buttons: buttonList,
        headerType: 4,
        video: buffer
      }, {
        quoted, ...options
      })
    }

    /**
   * send Button Loc
   * @param {String} jid
   * @param {String} contentText
   * @param {String} footer
   * @param {Buffer|String} buffer
   * @param {String[]} buttons
   * @param {Object} quoted
   * @param {Object} options
   */
  conn.sendButtonLoc = async (
    jid,
    buffer,
    content,
    footer,
    button1,
    row1,
    quoted,
    options = {}
  ) => {
    let type = await conn.getFile(buffer);
    let { res, data: file } = type;
    if ((res && res.status !== 100) || file.length <= 100) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let buttons = [
      { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
    ];

    let buttonMessage = {
      location: { jpegThumbnail: file },
      caption: content,
      footer: footer,
      mentions: await conn.parseMention(content + footer),
      ...options,
      buttons: buttons,
      headerType: 6,
    };
    return await conn.sendMessage(jid, buttonMessage, {
      quoted,
      upload: conn.waUploadToServer,
      ephemeralExpiration: 86400,
      mentions: await conn.parseMention(content + footer),
      ...options,
    });
  };
  conn.send2ButtonLoc = async (
    jid,
    buffer,
    content,
    footer,
    button1,
    row1,
    button2,
    row2,
    quoted,
    options = {}
  ) => {
    let type = await conn.getFile(buffer);
    let { res, data: file } = type;
    if ((res && res.status !== 50) || file.length <= 50) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let buttons = [
      { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
      { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
    ];

    let buttonMessage = {
      location: { jpegThumbnail: file },
      caption: content,
      footer: footer,
      mentions: await conn.parseMention(content + footer),
      ...options,
      buttons: buttons,
      headerType: 6,
    };
    return await conn.sendMessage(jid, buttonMessage, {
      quoted,
      upload: conn.waUploadToServer,
      ephemeralExpiration: 86400,
      mentions: await conn.parseMention(content + footer),
      ...options,
    });
  };
  conn.send3ButtonLoc = async (
    jid,
    buffer,
    content,
    footer,
    button1,
    row1,
    button2,
    row2,
    button3,
    row3,
    quoted,
    options = {}
  ) => {
    let type = await conn.getFile(buffer);
    let { res, data: file } = type;
    if ((res && res.status !== 100) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let buttons = [
      { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
      { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
      { buttonId: row3, buttonText: { displayText: button3 }, type: 1 },
    ];

    let buttonMessage = {
      location: { jpegThumbnail: file },
      caption: content,
      footer: footer,
      mentions: await conn.parseMention(content + footer),
      ...options,
      buttons: buttons,
      headerType: 6,
    };
    return await conn.sendMessage(jid, buttonMessage, {
      quoted,
      upload: conn.waUploadToServer,
      ephemeralExpiration: 86400,
      mentions: await conn.parseMention(content + footer),
      ...options,
    });
  };
      /**
   * send Button Document
   * @param {String} jid
   * @param {String} contentText
   * @param {String} footer
   * @param {Buffer|String} buffer
   * @param {String[]} buttons
   * @param {Object} quoted
   * @param {Object} options
   */
  conn.sendButtonDoc = async (
    jid,
    content,
    footerText,
    button1,
    id1,
    quoted,
    options
  ) => {
    const buttons = [
      { buttonId: id1, buttonText: { displayText: button1 }, type: 1 },
    ];
    const buttonMessage = {
      document: bg,
      mimetype: doc,
      fileName: ucapan,
      fileLength: 887890909999999,
      pageCount: 1234567890123456789012345,
      caption: content,
      footer: footerText,
      mentions: await conn.parseMention(content + footerText),
      ...options,
      buttons: buttons,
      headerType: 1,
    };
    conn.sendMessage(jid, buttonMessage, {
      quoted,
      ephemeralExpiration: 86400,
      forwardingScore: 99999,
      isForwarded: true,
      ...options,
    });
  };

  conn.send2ButtonImgDoc = async (
    jid,
    buffer,
    contentText,
    footerText,
    button1,
    id1,
    button2,
    id2,
    quoted,
    options
  ) => {
    let type = await conn.getFile(buffer);
    let { res, data: file } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    const buttons = [
      { buttonId: id1, buttonText: { displayText: button1 }, type: 1 },
      { buttonId: id2, buttonText: { displayText: button2 }, type: 1 },
    ];

    const buttonMessage = {
      document: bg,
      mimetype: doc,
      fileName: "✿.｡.:*Fᴜʀʀʏ Ьǫʈ*:.｡.✿",
      fileLength: 887890909999999,
      pageCount: 1234567890123456789012345,
      fileLength: 887890909999999,
      caption: contentText,
      footer: footerText,
      mentions: await conn.parseMention(contentText + footerText),
      jpegThumbnail: file,
      ...options,
      buttons: buttons,
      headerType: 4,
    };

    return await conn.sendMessage(jid, buttonMessage, {
      quoted,
      ephemeralExpiration: 86400,
      contextInfo: {
        mentionedJid: conn.parseMention(contentText + footerText),
      },
      ...options,
    });
  };

  conn.send3ButtonImgDoc = async (
    jid,
    buffer,
    content,
    footer,
    button1,
    row1,
    button2,
    row2,
    button3,
    row3,
    quoted,
    options = {}
  ) => {
    let type = await conn.getFile(buffer);
    let { res, data: file } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let buttons = [
      { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
      { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
      { buttonId: row3, buttonText: { displayText: button3 }, type: 1 },
    ];

    const buttonMessage = {
      document: { url: "https://wa.me/6281320170984" },
      mimetype: global.doc,
      fileName: "✿.｡.:*Fᴜʀʀʏ Ьǫʈ*:.｡.✿",
      fileLength: 887890909999999,
      pageCount: 1234567890123456789012345,
      caption: content,
      footer: footer,
      jpegThumbnail: file,
      mentions: await conn.parseMention(content + footerText),
      ...options,
      buttons: buttons,
      headerType: 1,
    };
    conn.sendMessage(jid, buttonMessage, {
      quoted,
      ephemeralExpiration: 86400,
      contextInfo: {
        mentionedJid: conn.parseMention(content + footerText),
        forwardingScore: 99999,
        isForwarded: true,
      },
      ...options,
      ephemeralExpiration: 86400,
    });
  };

    /**
     * send Button
     * @param {String} jid 
     * @param {String} contentText 
     * @param {String} footer
     * @param {Buffer|String} buffer 
     * @param {String[]} buttons 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendButton = async (jid, contentText, footer, buffer, buttons, quoted, options) => {
        if (buffer) try { buffer = (await conn.getFile(buffer)).data } catch { buffer = null }
        let message = {
            ...options,
            ...(buffer ? { caption: contentText || '' } : { text: contentText || '' }),
            footer,
            buttons: buttons.map(btn => {
                return {
                    buttonId: btn[1] || btn[0] || '',
                    buttonText: {
                        displayText: btn[0] || btn[1] || ''
                    }
                }
            }),
            ...(buffer ? { image: buffer } : {})
        }
        return await conn.sendMessage(jid, message, {
            quoted,
            upload: conn.waUploadToServer,
            ...options
        })
    }
    
   conn.sendBut = async(jid, content, footer, button1, row1, quoted) => {
	  const buttons = [
	  {buttonId: row1, buttonText: {displayText: button1}, type: 1}
	  ]
const buttonMessage = {
    text: content,
    footer: footer,
    buttons: buttons,
    headerType: 1,
    mentions: conn.parseMention(footer+content)
}
return await conn.sendMessage(jid, buttonMessage, {quoted})
  }
  
   conn.send2But = async(jid, content, footer, button1, row1, button2, row2, quoted) => {
	  const buttons = [
	   { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 }
	  ]
const buttonMessage = {
    text: content,
    footer: footer,
    buttons: buttons,
    headerType: 1
}
return await conn.sendMessage(jid, buttonMessage, {quoted})
  }
  
   conn.send3But = async(jid, content, footer,button1, row1, button2, row2, button3, row3, quoted) => {
	  const buttons = [
	  { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
          { buttonId: row3, buttonText: { displayText: button3 }, type: 1 }
	  ]
const buttonMessage = {
    text: content,
    footer: footer,
    buttons: buttons,
    headerType: 1
}
return await conn.sendMessage(jid, buttonMessage, {quoted})
  }
  conn.send4But = async(jid, content, footer,button1, row1, button2, row2, button3, row3, button4, row4, quoted) => {
    const buttons = [
    { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
        { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
        { buttonId: row3, buttonText: { displayText: button3 }, type: 1 },
        { buttonId: row4, buttonText: { displayText: button4 }, type: 1 }
    ]
const buttonMessage = {
  text: content,
  footer: footer,
  buttons: buttons,
  headerType: 1
}
return await conn.sendMessage(jid, buttonMessage, {quoted})
}    
    /**
     * Get name from jid
     * @param {String} jid
     * @param {Boolean} withoutContact
     */
    conn.getName = (jid, withoutContact = false) => {
    	
        jid = conn.decodeJid(jid)
        withoutContact = this.withoutContact || withoutContact
        let v
        if (jid.endsWith('@g.us')) {
            v = conn.contacts[jid] || {}
            if (!(v.name || v.subject)) v = conn.groupMetadata(jid).then((data) => { return data }) || {}
            return (v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
        }
        else v = jid === '0@s.whatsapp.net' ? {
            jid,
            vname: 'WhatsApp'
        } : jid === conn.user.jid ?
            conn.user :
            (conn.contacts[jid] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    conn.saveName = async (id, name = '') => {
        if (!id) return
        id = conn.decodeJid(id)
        let isGroup = id.endsWith('@g.us')
        if (id in conn.contacts && conn.contacts[id][isGroup ? 'subject' : 'name'] && id in conn.chats) return
        let metadata = {}
        if (isGroup) metadata = await conn.groupMetadata(id)
        let chat = { ...(conn.contacts[id] || {}), id, ...(isGroup ? { subject: metadata.subject, desc: metadata.desc, metadata } : { name }) }
        conn.contacts[id] = chat
        conn.chats[id] = chat
    }
    
    conn.addReact = function react(id, key, text, isQuoted){
    	let keys = key
    	if (isQuoted) {
    	    keys = keys.key
            keys.participant = key.participant
        }
    	conn.sendMessage(id, { react: { text: text, key: keys }})
    }

    conn.pushMessage = (m) => {
        if (['senderKeyDistributionMessage', 'protocolMessage'].includes(m.mtype)) return 
        let id = m.chat
        let chats = conn.chats[id]
        if (!chats) chats = { id }
        if (!chats.messages) chats.messages = {}
        chats.messages[m.id] = JSON.stringify(m, null, 2)
    }

    conn.getBusinessProfile = async (jid) => {
        const results = await conn.query({
            tag: 'iq',
            attrs: {
                to: 's.whatsapp.net',
                xmlns: 'w:biz',
                type: 'get'
            },
            content: [{
                tag: 'business_profile',
                attrs: { v: '244' },
                content: [{
                    tag: 'profile',
                    attrs: { jid }
                }]
            }]
        })
        const profiles = getBinaryNodeChild(getBinaryNodeChild(results, 'business_profile'), 'profile')
        if (!profiles) return {} // if not bussines
        const address = getBinaryNodeChild(profiles, 'address')
        const description = getBinaryNodeChild(profiles, 'description')
        const website = getBinaryNodeChild(profiles, 'website')
        const email = getBinaryNodeChild(profiles, 'email')
        const category = getBinaryNodeChild(getBinaryNodeChild(profiles, 'categories'), 'category')
        return {
            jid: profiles.attrs?.jid,
            address: address?.content.toString(),
            description: description?.content.toString(),
            website: website?.content.toString(),
            email: email?.content.toString(),
            category: category?.content.toString(),
        }
    }
    /**
     * Serialize Message, so it easier to manipulate
     * @param {Object} m
     */
    conn.serializeM = (m) => {
        return exports.smsg(conn, m)
    }

    Object.defineProperty(conn, 'name', {
        value: 'WASocket',
        configurable: true,
    })
    return conn
}
/**
 * Serialize Message
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {Boolean} hasParent 
 */
exports.smsg = (conn, m, hasParent) => {
    if (!m) return m
    let M = proto.WebMessageInfo
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id && m.id.length === 16 || false
        m.chat = conn.decodeJid(m.key.remoteJid || m.msg && m.msg.groupId || '')
        m.isGroup = m.chat.endsWith('@g.us')
        m.fromMe = m.key.fromMe
        m.sender = conn.decodeJid(m.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
    }
    if (m.message) {
        m.mtype = Object.keys(m.message)[0]
        m.msg = m.message[m.mtype]
        if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = m.sender
        // if (m.mtype === 'ephemeralMessage') {
        //     exports.smsg(conn, m.msg)
        //     m.mtype = m.msg.mtype
        //     m.msg = m.msg.msg
        //   }
        if (m.mtype == 'protocolMessage') {
        	//if (typeof m.msg !== 'object') { conn.reply('120363039892334404@g.us', 'Error: '+JSON.stringify(m.msg)) }
            if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
            if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
            m.msg.key.fromMe = conn.decodeJid(m.msg.key.participant) === conn.decodeJid(conn.user.id)
            if (!m.msg.key.fromMe && m.msg.key.remoteJid === conn.decodeJid(conn.user.id)) m.msg.key.remoteJid = m.sender
        }
        m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || ''
        if(m.text.length > 1000){ 
            console.log('Too Many Text')
            return false
        }
        m.mentionedJid = m.msg && m.msg.contextInfo && m.msg.contextInfo.mentionedJid && m.msg.contextInfo.mentionedJid.length && m.msg.contextInfo.mentionedJid || []
        let quoted = m.quoted = m.msg && m.msg.contextInfo && m.msg.contextInfo.quotedMessage ? m.msg.contextInfo.quotedMessage : null
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = conn.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
            m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
            m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
            m.quoted.fromMe = m.quoted.sender === conn.user.jid
            m.quoted.text = m.quoted.text || m.quoted.caption || ''
            m.quoted.mentionedJid = m.quoted.contextInfo && m.quoted.contextInfo.mentionedJid && m.quoted.contextInfo.mentionedJid.length && m.quoted.contextInfo.mentionedJid || []
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    fromMe: m.quoted.fromMe,
                    remoteJid: m.quoted.chat,
                    id: m.quoted.id,
                    participant: m.quoted.sender
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            })
            m.getQuotedObj = m.getQuotedMessage = () => {
                if (!m.quoted.id) return false
                let q = ((conn.chats[m.quoted.chat] || {}).messages || {})[m.quoted.id]
                return exports.smsg(conn, q ? q : vM)
            }

            if (m.quoted.url || m.quoted.directPath) m.quoted.download = () => conn.downloadM(m.quoted, m.quoted.mtype.toLowerCase().replace(/message/i, ''))

            /**
             * Reply to quoted message
             * @param {String|Object} text
             * @param {String|false} chatId
             * @param {Object} options
             */
            m.quoted.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, vM, options)

            /**
             * Copy quoted message
             */
            m.quoted.copy = () => exports.smsg(conn, M.fromObject(M.toObject(vM)))

            /**
             * Exact Forward quoted message
             * @param {String} jid
             * @param {Boolean|Number} forceForward
             * @param {Object} options
            */
            m.quoted.copyNForward = (jid, forceForward = true, options = {}) => conn.copyNForward(jid, vM, forceForward, options)

            /**
             * Delete quoted message
             */
            m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key })
        }
    }
    let names
    if(m.pushName) names = m.pushName
    else names = conn.getName(m.sender)
    m.name = names
    if (m.msg && m.msg.url) m.download = () => conn.downloadM(m.msg, m.mtype.toLowerCase().replace(/message/i, ''))
    /**
     * Reply to this message
     * @param {String|Object} text
     * @param {String|false} chatId
     * @param {Object} options
     */
    m.reply = function reply(text, chatId, options) { conn.reply(chatId ? chatId : m.chat, text, m, options) }

    /**
     * Exact Forward this message
     * @param {String} jid
     * @param {Boolean} forceForward
     * @param {Object} options
     */
    m.copyNForward = function copyNForward(jid = m.chat, forceForward = true, options = {}) { conn.copyNForward(jid, m, forceForward, options) }

    /**
     * Modify this Message
     * @param {String} jid 
     * @param {String} text 
     * @param {String} sender 
     * @param {Object} options 
     */
    m.cMod = function cMod(jid, text = '', sender = m.sender, options = {}) { conn.cMod(jid, m, text, sender, options) }

    /**
     * Delete this message
     */
    m.delete = function Delete() { conn.sendMessage(m.chat, { delete: m.key }) }
    
    /**
    * Sudo Message Help
    */
    m.sudoMessage = function sudoMessage(sender, jid, text, opt = {}) { conn.sudoMessage(sender, jid, text, { parti: opt.parti }) }

    try {
        conn.saveName(m.sender, m.name)
        conn.pushMessage(m)
        if (m.isGroup) conn.saveName(m.chat)
        if (m.msg && m.mtype == 'protocolMessage' && m.msg.type === 'REVOKE') conn.ev.emit('message.delete', m.key)
    } catch (e) {
        console.error(e)
    }
    return m
}

exports.logic = (check, inp, out) => {
    if (inp.length !== out.length) throw new Error('Input and Output must have same length')
    for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i]
    return null
}