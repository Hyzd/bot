exports.run = {
   usage: 'ping',
   hidden: ['pantek'],
   category: 'special',
   async exec(m, { args }) {
      try {
         await m.reply(args[0] || 'Pong!!')
      } catch (e) {
         m.reply(e.message)
      }
   },
   owner: true
}