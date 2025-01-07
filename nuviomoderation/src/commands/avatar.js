import { Slash } from 'sunar';
import { ApplicationCommandOptionType } from 'discord.js';

const slash = new Slash({
	name: 'avatar',
	description: 'Fetch and display the profile picture of a user or yourself.',
	options: [
		{
			name: 'user',
			type: ApplicationCommandOptionType.User,
			description: 'The user whose avatar you want to fetch.',
			required: false,
		},
	],
});

slash.execute(async (interaction) => {
	try {
		// Defer reply to ensure no timeout
		await interaction.deferReply();

		// Get the user
		const user = interaction.options.getUser('user') || interaction.user;

		// Generate avatar URL
		const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

		// Reply with the user's avatar
		await interaction.followUp({
			content: `🖼️ Here's the avatar of **${user.tag}**:\n${avatarUrl}`,
		});
	} catch (error) {
		console.error('Error handling avatar command:', error);
		await interaction.followUp({
			content: '❌ An error occurred while fetching the avatar.',
			ephemeral: true,
		});
	}
});

export { slash };
