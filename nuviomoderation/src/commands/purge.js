import { Slash } from 'sunar';
import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';

const slash = new Slash({
    name: 'purge',
    description: 'Delete a specified number of messages from a channel.',
    options: [
        {
            name: 'amount',
            type: ApplicationCommandOptionType.Integer,
            description: 'The number of messages to delete (between 1 and 100)',
            required: true,
        },
    ],
});

slash.execute(async (interaction) => {
    // Check if the user has the required permission to manage messages
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return interaction.reply({
            content: '❌ You do not have permission to manage messages!',
            ephemeral: true,
        });
    }

    // Ensure the bot also has the required permission
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return interaction.reply({
            content: '❌ I do not have permission to manage messages in this channel!',
            ephemeral: true,
        });
    }

    // Parse the amount of messages to delete
    const amount = interaction.options.getInteger('amount');

    // Validate the amount
    if (amount < 1 || amount > 100) {
        return interaction.reply({
            content: '❌ Please provide a number between 1 and 100.',
            ephemeral: true,
        });
    }

    try {
        // Bulk delete messages
        await interaction.channel.bulkDelete(amount, true); // "true" skips messages older than 14 days
        interaction.reply({
            content: `✅ Successfully deleted **${amount}** messages.`,
            ephemeral: true,
        });
    } catch (error) {
        console.error('Error deleting messages:', error);
        interaction.reply({
            content: '❌ An error occurred while trying to purge messages.',
            ephemeral: true,
        });
    }
});

export { slash };