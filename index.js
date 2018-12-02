const Discord = require('discord.js');
const _ = require('lodash');
const {fetchItems} = require('./client');
const {getItemCard} = require('./card');
const {parseLevel} = require('./util');

require('dotenv').config();

const client = new Discord.Client();

const data = {
  items: null,
  itemsByName: null,
}

client.on('ready', async () => {
  console.log(`Connected to discord as ${client.user.tag}!`);

  const items = await fetchItems();
  console.log(`Loaded ${items.length} items`);

  console.log('Ready to accept messages');
  data.items = items;
  data.itemsByName = _.keyBy(items, x => x.name.toLowerCase());
});
 
client.on('message', msg => {
  if (msg.author.id == client.user.id) return;

  const matches = msg.content.match(/\[.+?\]/g);
  if (!matches) return;

  for (let match of matches) {
    let [, level, name] = match.match(/\[(?:\+?((?:\d+)|PRI|DUO|TRI|TET|PEN|I|II|III|IV|V) )?(.+?)\]/);
    console.log('saw',{match,level,name})
    level = parseLevel(level);
    name = name.toLowerCase();
    if (name in data.itemsByName) {
      const item = data.itemsByName[name];
      const card = getItemCard(item, level);
      msg.channel.send(new Discord.RichEmbed(card));
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
