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
			required: false, // Optional: Defaults to the interaction user if not provided
		},
	],
});

slash.execute(async (interaction) => {
	// Fetch the target user from the command options or default to the interaction user
	const user = interaction.options.getUser('user') || interaction.user;

	// Correctly output the user's tag
	const userName = user.tag; // user.tag gives "username#1234"

	// Generate the avatar URL
	const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 }); // Dynamic for GIF avatars, size for better quality

	// Reply with the avatar and the CORRECT target user's name
	return interaction.reply({
		content: `🖼️ Here's the avatar of **${userName}**:\n${avatarUrl}`,
	});
});

export { slash };
