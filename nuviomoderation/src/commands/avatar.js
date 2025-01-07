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
       try {
           const user = interaction.options.getUser('user') || interaction.user;
           const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

           await interaction.reply({
               content: `🖼️ Here's the avatar of **${user.tag}**: ${avatarUrl}`,
           });
       } catch (error) {
           console.error('Error fetching avatar:', error);
           await interaction.reply({
               content: '❌ An error occurred while fetching the avatar.',
               ephemeral: true,
           });
       }
   });

export { slash };
