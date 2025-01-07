import { PermissionFlagsBits } from 'discord.js';
import { Protector, execute } from 'sunar';

const onlyAdmins = new Protector({
	commands: ['slash'],
	signals: ['interactionCreate'],
});

const content = 'This command can only be used by administrators';

function checkIsAdmin(permissions) {
	if (!permissions) return false;
	return permissions.has(PermissionFlagsBits.Administrator);
}

execute(onlyAdmins, (arg, next) => {
	const entry = Array.isArray(arg) ? arg[0] : arg;
	const isAdmin = checkIsAdmin(entry.memberPermissions);

	if (entry.isRepliable() && !isAdmin) {
		return entry.reply({ content, ephemeral: true });
	}

	return isAdmin && next();
});

export { onlyAdmins };