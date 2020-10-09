const Discord = require('discord.js');
const Axios = require('axios');

require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if (msg.content === '!xkcd') {
		Axios.get('http://xkcd.com/info.0.json').then((response) => {
			console.log(response.data);
			//msg.reply(JSON.stringify(response.data));
			msg.channel.send(response.data.alt, { files: [response.data.img] });
		});
	}
});

client.login(process.env.BOT_TOKEN);
