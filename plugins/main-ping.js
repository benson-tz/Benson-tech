import { exec } from 'child_process'
import speed from 'performance-now'

let handler = async (m, { conn }) => {
  let thumbnail = ''
  let fgg = {
    key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
    message: {
      contactMessage: {
        displayName: `❦︎𝘽𝙀𝙉𝙎𝙊𝙉 𝙏𝙀𝘾𝙃𝙉𝙊𝙇𝙊𝙂𝙔❦︎`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'HYDRA'\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  }
  let pingMsg = await conn.sendMessage(m.chat, { text: '[speed...' }, { quoted: fgg })
 
  let timestamp = speed()

  await exec('neofetch --stdout', async (error, stdout) => {
    let latency = (speed() - timestamp).toFixed(4)

    await conn.relayMessage(
      m.chat,
      {
        protocolMessage: {
          key: pingMsg.key,
          type: 14,
          editedMessage: {
            conversation:
              `ᴥ︎︎︎ʙᴇɴsᴏɴ-ᴀɪᴥ︎︎︎${latency}🔐
           𝖉𝖊𝖛𝖊𝖑𝖔𝖕𝖊𝖉 𝖇𝖞 𝕭𝖊𝖓𝖘𝖔𝖓𝖙𝖊𝖈𝖍-𝖙𝖟`,
          },
        },
      },
      {}
    )
  })
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed']

export default handler
