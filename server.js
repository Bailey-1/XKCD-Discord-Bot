const Discord = require('discord.js');
const Axios = require('axios');

require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
	const msgContent = msg.toString().split(' ');

	if (msgContent[0] === '!xkcd') {
		console.log('[msgContent[0] = !xkcd]');
		let data = await getCurrentComic();
		let alertMsg;

		switch (msgContent[1]) {
			case undefined:
				console.log('[case undefined] - returning current');
				break;

			case 'random':
				const randNum = Math.floor(Math.random() * (data.num + 1));
				console.log('[case random] - returning comic ', randNum);

				data = await getComicByNum(randNum);
				break;

			case 'help':
				alertMsg =
					'__**Help:**__ \n`!xkcd` - returns most recent comic.\n`!xkcd {number}` - returns specific comic by number.\n`!xkcd random` - returns random comic';
				break;

			default:
				if (isNumber(msgContent[1])) {
					if (msgContent[1] <= 0) {
						alertMsg = `[error]: Nice try but I'm too smart for you!`;
					} else if (msgContent[1] <= data.num) {
						data = await getComicByNum(msgContent[1]);
					} else {
						alertMsg =
							'[error]: Number specified is too large! Try a smaller one!';
					}
				} else {
					console.log('[case default]');
					// console.log('[msgContent[1] is not valid]');
					alertMsg = '[error]: Something went wrong! Unknown Command.';
				}
		}

		// console.log('data: ', data);

		if (alertMsg) {
			msg.channel.send(alertMsg);
		} else {
			msg.channel.send(
				`[Comic: ${data.num} - ${data.day}/${data.month}/${data.year}] - ${data.alt}`,
				{ files: [data.img] },
			);
		}
	}
});

async function getCurrentComic() {
	const response = await Axios.get('http://xkcd.com/info.0.json');
	return response.data;

	// Using promises instead of using async / await
	// Axios.get('http://xkcd.com/info.0.json').then((response) => {
	// 	console.log(response.data);
	// 	//msg.reply(JSON.stringify(response.data));
	// 	return response.data;
	// });
}

async function getComicByNum(num) {
	const response = await Axios.get(`http://xkcd.com/${num}/info.0.json`);
	return response.data;
}

// https://stackoverflow.com/a/1421988/11213488
function isNumber(n) {
	return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

client.login(process.env.BOT_TOKEN);
