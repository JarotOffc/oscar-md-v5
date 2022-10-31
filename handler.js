let util = require('util')
let simple = require('./lib/simple')
let { MessageType, makeOrderedDictionary, delay } = require('@adiwajshing/baileys')

async function matchArray(newArray, lastArray){
    let res = []
	for(let i = 0; i < newArray.length; i++){
		if(!lastArray.includes(newArray[i])) res.push(newArray[i]) 
	}
	return res
}

async function pushArray(array, type){
	if(!array.toString()) return
	switch(type){
		case 'owner':
		    for(let i=0; i<array.length;i++){
			    global.owner.push(array[i])
			}
		break
		case 'police':
		    for(let i=0; i<array.length;i++){
			    global.police.push(array[i])
			}
		break
		case 'prems':
		    for(let i=0; i<array.length;i++){
			    global.prems.push(array[i])
			}
		break
	}
}

const isNumber = x => typeof x === 'number' && !isNaN(x)
//const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))
module.exports = {
  async handler(chatUpdate) {
    //console.log(conn.sender) 
    //if (chatUpdate.type == 'append')
    //console.log(chatUpdate)    
    let m = chatUpdate.messages[0]
    if (!m) return console.log('Undefined Message ' + m) 
    m = await simple.smsg(this, m)
    if(m == 'error') return
    try {
      switch (m.mtype) {
        case 'imageMessage':
        case 'videoMessage':
        case 'audioMessage':
          if (!m.key.fromMe) await delay(1000)
          if (!m.msg.url) await this.updateMediaMessage(m)
          break
      }
      m.exp = 0
      m.limit = false
      m.money = false
      m.spin = false
      m.uangkau = false
      try {
        let user = global.db.data.users[m.sender]
        if (typeof user !== 'object') global.db.data.users[m.sender] = {}
        if (user) {
          if (!isNumber(user.exp)) user.exp = 0
          if (! isNumber(user.spin)) user.spin = 10
          if (! isNumber(user.money)) user.money = 1000
          if (!isNumber(user.limit)) user.limit = 1000
          if (!user.acc) user.acc = false
          if (!user.acc) user.end = false
          if (!isNumber(user.lastclaim)) user.lastclaim = 0
          if (!isNumber(user.lastpremgift)) user.lastpremgift = 0
          if (!isNumber(user.lastpolicegift)) user.lastpolicegift = 0
          if (!isNumber(user.lastmembergift)) user.lastmembergift = 0
          if (!('registered' in user)) user.registered = false
          if (!user.registered) {
            if (!('name' in user)) user.name = this.getName(m.sender)
            if (!isNumber(user.age)) user.age = -1
            if (!isNumber(user.regTime)) user.regTime = -1
          }
          if(!user.raihan) user.raihan = false
          if (!isNumber(user.level)) user.level = 0
          if (! isNumber(user.hoki)) user.hoki = 1
          if (!isNumber(user.afk)) user.afk = -1
          if (!('afkReason' in user)) user.afkReason = ''
          if (!('banned' in user)) user.banned = false
          if (!('bannedReason' in user)) user.bannedReason = ''
          if (!isNumber(user.bannedDate)) user.bannedDate = 0
            if (!isNumber(user.bannedPoint)) user.bannedPoint = 0
          if (!isNumber(user.level)) user.level = 0
          if (!user.role) user.role = 'Biasa'
          if (!user.police) user.police = false
          if (!user.miningmode) user.miningmode = false
          if (!isNumber(user.warn)) user.warn = 0
          if (!user.huntmode) user.huntmode = false
          if (!user.rank) user.rank = ''
          if (!user.maxspin) user.maxspin = 0
          if (!isNumber(user.expired)) user.expired = -1
          if (!isNumber(user.expiredgroup)) user.expiredgroup = -1
          if (!user.id) user.id = ''
          if (!user.group) user.group = false
          if (!isNumber(user.joinlimit)) user.joinlimit = 100
          if (!('premium' in user) ) user.premium = false
          if (!('autolevelup' in user)) user.autolevelup = true
          if (!('owner' in user)) user.owner = false
          if(!('helper' in user)) user.helper = false
          if(!isNumber(user.verify)) user.verify = 0
          if(!('staff' in user)) user.staff = false
        } else global.db.data.users[m.sender] = {
          exp: 0,
          limit: 1000,
          money: 1000,
          spin: 10,
          hoki: 1,
          acc: false, 
          end: false, 
          raihan: false, 
          level: 0,
          maxspin: 0,
          lastclaim: 0,
          lastpremgift: 0,
          lastpolicegift: 0,
          lastmembergift: 0,
          registered: false,
          name: this.getName(m.sender),
          age: -1,
          regTime: -1,
          afk: -1,
          id: '', 
          group: false,
          joinlimit: 100,
          afkReason: '',
          warn: 0,
          banned: false,
          bannedDate: 0,
          bannedPoint: 0,
          police: false, 
          miningmode: false, 
          huntmode: false, 
          level: 0,
          expired: -1,
          expiredgroup: -1, 
          role: 'Biasa',
          owner: false,
          premium: false, 
          helper: false, 
          rank: '', 
          autolevelup: true,
          verify: 0,
          staff: false, 
          mt: false,
          bannedReason: ''
        }
        
        let invmenu = global.db.data.invmenu[m.sender] 
        if (typeof invmenu !== 'object') global.db.data.invmenu[m.sender] = {}
        if (invmenu) {
        	if(!isNumber(invmenu.xpfish)) invmenu.xpfish = 0
            if(!isNumber(invmenu.moneyfish)) invmenu.moneyfish = 0
        	if (!invmenu.normal) invmenu.normal = []
            if (!invmenu.rare) invmenu.rare = []
            if (!invmenu.legend) invmenu.legend = []
            if (!invmenu.mythic) invmenu.mythic = []
            if (!invmenu.rod) invmenu.rod = ['kayu']
            if (!isNumber(invmenu.levelbot)) invmenu.levelbot = 0
            if(!isNumber(invmenu.durability)) invmenu.durability = 100
            if(!isNumber(invmenu.salmon)) invmenu.salmon = 0
            if(!isNumber(invmenu.cod)) invmenu.cod = 0
            if(!isNumber(invmenu.sampah)) invmenu.sampah = 0
            if(!isNumber(invmenu.golden)) invmenu.golden = 0
            if(!isNumber(invmenu.puffer)) invmenu.puffer = 0
            if(!isNumber(invmenu.tropical)) invmenu.tropical = 0
            if (!invmenu.hancur) invmenu.hancur = false
            } else global.db.data.invmenu[m.sender] = {
            	xpfish: 0,
                moneyfish: 0,
                salmon: 0,
                cod: 0,
                tropical: 0,
                golden: 0,
                sampah: 0,
                puffer: 0,
                normal: [], 
                rare: [], 
                legend: [], 
                mythic: [], 
                levelbot: 0,
                rod: ['kayu'], 
                durability: 100,
                hancur: false
                }
        
        let pokemon = global.db.data.pokerole[m.sender] 
        if (typeof pokemon !== 'object') global.db.data.pokerole[m.sender] = {}
        if (pokemon) {
        	if(!pokemon.team) pokemon.team = ['']
                if(!pokemon.nameteam) pokemon.nameteam = ''
                if(!pokemon.room) pokemon.room = false
                if(!isNumber(pokemon.jumlah)) pokemon.jumlah = 0
        	if (!isNumber(pokemon.pokeball)) pokemon.pokeball = 10
                if (!isNumber(pokemon.greatball)) pokemon.greatball= 5
                if (!isNumber(pokemon.lupaanj)) pokemon.lupaanj = 0
                if (!isNumber(pokemon.attack)) pokemon.attack = 0
                if (!isNumber(pokemon.damage)) pokemon.damage = 0
                if (!pokemon.list) pokemon.list = ''
                if (!pokemon.item) pokemon.item = '' 
                if (!pokemon.item1) pokemon.item = ''
                if (!pokemon.item2) pokemon.item = ''
                if (!pokemon.item3) pokemon.item = ''
                if (!pokemon.pokemonxp1) pokemon.pokemonxp1 = ''
                if (!pokemon.pokemonxp2) pokemon.pokemonxp2 = ''
                if (!pokemon.pokemonxp3) pokemon.pokemonxp3 = ''
                if (!isNumber(pokemon.xppoke1)) pokemon.xppoke1 = 0
                if (!isNumber(pokemon.xppoke2)) pokemon.xppoke2 = 0
                if (!isNumber(pokemon.xppoke3)) pokemon.xppoke3 = 0
                if (!isNumber(pokemon.tierpoke1)) pokemon.tierpoke1 = 1
                if (!isNumber(pokemon.tierpoke2)) pokemon.tierpoke2 = 1
                if (!isNumber(pokemon.tierpoke3)) pokemon.tierpoke3 = 1
                if (!pokemon.claim) pokemon.claim = false
            } else global.db.data.pokerole[m.sender] = {
            	team: '',
                nameteam: this.getName(m.sender),
                pokeball: 10,
                greatball: 5,
                ball: 0,
                damage: 0,
                list: '',
                jumlah: 0,
                item: '', 
                item1: '', 
                item2: '', 
                item3: '', 
                pokemonxp1: '', 
                pokemonxp2: '', 
                pokemonxp3: '', 
                xppoke1: 0, 
                xppoke2: 0,
                xppoke3: 0, 
                tierpoke1: 1,
                tierpoke2: 1,
                tierpoke3: 1,
                claim: false, 
                room: false
                }
                
        //let ass = global.teks.data.promo
        //if (typeof ass !== 'object') global.teks.data.promo = {}
        //if (ass) {
         // if (!ass.texts) ass.texts= 'Tidak Ada Promo'
        //} else global.db.data.promo = {
          //texts: ''
        //}
        
        let chat = global.db.data.chats[m.chat]
        if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
        if (chat) {
          if (!('isBanned' in chat)) chat.isBanned = false
          if (!('welcome' in chat)) chat.welcome = true
          if (!('detect' in chat)) chat.detect = true
          if (!('sWelcome' in chat)) chat.sWelcome = ''
          if (!('sBye' in chat)) chat.sBye = ''
          if (!('sPromote' in chat)) chat.sPromote = 'Kamu Dah Premi'
          if (!('sDemote' in chat)) chat.sDemote = 'Kasihan jadi member'
          if (!('warn' in chat)) chat.warn = false
          if (!('expired' in chat)) chat.expired = 0
          if (!('mining' in chat)) chat.mining = false
          if (!('delete' in chat)) chat.delete = true
          if(!isNumber(chat.maxwarns)) chat.maxwarn = 3
          if (!('antiLink' in chat)) chat.antiLink = false
        } else global.db.data.chats[m.chat] = {
          isBanned: false,
          welcome: true,
          detect: true, 
          sWelcome: '',
          sBye: '',
          maxwarn: 3,
          sPromote: '',
          expired: 0,
          sDemote: '',
          warn: false, 
          delete: true,
          antiLink: false,
          mining: false, 
        }
      } catch (e) {
        console.error(e)
      }
      if (opts['nyimak']) return
      if (!m.fromMe && opts['self']) return
      if (opts['pconly'] && m.chat.endsWith('g.us')) return m.reply('Private Chat Only')
      if (opts['gconly'] && !m.chat.endsWith('g.us')) return m.reply('Group Chat Only')
      if (opts['swonly'] && m.chat !== 'status@broadcast') return
      if (typeof m.text !== 'string') m.text = ''
      for (let name in global.plugins) {
        let results
        let plugin = global.plugins[name]
        if (!plugin) continue
        if (plugin.disabled) continue
        if (!plugin.all) continue
        if (typeof plugin.all !== 'function') continue
        try {
            await plugin.all.call(this, m, chatUpdate)
        } catch (e) {
          if (typeof e === 'string') continue
          console.error(e)
        }
      }
      if (m.isBaileys) return
      m.exp += Math.ceil(Math.random() * 10)

      let usedPrefix
      let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

      let userss = global.db.data.users[m.sender]
      
      //Push Owner in User
      let ownerG = Object.entries(global.db.data.users).filter(user => user[1].owner).map(([jid], i) => `${jid.split`@`[0]}`)
      let ownerL = await matchArray(ownerG, global.owner)
      if(typeof ownerL === 'object') await pushArray(ownerL, 'owner')
      
      let policeG = Object.entries(global.db.data.users).filter(user => user[1].police).map(([jid], i) => `${jid.split`@`[0]}`)
      let policeL = await matchArray(policeG, global.police)
      if(typeof policeL === 'object') await pushArray(policeL, 'police')
      
      let premsG = Object.entries(global.db.data.users).filter(user => user[1].premium).map(([jid], i) => `${jid.split`@`[0]}`)
      let premsL = await matchArray(premsG, global.prems)
      if(typeof premsL === 'object') await pushArray(premsL, 'prems')
      let isROwner = [global.conn.user.jid, ...global.rowner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      let isOwner = isROwner || userss.owner || [global.conn.user.jid, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      let isMods = isOwner || isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      let groupMetadata = m.isGroup ? await this.groupMetadata(m.chat) : {} || {} //this.chats.get(m.chat).metadata
      let participants = m.isGroup ? groupMetadata.participants : [] || []
      let user = m.isGroup ? participants.find(u => u.id === m.sender) : {} // User Data
      let isPolice = isROwner || isOwner || userss.police
      let isPrems = isROwner || isOwner || isPolice || userss.premium
      let bot = m.isGroup ? participants.find(u => u.id == this.user.jid) : {} // Your Data
      let isAdmin = (user.admin === 'admin') || false // Is User Admin?
      let isBotAdmin = (bot.admin === 'admin') || false // Are you Admin?
      let isAcc = userss.acc
      for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin) continue
        if (plugin.disabled) continue
        if (!opts['restrict']) if (plugin.tags && plugin.tags.includes('admin')) continue
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
        let match = (_prefix instanceof RegExp ? // RegExp Mode?
          [[_prefix.exec(m.text), _prefix]] :
          Array.isArray(_prefix) ? // Array?
            _prefix.map(p => {
              let re = p instanceof RegExp ? // RegExp in Array?
                p :
                new RegExp(str2Regex(p))
              return [re.exec(m.text), re]
            }) :
            typeof _prefix === 'string' ? // String?
              [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
              [[[], new RegExp]]
        ).find(p => p[1])
        if (typeof plugin.before === 'function') if (await plugin.before.call(this, m, {
          match,
          usedPrefix, 
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isAdmin,
          isBotAdmin,
          isPrems,
          isPolice, 
          chatUpdate,
          isAcc, 
        })) continue
      if (typeof plugin !== 'function') continue
                if ((usedPrefix = (match[0] || '')[0])) {
                    let noPrefix = m.text.replace(usedPrefix, '')
                    let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                    args = args || []
                    let _args = noPrefix.trim().split` `.slice(1)
                    let text = _args.join` `
                    command = (command || '').toLowerCase()
                    let fail = plugin.fail || global.dfail // When failed
                    let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                        plugin.command.test(command) :
                        Array.isArray(plugin.command) ? // Array?
                            plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                                cmd.test(command) :
                                cmd === command
                            ) :
                            typeof plugin.command === 'string' ? // String?
                                plugin.command === command : 
                                false                
          if (!isAccept) continue
          m.plugin = name
          if (name === 'menu.js' && (m.sender === '6282181661561@s.whatsapp.net' || m.sender === '6283175886677@s.whatsapp.net')) m.reply('Hai Dev!')
          if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
            let chat = global.db.data.chats[m.chat]
            let user = global.db.data.users[m.sender]
            if (name != 'unbanchat.js' && chat && chat.isBanned) return // Except this
            if (name != 'unbanuser.js' && user && (user.banned && (user.owner === false))) return // || user.police === false
          }
          //if(!user.owner || !user.rowner) return conn.reply(m.chat, `Maaf @${m.sender.split`@`[0]} \n*『 Info 』*\nKami Staff ghost👻-bot ingin melakukan backup data, dan sedikit meningkatkan performa bot.\nJadi, Kami dari Staff ghost👻-bot memutuskan untuk melakukan *maintenance*, jika ada yang mau ditanyakan, harap hubungi Real Owner, Terima Kasih\n\n_*Hormat Kami, Staff ghost👻-bot*_`, m, { mentions: [m.sender] })
          if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
            fail('owner', m, this)
            continue
          }
          if (plugin.rowner && !isROwner) { // Real Owner
            fail('rowner', m, this)
            continue
          }
          if (plugin.owner && !isOwner) { // Number Owner
            fail('owner', m, this)
            continue
          }
          if (plugin.mods && !isMods) { // Moderator
            fail('mods', m, this)
            continue
          }
          if (usedPrefix && user.banned == true) {
          	fail('ban', m, this) 
              continue
              }
          if (plugin.premium && isPrems == false) { // Premium
            fail('premium', m, this)
            continue
          }
          if (plugin.police && isPolice == false) {
          	
          fail('police', m, this) 
          continue
          }
          if (plugin.group && !m.isGroup) { // Group Only
            fail('group', m, this)
            continue
          } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
            fail('botAdmin', m, this)
            continue
          } else if (plugin.admin && !isAdmin) { // User Admin
            fail('admin', m, this)
            continue
          }
          if (plugin.private && m.isGroup) { // Private Chat Only
            fail('private', m, this)
            continue
          }
          if (plugin.register == true && _user.registered == false) { // Butuh daftar?
            fail('unreg', m, this)
            continue
          }
          
          m.isCommand = true
          let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
          if (xp > 200) m.reply('Ngecit -_-') // Hehehe
          else m.exp += xp
          if (opts['staffonly'] && !m.fromMe && !isROwner && !global.db.data.users[m.sender].staff){
          	this.reply(m.chat, `Staff Only`, m) 
              continue
          }
          
          if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
            this.sendButton(m.chat, `Limit anda habis, silahkan chat Owner atau beli melalui *${usedPrefix}buy*`, '©ghost👻-bot', { 'button[0]': 'Owner', 'row[0]': '.owner', 'button[1]': 'Buy', 'row[1]': '.buy', 'button[2]': 'Buy All', 'row[2]': '.buyall' }, m)
            continue // Limit habis
          }
          if (plugin.level > _user.level) {
            this.reply(m.chat, `diperlukan level ${plugin.level} untuk menggunakan perintah ini. Level kamu ${_user.level}`, m)
            continue // If the level has not been reached
          }
          let extra = {
            match,
            usedPrefix,
            noPrefix,
            _args,
            args,
            command,
            text,
            conn: this,
            participants,
            groupMetadata,
            user,
            bot,
            isROwner,
            isOwner,
            isAdmin,
            isBotAdmin,
            isPrems,
            isPolice, 
            chatUpdate,
          }
          try {
            results = await plugin.call(this, m, extra)
            if (!isPrems) m.limit = m.limit || plugin.limit || false
          } catch (e) {
            // Error occured
            m.error = e
            console.error(e)
            if (e) {
              let text = util.format(e)
              for (let key of Object.values(global.APIKeys))
                text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
              m.reply(text)
            }
          } finally {
            // m.reply(util.format(_user))
            if (typeof plugin.after === 'function') {
              try {
                results = await plugin.after.call(this, m, extra)
              } catch (e) {
                console.error(e)
              }
            }
            if (m.limit) m.reply(+ m.limit + ' Limit terpakai')
          }
          break
        }
      }
    } finally {
      //console.log(global.db.data.users[m.sender])
      let user, stats = global.db.data.stats
      if (m) {
        if (m.sender && (user = global.db.data.users[m.sender])) {
          user.exp += m.exp
          user.limit -= m.limit * 1
          user.money -= m.money * 1
          user.spin -= m.spin
        }

        let stat
        if (m.plugin) {
          let now = + new Date
          if (m.plugin in stats) {
            stat = stats[m.plugin]
            if (!isNumber(stat.total)) stat.total = 1
            if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
            if (!isNumber(stat.last)) stat.last = now
            if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
          } else stat = stats[m.plugin] = {
            total: 1,
            success: m.error != null ? 0 : 1,
            last: now,
            lastSuccess: m.error != null ? 0 : now
          }
          stat.total += 1
          stat.last = now
          if (m.error == null) {
            stat.success += 1
            stat.lastSuccess = now
          }
        }
      }

      try {
        require('./lib/print')(m, this)
      } catch (e) {
        console.log(m, m.quoted, e)
      }
      if (opts['autoread']) await this.chatRead(m.chat).catch(() => { })
    }
  },
  async onCall(info) {
    console.log(info)
    let [data] = info
    let { from, isGroup, isVideo } = data
    let file = fs.readFileSync('./call.json') || {}
    let callList = JSON.parse(file)
    callList = JSON.stringify(callList)
    let users = global.users[from] || {}
    if (users.whitelist || users.rowner || users.owner || users.police || isGroup) return
    let user = callList[from]
    if(typeof user !== 'object') {
        callList[from] = {}
        user = callList[from]
        if(!isNumber(user.call)) user.call = 0
    }
    if(user.call < 3){
    	user.call += 1
        fs.writeFileSync('./call.json', user)
    	return this.sendMessage(from, { text: `Peringatan! Anda telah menelpon bot, ini adalah peringatan ke ${user.call}`})
    }
    await this.sendMessage(from, { text: 'Maaf, karena anda menelfon bot sebanyak 3 kali. anda diblokir otomatis' })
    await this.updateBlockStatus(from, 'block')
    if(opts['clearCallWhereAutoBlock']) user.call = 0
  }, 
  async onGroupUpdate(info){
      let { id, participants, action } = info
      let chat = global.chats[id]
      let text = ''
      switch(action){
      	case 'promote':
          case 'demote':
              if(!chat.detect) return
              (action === 'promote') ? text = (chat.sPromote || conn.spromote) : text = (chat.sPromote || conn.sdemote) 
              text = text.replace('@user', '@'+participants[0].split`@`[0])
              this.sendMessage(id, { text: text, mentions: participants}) 
          break
          case 'add':
          case 'remove':
              if(!chat.welcome) return
              let groupMetadata = await this.groupMetadata(id)
              (action === 'add') ? text = (chat.sWelcome || conn.welcome).replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc) : text = (chat.sBye || conn.bye)
              text = text.replace('@user', '@'+participants[0].split`@`[0])
              let pp = './src/avatar_contact.png'
              try {
              	pp = await conn.profilePictureUrl(participants[0], 'image')
              } catch (e) { console.log(e) }
              this.sendMessage(id, { caption: text, image: pp, fileName: 'pp.jpg', mentions: participants})
          break
      }
  }
}

global.dfail = (type, m, conn) => {
  let msg = {
    rowner: 'Perintah ini hanya dapat digunakan oleh _*Real Owner*_',
    owner: 'Perintah ini hanya dapat digunakan oleh _*Owner Bot*_!',
    mods: 'Perintah ini hanya dapat digunakan oleh _*Moderator*_ !',
    premium: 'Perintah ini hanya untuk member _*Premium*_ !',
    group: 'Perintah ini hanya dapat digunakan di grup!',
    private: 'Perintah ini hanya dapat digunakan di Chat Pribadi!',
    police: 'Perintah ini hanya untuk Police Bot', 
    admin: 'Perintah ini hanya untuk *Admin* grup!',
    ban: 'Maaf kamu sedang di banned', 
    botAdmin: 'Jadikan bot sebagai *Admin* untuk menggunakan perintah ini!',
    unreg: 'Silahkan daftar untuk menggunakan fitur ini dengan cara mengetik:\n\n*#daftar nama.umur*\n\nContoh: *#daftar Manusia.16*'
  }[type]
  if (msg) return m.reply(msg)
  }
  global.dfails = (jid, buffer, content, footer, button1, row1, button2, row2, quoted) => {
          conn.send2ButtonLoc(m.chat, fetch(fla + 'Kamu Belum Terima Rules Bot!').buffer(), `Rules Undefined Bot
          1. Dilarang spam
          2. Dilarang untuk menggunakan command 18+ berlebihan (ketahuan = ban) 
          3. Dilarang memasukkan bot Tanpa izin Owner ataupun Police
          4. Bot harus admin jika ingin menggunakan fitur admin! 
          5. enable restrict untuk mengaktifkan fitur admin
          
          Rules Pengguna Undefined Bot
          1. Dilarang spam & telpon bot
          2. Dilarang share nomor bot
          3. Dilarang menggunakan bot untuk hal yang tidak berguna
          4. Dilarang untuk membandingkan Undefined bot dengan yang lain
          5. Lapor bug ke Owner dan Police jika ditemukan
          
          Rules Admin & Group Undefined Bot
          1. Gunakan end group dengan otak di kepala jangan otak di dengkul
          2. Jangan spam invite dan kick menggunakan fitur bot
          3. Jika ada yang spam, bantu group close (untuk menghindari Overload) 
          4. Gk suka sama Undefined bot? kick aja bodoh
          
          Owner & Police bot berhak banned permanen / sementara dan leave group jika ada yang melanggar! 
          Hormat kami Staff Undefined Bot
          `, '©Undefined Bot', 'Terima', '.terima', 'Tidak', '.tidak', m)
  	
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'handler.js'"))
  delete require.cache[file]
  if (global.reloadHandler) console.log(global.reloadHandler())
})
