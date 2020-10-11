const Discord = require('discord.js');
const Axios = require('axios');

const { prefix, token, channels } = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
	// Check if the message is in a valid channel and check that it starts with prefix - if not it returns instantly
	if (
		!msg.content.startsWith(prefix) ||
		channels.includes(msg.channel.id) == false
	)
		return;

	const args = msg.content.slice(prefix.length).trim().toLowerCase().split(' ');
	const command = args.shift();

	if (command === `xkcd`) {
		let data = await getCurrentComic(); // Request most recent comic since you can use it to work out total number of comics
		let alertMsg; // Define alertMsg which is used to return errors and messages to the user

		switch (args[0]) {
			case undefined:
				console.log('[case undefined] - returning current');
				break;

			case 'random':
				const randNum = Math.floor(Math.random() * (data.num + 1));
				console.log('[case random] - returning comic ', randNum);

				data = await getComicByNum(randNum);
				break;

			case 'help':
				console.log('[case help] - returning help alert');
				alertMsg =
					'__**Help:**__ \n`!xkcd` - returns most recent comic.\n`!xkcd {number}` - returns specific comic by number.\n`!xkcd random` - returns random comic';
				break;

			// Check to see if args[0] is a number
			default:
				// Check if the string is a valid number and if it is check to see if it is a valid comic number
				if (isNumber(args[0])) {
					// Check if the number is 0 or below
					if (args[0] <= 0) {
						alertMsg = `[error]: Nice try but I'm too smart for you!`;

						// Check to see if the number is below or equal to most current num
					} else if (args[0] <= data.num) {
						data = await getComicByNum(args[0]);

						// Return error since the number is greater than the max number
					} else {
						alertMsg =
							'[error]: Number specified is too large! Try a smaller one!';
					}

					// Not a valid number so return an error
				} else {
					alertMsg = '[error]: Something went wrong! Unknown Command.';
				}
		}

		// Check to see if alertMsg has been set and if it has sent alertMsg instead.
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

// Credit: https://stackoverflow.com/a/1421988/11213488
function isNumber(n) {
	return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

client.login(token);
