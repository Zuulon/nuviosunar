import 'dotenv/config';

import { GatewayIntentBits } from 'discord.js';
import { Client, load } from 'sunar';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
	],
});

await load('src/{commands,signals}/**/*.js');

client.login('MTMyNTIwODM4NDg2OTI0MDk0Mg.G9KUCe.I59M5YgT0fuWbsHPYYq0qF56pjp0vw3uq3_20I');
