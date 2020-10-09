const Discord = require('discord.js');
const Axios = require('axios');

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if (msg.content === 'ping') {
		msg.reply('pong');
	}
});

client.login('NzMzODQ0OTg2NDk1MzY5MzIy.XxJEZg.5BoFfKtLtpSAjScG-ydH7avk9Yc');
