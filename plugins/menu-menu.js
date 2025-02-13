import { promises, readFileSync } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
const handler = async (m, { conn, command, text, args, usedPrefix }) => {
  let glb = global.db.data.users
  let usrs = glb[m.sender]
  let tag = `@${m.sender.split('@')[0]}`
  let mode = global.opts['self'] ? 'Private' : 'Public'
  let vn = './Assets/mp3/Classic.mp3'
  let { age, exp, limit, level, role, registered, credit } = glb[m.sender]
  let { min, xp, max } = xpRange(level, global.multiplier)
  let name = await conn.getName(m.sender)
  let premium = glb[m.sender].premiumTime
  let prems = `${premium > 0 ? 'Premium' : 'Free'}`
  let platform = os.platform()
  let ucpn = `${ucapan()}`
  let _uptime = process.uptime() * 1000
  let _muptime
  if (process.send) {
    process.send('uptime')
    _muptime =
      (await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      })) * 1000
  }
  let muptime = clockString(_muptime)
  let uptime = clockString(_uptime)

  let totalfeatures = Object.values(global.plugins).filter(v => v.help && v.tags).length
  let totalreg = Object.keys(glb).length

  conn.gurumenu = conn.gurumenu ? conn.gurumenu : {}

  global.fcontact = {
    key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
    message: {
      contactMessage: {
        displayName: `${name}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  }
  const infoText = `
 ▒▓   𝐁𝐄𝐍𝐒𝐎𝐍 𝐓𝐄𝐂𝐇   ▓▒
- Hii ${name} user
   ⧳═══☙BENSONTECH☙═⧳
❏📚 *Mode:* ${mode}
❏💻 *Platform:*𝐍𝐨𝐝𝐞𝐣𝐬
❏🌐 *Baileys:* 𝙱𝚎𝚗𝚜𝚘𝚗-𝚋𝚊𝚒𝚕𝚎𝚢𝚜 
❏🔓 *Prefix:* [ *${usedPrefix}* ]
❐🕰️ *Uptime:* ${muptime}
❏🗂️ *Database:*  ${totalreg}
   ⧱════════════⧱
> ©𝐁𝐄𝐍𝐒𝐎𝐍
֎───᚛ᚔBOTINFOᚔ᚜───֎
│ *${totalfeatures}* Commands
╰──────────⧱
  ⧪═══════════════⧭
▒ 🛰️ 𝖕𝖎𝖓𝖌
▒🚀 𝖒𝖊𝖓𝖚
⌘ 
𝐀𝐈-𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐁𝐎𝐓 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐃 𝐁𝐘 𝐁𝐄𝐍𝐒𝐎𝐍-𝐓𝐄𝐂𝐇⌛
   ⧪══════════════⧭
 `
  const { result, key, timeout } = await conn.sendMessage(
    m.chat,
    { video: { url: menuvid }, caption: infoText.trim(),
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
      newsletterName: '⟣ᴀʀʟᴏᴅʀᴀɢᴏɴ ɪꜱ ᴍʏ ᴏᴡɴᴇʀ⟢',
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: 'ᚙ𝖉𝖊𝖛𝖊𝖑𝖔𝖕𝖊𝖉 𝖇𝖞 Bensonᚙ',
        body: 'ᴀʀʟᴏᴅʀᴀɢᴏɴ',
        thumbnailUrl: 'https://files.catbox.moe/5neqle.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029VaNPPwR30LKQk437x51Q',
        mediaType: 1,
        renderLargerThumbnail: false,
      },
    },
    
    gifPlayback: true, gifAttribution: 0 },
    { quoted: fcontact }
  )

  // Save the menu options to firemd
  conn.firemdmenu[m.sender] = {
    result,
    key,
    timeout: setTimeout(() => {
      conn.sendMessage(m.chat, {
        delete: key,
      })
      delete conn.gurumenu[m.sender]
    }, 150 * 1000),
  }
}

handler.before = async (m, { conn }) => {
  conn.firemdmenu = conn.firemdmenu ? conn.firemdmenu : {}
  if (m.isBaileys || !(m.sender in conn.firemdmenu)) return
  const { result, key, timeout } = conn.firemdmenu[m.sender]
  if (!m.quoted || m.quoted.id !== key.id || !m.text) return
  const choice = m.text.trim()

  if (choice === '1') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://files.catbox.moe/5neqle.jpg' }, caption: botmenu },
      { quoted: fcontact }
    )
  } else if (choice === '2') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/dkKqGOv.jpeg' }, caption: ownermenu },
      { quoted: fcontact }
    )
  } else if (choice === '3') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: groupmenu },
      { quoted: fcontact }
    )
  } else if (choice === '4') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: funmenu },
      { quoted: fcontact }
    )
  } else if (choice === '5') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: reactmenu },
      { quoted: fcontact }
    )
  } else if (choice === '6') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: dlmenu },
      { quoted: fcontact }
    )
  } else if (choice === '7') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: groupmenu },
      { quoted: fcontact }
    )
  } else if (choice === '8') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: logomenu },
      { quoted: fcontact }
    )
  } else if (choice === '9') {
    await conn.sendMessage(
      m.chat,
      {
        image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' },
        caption: stickermenu,
      },
      { quoted: fcontact }
    )
  } else if (choice === '10') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: audiomenu },
      { quoted: fcontact }
    )
  } else if (choice === '11') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: newsmenu },
      { quoted: fcontact }
    )
  } else if (choice === '12') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: economy },
      { quoted: fcontact }
    )
  } else if (choice === '13') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/tStJm2M.jpeg' }, caption: animemenu },
      { quoted: fcontact }
    )
  } else if (choice === '14') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: nsfwmenu },
      { quoted: fcontact }
    )
  } else if (choice === '15') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: toolsmenu },
      { quoted: fcontact }
    )
  } else if (choice === '16') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: Aimenu },
      { quoted: fcontact }
    )
  } else if (choice === '17') {
    await conn.sendMessage(
      m.chat,
      {
        image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' },
        caption: religionmenu,
      },
      { quoted: fcontact }
    )
  } else if (choice === '18') {
    await conn.sendMessage(
      m.chat,
      { image: { url: 'https://i.imgur.com/fhX5C8F.jpeg' }, caption: pluginmenu },
      { quoted: fcontact }
    )
  } else {
    m.reply('Invalid choice. Please reply with a valid number.')
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(menu)$/i
handler.limit = true
export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('')
}

function clockStringP(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [
    ye,
    ' *Years 🗓️*\n',
    mo,
    ' *Month 🌙*\n',
    d,
    ' *Days ☀️*\n',
    h,
    ' *Hours 🕐*\n',
    m,
    ' *Minute ⏰*\n',
    s,
    ' *Second ⏱️*',
  ]
    .map(v => v.toString().padStart(2, 0))
    .join('')
}

function ucapan() {
  const time = moment.tz('Africa/Lagos').format('HH')
  let res = 'Good morning ☀️'
  if (time >= 4) {
    res = 'Good Morning 🌄'
  }
  if (time >= 10) {
    res = 'Good Afternoon ☀️'
  }
  if (time >= 15) {
    res = 'Good Afternoon 🌇'
  }
  if (time >= 18) {
    res = 'Good Night 🌙'
  }
  return res
}
