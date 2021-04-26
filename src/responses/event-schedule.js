const bot = require('../bot');
const config = require('../config');
const rp = require('request-promise');
const fs = require('fs');

let rawdata = fs.readFileSync('events.json');
let eventsData = JSON.parse(rawdata);
function trigger(msg) {
	return /(@event)/i.test(msg.text);
}

async function respond() {
	let body = {
		"bot_id": config.BOT_ID,
		"text": "Night Prayer at 8:30pm Tonight"
	};

	// fill in member ids
	try {
		let resp = await rp({
			method: 'GET',
			url: `https://api.groupme.com/v3/groups/${config.GROUP_ID}?token=${config.ACCESS_TOKEN}`,
			json: true
		});
	} catch(err) {
		console.error(err);
	}

	// post message
	bot.postMsg(body)
}

exports.trigger = trigger;
exports.respond = respond;
