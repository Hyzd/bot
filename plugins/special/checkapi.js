exports.run = {
   usage: 'checkapi',
   hidden: ['check'],
   category: 'special',
   async exec(m, {
      client
   }) {
      try {
         let json = await Api.check()
         await client.reply(m.chat, Func.jsonFormat(json), m)
      } catch (e) {
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   location: __filename
}