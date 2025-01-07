import { Slash } from 'sunar';
import { ApplicationCommandOptionType } from 'discord.js';

const slash = new Slash({
    name: 'membercount',
    description: 'Shows the number of members in the server, including users and bots.',
});

slash.execute(async (interaction) => {
    try {
        // Fetch the guild from the interaction
        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true,
            });
        }

        // Fetch members to calculate the number of users and bots
        const members = await guild.members.fetch(); // Fetch full list of members
        const totalMembers = members.size; // Total members
        const botCount = members.filter(member => member.user.bot).size; // Count bots
        const userCount = totalMembers - botCount; // Calculate only users

        // Send a detailed member count
        return interaction.reply({
            content: `👥 This server has **${totalMembers}** members.\n- **Users**: ${userCount}\n- **Bots**: ${botCount}`,
        });
    } catch (error) {
        console.error('Error fetching member count:', error);
        interaction.reply({
            content: 'An error occurred while fetching the member count.',
            ephemeral: true,
        });
    }
});

export { slash };