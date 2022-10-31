let levelling = require("../lib/levelling");
let fs = require("fs");
let path = require("path");
let fetch = require("node-fetch");
let moment = require("moment-timezone");
let jimp = require("jimp");
let PhoneNumber = require("awesome-phonenumber");
let handler = async (m, { conn, usedPrefix: _p, args, command }) => {
  let hao = ` 
 *Official Bot By @${"0".split("@")[0]}* 
 *Powered By @${"6285850539404".split("@")[0]}*`;
  let package = JSON.parse(
    await fs.promises
      .readFile(path.join(__dirname, "../package.json"))
      .catch((_) => "{}")
  );
  let { exp, limit, age, money, level, role, registered } =
    global.db.data.users[m.sender];
  let { min, xp, max } = levelling.xpRange(level, global.multiplier);
  let umur = `*${age == "-1" ? "Belum Daftar*" : age + "* Thn"}`;
  let name = registered
    ? global.db.data.users[m.sender].name
    : conn.getName(m.sender);
  let d = new Date(new Date() + 3600000);
  let locale = "id";
  // d.getTimeZoneOffset()
  // Offset -420 is 18.00
  // Offset    0 is  0.00
  // Offset  420 is  7.00
  let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][
    Math.floor(d / 84600000) % 5
  ];
  let week = d.toLocaleDateString(locale, { weekday: "long" });
  let date = d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let dateIslamic = Intl.DateTimeFormat(locale + "-TN-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  let time = d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const wita = moment.tz("Asia/Makassar").format("HH:mm:ss");
  const wit = moment.tz("Asia/Jayapura").format("HH:mm:ss");
  const hariRaya = new Date("January 1, 2023 23:59:59");
  const sekarang = new Date().getTime();
  const Selisih = hariRaya - sekarang;
  const jhari = Math.floor(Selisih / (1000 * 60 * 60 * 24));
  const jjam = Math.floor((Selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mmmenit = Math.floor((Selisih % (1000 * 60 * 60)) / (1000 * 60));
  const ddetik = Math.floor((Selisih % (1000 * 60)) / 1000);
  const hariRayaramadan = new Date("April 21, 2023 23:59:59");
  const sekarangg = new Date().getTime();
  const lebih = hariRayaramadan - sekarangg;
  const harii = Math.floor(lebih / (1000 * 60 * 60 * 24));
  const jamm = Math.floor((lebih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const menitt = Math.floor((lebih % (1000 * 60 * 60)) / (1000 * 60));
  const detikk = Math.floor((lebih % (1000 * 60)) / 1000);
  const ultah = new Date("April 5, 2023 23:59:59");
  const sekarat = new Date().getTime();
  const Kurang = ultah - sekarat;
  const ohari = Math.floor(Kurang / (1000 * 60 * 60 * 24));
  const ojam = Math.floor((Kurang % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const onet = Math.floor((Kurang % (1000 * 60 * 60)) / (1000 * 60));
  const detek = Math.floor((Kurang % (1000 * 60)) / 1000);
  const natal = new Date("December 25, 2022 23:59:59");
  const kapanatal = new Date().getTime();
  const natalnya = natal - kapanatal;
  const nhari = Math.floor(natalnya / (1000 * 60 * 60 * 24));
  const njam = Math.floor(
    (natalnya % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const nmenit = Math.floor((natalnya % (1000 * 60 * 60)) / (1000 * 60));
  const mdetek = Math.floor((natalnya % (1000 * 60)) / 1000);
  let pe = "```";
  let { premium, premiumTime } = global.db.data.users[m.sender];
  let _uptime = process.uptime() * 1000;
  let _muptime;
  if (process.send) {
    process.send("uptime");
    _muptime =
      (await new Promise((resolve) => {
        process.once("message", resolve);
        setTimeout(resolve, 1000);
      })) * 1000;
  }
  let mode = global.opts["self"] ? "Private" : "Public";
  let muptime = clockString(_muptime);
  let uptime = clockString(_uptime);
  global.jam = time;
  let totalreg = Object.keys(global.db.data.users).length;
  let rtotalreg = Object.values(global.db.data.users).filter(
    (user) => user.registered == true
  ).length;
  let user = db.data.users[m.sender];
  let id = m.chat;
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
      ? conn.user.jid
      : m.sender;
  let sender = m.sender;
  let pp = await conn
    .profilePictureUrl(who, "image")
    .catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
  const fkgif = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: "6285850539404-1625305606@g.us" } : {}),
    },
    message: {
      extendedTextMessage: {
        text: `𝙾𝚜𝚌𝚊𝚛-𝙼𝚞𝚕𝚝𝚒𝙳𝚎𝚟𝚒𝚌𝚎 Whatsapp ʙᴏᴛ`,
        title: `𝙾𝚜𝚌𝚊𝚛-𝙼𝚞𝚕𝚝𝚒𝙳𝚎𝚟𝚒𝚌𝚎 Whatsapp ʙᴏᴛ`,
        jpegThumbnail: await (
          await fetch("https://telegra.ph/file/6f11ac2de8d57a1c831c4.jpg")
        ).buffer(),
      },
    },
  };

  let tksk = `${ucapan()}, @${m.sender.split`@`[0]}

●────━───༺༻───━───●
┏─────────────────⬣
┆         《 BOT INFO 》
┗┬──────────────┈ ⳹
┏┆⚘ 𝙱𝚘𝚝 𝙽𝚊𝚖𝚎 : OSCAR-MD
┆┆⚘ 𝙲𝚛𝚎𝚊𝚝𝚘𝚛
┆┆⚘ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝙾𝚠𝚗𝚎𝚛
┆┆http://wa.me/6285850539404
┆┆⚘ 𝚃𝚊𝚗𝚐𝚐𝚊𝚕: ${date}
┆┆⚘ 𝙹𝚊𝚖: ${time} WIB
┆┆⚘ 𝙼𝚘𝚍𝚎: 「 ${mode}  」
┗┬──────────────┈ ⳹
┏┤      《 USER INFO 》
┆┗──────────────┈ ⳹
┆⚘ 𝙽𝚊𝚖𝚊: ${name}
┆⚘ 𝚂𝚝𝚊𝚝𝚞𝚜: ${premium ? "Premium" : "Free"} User
┆⚘ 𝙻𝚒𝚖𝚒𝚝: ${limit}
┆⚘ 𝙰𝚙𝚒: wa.me/${m.sender.split("@")[0]}
┆⚘ 𝙻𝚎𝚟𝚎𝚕: ${level}
┆⚘ 𝚇𝚙: ${exp}
┆⚘ 𝚁𝚊𝚗𝚔: ${role}
┗┬──────────────┈ ⳹
┏┤     《 BOT STATUS 》 
┆┗──────────────┈ ⳹
┆⚘ 𝚁𝚞𝚗𝚝𝚒𝚖𝚎: ${uptime}
┆⚘ 𝚄𝚜𝚎𝚛 𝚁𝚎𝚐𝚒𝚜𝚝𝚎𝚛 ${totalreg}
┗─────────────────⬣`;

  let ftt = `NOTE 📮 JIKA MENEMUKAN BUG/FITUR EROR SILAHKAN CHAT OWNER KAK JANGAN LUPA SUSCRIBE YOUTUBE BOT SEBAGAI BENTUK SUPORT BOT

 *Official Bot By @${"0".split("@")[0]}* 
 *Powered By @${"6285850539404".split("@")[0]}*`;
  const listMessage = {
    text: `𝙷𝚊𝚒 ${name} Jangan 𝚂𝚙𝚊𝚖 𝚈𝚊`.trim(),
    footer: "Jangan Lupa Suscribe YouTube Bot Yah Kak >//<",
    title: wm,
    buttonText: "Pilih Disini",
  };
  await conn.send3ButtonImg(
    m.chat,
    media,
    tksk,
    ftt,
    "𝚂𝚎𝚖𝚞𝚊 𝙿𝚎𝚛𝚒𝚗𝚝𝚊𝚑🎀",
    ".? all",
    "𝙾𝚠𝚗𝚎𝚛⛽",
    ".owner",
    "𝙳𝚘𝚗𝚊𝚜𝚒📮",
    ".donasi",
    m
  );
  //await conn.send3ButtonLoc(m.chat, await conn.resize(pp, 300, 300), tksk, ftt, 'RENT', '.sewa', 'OWNER', '.owner', 'CREDITS', '.tqto', m)
  return conn.sendMessage(m.chat, listMessage, {
    quoted: fkgif,
    mentions: await conn.parseMention(wm),
    contextInfo: { forwardingScore: 99999, isForwarded: true },
  });
};
handler.help = ["menu"];
handler.tags = ["main"];
handler.command = /^(menu)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;
handler.exp = 3;

module.exports = handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
function ucapan() {
  const time = moment.tz("Asia/Jakarta").format("HH");
  res = "Selamat dinihari";
  if (time >= 4) {
    res = "Selamat pagi";
  }
  if (time > 10) {
    res = "Selamat siang";
  }
  if (time >= 15) {
    res = "Selamat sore";
  }
  if (time >= 18) {
    res = "Selamat malam";
  }
  return res;
}
function ucapanl() {
  const timel = moment.tz("Asia/Jakarta").format("HH");
  resl = "Selamat dinihari 🎑";
  if (timel >= 4) {
    resl = "Good Morning 🌅";
  }
  if (timel > 10) {
    resl = "Good Afternoon 🏞️";
  }
  if (timel >= 15) {
    resl = "Good Afternoon 🌇";
  }
  if (timel >= 18) {
    resl = "Good Evening 🌃";
  }
  return resl;
}