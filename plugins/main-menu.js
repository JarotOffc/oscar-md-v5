// kasih kredit bang lu kira coding gampang:)

const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let levelling = require('../lib/levelling')
let tags = {
'daftar': 'Daftar',
  'rpg': 'Rpg',
  'game': 'Game',
  'xp': 'Exp, Limit & Pay',
  'sticker': 'Sticker',
  'main': 'Main',
  'kerang': 'Kerang Ajaib',
  'quotes': 'Quotes',
  'admin': 'Admin',
  'group': 'Group',
  'internet': 'Internet',
  'anonymous': 'Anonymous Chat',
  'downloader': 'Downloader',
  'berita': 'Berita',
  'tools': 'Tools',
  'fun': 'Fun',
  'database': 'Database', 
  'vote': 'Voting',
  'absen': 'Absen',
  'catatan': 'Catatan',
  'jadian': 'Jadian',
  'islami': 'Islami',
  'owner': 'Owner',
  'advanced': 'Advanced',
  'info': 'Info',
  'audio': 'Audio',
  'maker': 'Maker',
}
const defaultMenu = {
  before: `  *┄┄┄┅┅❑ 𝐉𝐚𝐫𝐨𝐭 𝐎𝐟𝐟𝐜 ❑┅┅┄┄┄*
┏─────────────────⬣
┆ 𝑯𝒂𝒊, %ucapan %name!👋
┗┬──────────────┈ ⳹
┏┆♠︎ *Limit:* : %limit
┆┆♠︎ *Level:* : %level
┆┆♠︎ *XP:* : %exp
┗┬──────────────┈ ⳹
┏┤   *𝐊𝐚𝐥𝐞𝐧𝐝𝐞𝐫*
┆┗──────────────┈ ⳹
┆♠︎ *Hari:* : %week
┆♠︎ *Tanggal:* : %date
┆♠︎ *Waktu Wib* : %wib 
┆♠︎ *Waktu Wita* : %wita 
┆♠︎ *Waktu Wit* : %wit 
┗┬──────────────┈ ⳹
┏┤ *𝐁𝐨𝐭 𝐈𝐧𝐟𝐨*
┆┗──────────────┈ ⳹
┆♠︎ *Limit* : Ⓛ 
┆♠︎ *Premium* : Ⓟ
┆♠︎ *Uptime:* : %uptime (%muptime)
┆♠︎ *Penulis Ulang:* 𝐉𝐚𝐫𝐨𝐭 𝐎𝐟𝐟𝐜
┗─────────────────⬣
%readmore`.trimStart(),
  header: '╔═❖〔 %category 〕❖════╗\n┃',
  body: '┃➺ %cmd %islimit %isPremium',
  footer: '┃\n╚══════════❖\n', 
  after: `*Made by ♡*
*%npmname* | %version
${'```%npmdesc```'}
`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
    const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
    const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      ucapan: ucapan(),
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, wib, wit, wita, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
   text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
       
    //----------------- FAKE
    let ftoko = {
    key: {
    fromMe: false,
    participant: `${m.sender.split`@`[0]}` + '@s.whatsapp.net',
    remoteJid: 'status@broadcast',
  },
  message: {
  "productMessage": {
  "product": {
  "productImage":{
  "mimetype": "image/jpeg",
  "jpegThumbnail": fs.readFileSync('./thumbnail.jpg'),
    },
  "title": `${ucapan()}`,
  "description": wm,
  "currencyCode": "US",
  "priceAmount1000": "100",
  "retailerId": wm,
  "productImageCount": 999
        },
  "businessOwnerJid": `${m.sender.split`@`[0]}@s.whatsapp.net`
  }
  }
  } 
//----------[ FAKE TROLI ]--------//
// Mampus gua enc By Jarot
const _0x38cd6a=_0x5d98;function _0x5d98(_0x25e3e9,_0x34161d){const _0x351343=_0x4912();return _0x5d98=function(_0x236230,_0x22249f){_0x236230=_0x236230-0x123;let _0x211530=_0x351343[_0x236230];return _0x211530;},_0x5d98(_0x25e3e9,_0x34161d);}(function(_0x336a38,_0x57182b){const _0x44c153=_0x5d98,_0x53eda6=_0x336a38();while(!![]){try{const _0x5c1dce=parseInt(_0x44c153(0x145))/0x1*(-parseInt(_0x44c153(0x138))/0x2)+parseInt(_0x44c153(0x127))/0x3*(-parseInt(_0x44c153(0x130))/0x4)+-parseInt(_0x44c153(0x12b))/0x5*(-parseInt(_0x44c153(0x126))/0x6)+-parseInt(_0x44c153(0x144))/0x7+-parseInt(_0x44c153(0x148))/0x8*(-parseInt(_0x44c153(0x13a))/0x9)+-parseInt(_0x44c153(0x14b))/0xa*(-parseInt(_0x44c153(0x146))/0xb)+parseInt(_0x44c153(0x143))/0xc;if(_0x5c1dce===_0x57182b)break;else _0x53eda6['push'](_0x53eda6['shift']());}catch(_0x3e9b7b){_0x53eda6['push'](_0x53eda6['shift']());}}}(_0x4912,0xd2ae1));const _0x1d6ed6=(function(){let _0x44cc66=!![];return function(_0x166e97,_0x167e38){const _0x46a576=_0x44cc66?function(){const _0x1244ab=_0x5d98;if(_0x167e38){const _0xaea7de=_0x167e38[_0x1244ab(0x14e)](_0x166e97,arguments);return _0x167e38=null,_0xaea7de;}}:function(){};return _0x44cc66=![],_0x46a576;};}()),_0x49cc69=_0x1d6ed6(this,function(){const _0x2ebf76=_0x5d98;return _0x49cc69[_0x2ebf76(0x12f)]()['search'](_0x2ebf76(0x14c))[_0x2ebf76(0x12f)]()[_0x2ebf76(0x124)](_0x49cc69)[_0x2ebf76(0x13d)]('(((.+)+)+)+$');});_0x49cc69();const _0x22249f=(function(){let _0x45f88b=!![];return function(_0xf3aef0,_0x1a58eb){const _0x5a679e=_0x45f88b?function(){const _0x28b6af=_0x5d98;if(_0x1a58eb){const _0x3949c2=_0x1a58eb[_0x28b6af(0x14e)](_0xf3aef0,arguments);return _0x1a58eb=null,_0x3949c2;}}:function(){};return _0x45f88b=![],_0x5a679e;};}()),_0x236230=_0x22249f(this,function(){const _0x5b3ab1=_0x5d98;let _0x15c10b;try{const _0x55fc6d=Function('return\x20(function()\x20'+_0x5b3ab1(0x123)+');');_0x15c10b=_0x55fc6d();}catch(_0x9947ce){_0x15c10b=window;}const _0x1cb906=_0x15c10b['console']=_0x15c10b[_0x5b3ab1(0x131)]||{},_0x1b1760=[_0x5b3ab1(0x147),_0x5b3ab1(0x132),_0x5b3ab1(0x133),_0x5b3ab1(0x12e),'exception',_0x5b3ab1(0x128),'trace'];for(let _0x355e33=0x0;_0x355e33<_0x1b1760[_0x5b3ab1(0x140)];_0x355e33++){const _0x55de4d=_0x22249f['constructor'][_0x5b3ab1(0x141)][_0x5b3ab1(0x13c)](_0x22249f),_0x58db7d=_0x1b1760[_0x355e33],_0xc289d3=_0x1cb906[_0x58db7d]||_0x55de4d;_0x55de4d['__proto__']=_0x22249f[_0x5b3ab1(0x13c)](_0x22249f),_0x55de4d[_0x5b3ab1(0x12f)]=_0xc289d3[_0x5b3ab1(0x12f)]['bind'](_0xc289d3),_0x1cb906[_0x58db7d]=_0x55de4d;}});_0x236230();let ftroli={'key':{'participant':_0x38cd6a(0x14d)},'message':{'orderMessage':{'itemCount':0x1,'status':0x1,'surface':0x1,'message':'Jarot\x20offc','orderTitle':_0x38cd6a(0x137),'thumbnail':fs['readFileSync'](_0x38cd6a(0x149)),'sellerJid':_0x38cd6a(0x14d)}}},fkon={'key':{'fromMe':![],'participant':m[_0x38cd6a(0x12d)]['split']`@`[0x0]+_0x38cd6a(0x135),...m[_0x38cd6a(0x129)]?{'remoteJid':_0x38cd6a(0x13f)}:{}},'message':{'contactMessage':{'displayName':''+name,'vcard':'BEGIN:VCARD\x0aVERSION:3.0\x0aN:;a,;;;\x0aFN:'+name+_0x38cd6a(0x134)+m['sender'][_0x38cd6a(0x136)]('@')[0x0]+':'+m['sender'][_0x38cd6a(0x136)]('@')[0x0]+_0x38cd6a(0x13e)}}};function _0x4912(){const _0x56e69e=['console','warn','info','\x0aitem1.TEL;waid=','@s.whatsapp.net','split','Bang','72FVUPLE','https://telegra.ph/file/4d31dbb49e9c8bcaa5914.jpg','98883MOLxwQ','𝙾𝚜𝚌𝚊𝚛-𝙼𝚞𝚕𝚝𝚒𝙳𝚎𝚟𝚒𝚌𝚎\x20','bind','search','\x0aitem1.X-ABLabel:Ponsel\x0aEND:VCARD','16504228206@s.whatsapp.net','length','prototype','.sc','8398692BtILZL','7140805nWnrsk','22169dQzpek','187bNewnT','log','688kgwZhb','thumbnail.jpg','ᴡʜᴀᴛsᴀᴘᴘ\x20ʙᴏᴛ\x20ʙᴀɪʟʏᴇs\x20𝚜𝚒𝚗𝚐𝚕𝚎\x20ᴀᴜᴛʜ','664370JFCWSX','(((.+)+)+)+$','0@s.whatsapp.net','apply','{}.constructor(\x22return\x20this\x22)(\x20)','constructor','https://instagram.com/jarotr_','726672oMmjKW','6kiSkZj','table','chat','.owner','40QIXKLC','buffer','sender','error','toString','2123908FXEKsd'];_0x4912=function(){return _0x56e69e;};return _0x4912();}await conn['send2ButtonImg'](m[_0x38cd6a(0x129)],await(await fetch('https://telegra.ph/file/5c56a3d8ef90a21eb9bb2.jpg'))['buffer'](),text,wm,'𝙿𝚎𝚖𝚒𝚕𝚒𝚔\x20𝙱𝚘𝚝',_0x38cd6a(0x12a),'𝚂𝚘𝚞𝚛𝚌𝚘𝚍𝚎',_0x38cd6a(0x142),m,{'quoted':fkon,'contextInfo':{'externalAdReply':{'showAdAttribution':!![],'title':'𝙾𝚜𝚌𝚊𝚛-𝙼𝚞𝚕𝚝𝚒𝙳𝚎𝚟𝚒𝚌𝚎\x20','body':_0x38cd6a(0x14a),'description':_0x38cd6a(0x13b),'mediaType':0x2,'thumbnail':await(await fetch(_0x38cd6a(0x139)))[_0x38cd6a(0x12c)](),'mediaUrl':_0x38cd6a(0x125)}}});
    /*conn.sendHydrated(m.chat, text.trim(), 'Ⓟ premium | Ⓛ limit', null, 'https://youtube.com/channel/UCW7iXlE7TgvJMIXQck4NYBQ', 'Website', '', '', [
      ['Donate', '/donasi'],
      ['Sewa Bot', '/sewa'],
      ['Owner', '/owner']
    ], m)*/
    /*let url = `https://telegra.ph/file/ab1df70dfd5c2bac64da1.jpg`.trim()
    let res = await fetch(url)
    let buffer = await res.buffer()
    let message = await prepareWAMessageMedia({ image: buffer }, { upload: conn.waUploadToServer })
                const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                    templateMessage: {
                        hydratedTemplate: {
                            imageMessage: message.imageMessage,
                            hydratedContentText: text.trim(),
                            hydratedFooterText:'Ⓟ premium | Ⓛ limit',
                            hydratedButtons: [{
                                urlButton: {
                                    displayText: '【𝙔𝙤𝙪𝙩𝙪𝙗𝙚⛽】',
                                    url: 'https://youtube.com/channel/UCW7iXlE7TgvJMIXQck4NYBQ'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '【𝙎𝙘𝙧𝙞𝙥𝙩🎗️】',
                                    id: '/sc'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '【𝙎𝙚𝙬𝙖🚀】',
                                    id: '/sewa'
                                }  
                            }, {
                                quickReplyButton: {
                                    displayText: '【𝙊𝙬𝙣𝙚𝙧🎀】',
                                    id: '/owner'
                                }
                            }]
                        }
                    }
                }), { userJid: m.chat, quoted: m })
                conn.relayMessage(m.chat, template.message, { messageId: template.key.id })*/
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['allmenu']
handler.tags = ['main']
handler.command = /^(allmenu|\?)$/i

handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
        const hour_now = moment.tz('Asia/Jakarta').format('HH')
        var ucapanWaktu = 'Pagi kak'
        if (hour_now >= '03' && hour_now <= '10') {
          ucapanWaktu = 'Pagi kak'
        } else if (hour_now >= '10' && hour_now <= '15') {
          ucapanWaktu = 'Siang kak'
        } else if (hour_now >= '15' && hour_now <= '17') {
          ucapanWaktu = 'Sore kak'
        } else if (hour_now >= '17' && hour_now <= '18') {
          ucapanWaktu = 'Selamat Petang kak'
        } else if (hour_now >= '18' && hour_now <= '23') {
          ucapanWaktu = 'Malam kak'
        } else {
          ucapanWaktu = 'Selamat Malam!'
        }	
        return ucapanWaktu
}