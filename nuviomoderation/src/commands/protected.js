import { Slash, execute, protect } from 'sunar';

import { onlyAdmins } from '../protectors/only-admins.js';

const slash = new Slash({
	name: 'protected',
	description: 'This is a protected slash command',
});

protect(slash, [onlyAdmins]);

execute(slash, (interaction) => {
	interaction.reply({ content: 'You are an admin!' });
});

export { slash };