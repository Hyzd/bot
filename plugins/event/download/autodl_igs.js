exports.run = {
   name: Func.basename(__filename),
   regex: /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/,
   async exec(m, {
      client,
      body,
      prefixes
   }) {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('igs', m.sender)
               links.map(async link => {
                  let json = await Api.igs(link)
                  if (!json.status) return client.reply(m.chat, `${global.status.fail} : [ @${link.split('/')[4]} ]`, m)
                  for (let i = 0; i < json.data.length; i++) {
                     client.sendFile(m.chat, json.data[i].url, ``, `🍟 *Fetching* : ${((new Date - old) * 1)} ms (${i+1})`, m)
                     await Func.delay(1500)
                  }
                  await Func.delay(1500)
                  client.reply(m.chat, Func.texted('bold', `✅ Done, all stories successfully downloaded.`), m)
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true,
   location: __filename
}