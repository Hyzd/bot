module.exports = async (client, m) => {
   try {
      require('./system/database')(m)
      const isOwner = [global.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrem = (typeof global.db.users[m.sender] != 'undefined' && global.db.users[m.sender].premium) || isOwner
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      const adminList = m.isGroup ? await client.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await client.fetchBlocklist()) != 'undefined' ? await (await client.fetchBlocklist()) : []
      const groupSet = global.db.groups[m.chat],
         chats = global.db.chats[m.chat],
         users = global.db.users[m.sender],
         setting = global.db.setting
      client.sendPresenceUpdate('available', m.chat)
      const body = typeof m.text == 'string' ? m.text : false
      require('./system/exec')(client, m, isOwner)
      const getPrefix = body ? body.charAt(0) : ''
      const myPrefix = (setting.multiprefix ? setting.prefix.includes(getPrefix) : setting.onlyprefix == getPrefix) ? getPrefix : undefined
      let isPrefix
      if (body && body.length != 1 && (isPrefix = (myPrefix || '')[0])) {
         let args = body.replace(isPrefix, '').split` `.filter(v => v)
         let command = args.shift().toLowerCase()
         let start = body.replace(isPrefix, '')
         let clean = start.trim().split` `.slice(1)
         let text = clean.join` `
         let prefixes = global.db.setting.multiprefix ? global.db.setting.prefix : [global.db.setting.onlyprefix]
         let commands = global.p.commands.get(command) || global.p.commands.filter((cmd) => cmd.run.alias).find((cmd) => cmd.run.alias && cmd.run.alias.includes(command))
         try {
           const cmd = commands.run
           if (cmd.owner && !isOwner) return client.reply(m.chat, global.status.owner, m)	
           cmd.exec(m, {
               client,
               args,
               text,
               isPrefix,
               command,
               participants,
               blockList,
               isAdmin,
               isBotAdmin,
               isOwner
            })
         } catch (e) {
            console.error("[CMD ERROR] ", e);
         }
      }
   } catch (e) {
      console.log("[CHATS ERROR] ", String(e))
   }
}