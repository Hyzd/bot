exports.run = {
   usage: 'changename',
   hidden: ['botname'],
   use: 'name',
   category: 'owner',
   async exec(m, {
      client,
      text,
      isPrefix,
      command
   }) {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'neoxr bot'), m)
         if (text.length > 25) return client.reply(m.chat, `🚩 Text is too long, maximum 25 characters.`, m)
         client.authState.creds.me.name = text
         await props.save(global.db)
         return client.reply(m.chat, `🚩 Name successfully changed.`, m)
      } catch {
         return client.reply(m.chat, Func.texted('bold', `🚩 Name failed to change.`), m)
      }
   },
   error: false,
   owner: true,
   location: __filename
}