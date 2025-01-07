import { ApplicationCommandOptionType } from 'discord.js';
import { Slash, execute } from 'sunar';

const slash = new Slash({
	name: 'ban',
	description: 'ban @user',
	options: [
		{
			name: 'user',
			type: ApplicationCommandOptionType.User,
			description: 'User to ban',
			required: true,
		},
	],
});

const unbanSlash = new Slash({
	name: 'unban',
	description: 'unban user ID',
	options: [
		{
			name: 'user_id',
			type: ApplicationCommandOptionType.String,
			description: 'ID of the user to unban',
			required: true,
		},
	],
});
execute(unbanSlash, async (interaction) => {
	try {
		if (!interaction.isChatInputCommand()) return;
		const userId = interaction.options.getString('user_id');
		await interaction.guild.bans.fetch(userId);
		await interaction.guild.bans.remove(userId);
		await interaction.reply({ content: `User with ID ${userId} has been unbanned successfully.` });
	} catch (error) {
		await interaction.reply({ content: `Failed to execute unban: ${error.message}`, ephemeral: true });
	}
});

execute(slash, async (interaction) => {
	try {
		if (!interaction.isChatInputCommand()) return;
		const targetUser = interaction.options.getUser('user');
		if (!targetUser) {
			await interaction.reply({ content: 'Please mention a valid user to ban.', ephemeral: true });
			return;
		}
		const member = interaction.guild.members.cache.get(targetUser.id);
		if (!member) {
			await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
			return;
		}
		await member.ban();
		await interaction.reply({ content: `${targetUser.tag} has been banned successfully.` });
	} catch (error) {
		await interaction.reply({ content: `Failed to execute ban: ${error.message}`, ephemeral: true });
	}
});

export { slash, unbanSlash };
