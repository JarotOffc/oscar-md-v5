let handler = async (m, { conn, args }) => {
  let fetch = require("node-fetch");
  let locale = "id";
  let d = new Date(new Date() + 3600000);
  let _uptime = process.uptime() * 1000;
  let uptime = clockString(_uptime);
  let week = d.toLocaleDateString(locale, { weekday: "long" });
  let date = d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let name = m.fromMe ? conn.user : conn.contacts[m.sender];
  let sortedExp = Object.entries(global.DATABASE.data.users).sort(
    (a, b) => b[1].exp - a[1].exp
  );
  let sortedLim = Object.entries(global.DATABASE.data.users).sort(
    (a, b) => b[1].limit - a[1].limit
  );
  let sortedmoney = Object.entries(global.DATABASE.data.users).sort(
    (a, b) => b[1].money - a[1].money
  );
  let sortedlevel = Object.entries(global.DATABASE.data.users).sort(
    (a, b) => b[1].level - a[1].level
  );
  let usersExp = sortedExp.map((v) => v[0]);
  let usersLim = sortedLim.map((v) => v[0]);
  let usersmoney = sortedmoney.map((v) => v[0]);
  let userslevel = sortedlevel.map((v) => v[0]);
  let len =
    args[0] && args[0].length > 0
      ? Math.min(100, Math.max(parseInt(args[0]), 5))
      : Math.min(30, sortedExp.length);
  let text = `°•︶꒷ *Level Leaderboard Top ${len}* ꒷︶•°
    
· ͟͟͞͞Kamu: *${userslevel.indexOf(m.sender) + 1}* dari *${userslevel.length}*

➷ ${sortedlevel
    .slice(0, len)
    .map(
      ([user, data], i) =>
        i + 1 + ". @" + user.split`@`[0] + ": *" + data.level + " Lvl*"
    ).join`\n➷ `}

°•︶꒷ *Money Leaderboard Top ${len}* ꒷︶•°

· ͟͟͞͞Kamu: *${usersmoney.indexOf(m.sender) + 1}* dari *${usersmoney.length}*

➷ ${sortedmoney
    .slice(0, len)
    .map(
      ([user, data], i) =>
        i + 1 + ". @" + user.split`@`[0] + ": *" + data.money + " Money*"
    ).join`\n➷ `}`.trim();
  await conn.send2ButtonLoc(
    m.chat,
    "https://telegra.ph/file/b85bb5e3bbda437af0e03.jpg",
    text,
    `Aktif Selama : ${uptime}\n${week} ${date}`,
    "💌 My",
    ".my",
    "📑 PROFILE",
    ".profile",
    m
  );
};
function clockString(ms) {
  let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
handler.help = ["leaderboard [jumlah user]", "lb [jumlah user]"];
handler.tags = ["rpg"];
handler.command = /^(leaderboard|lb)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;
handler.exp = 0;

module.exports = handler;
