import { Slash } from 'sunar';
import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';

const warnings = new Map();

const slash = new Slash({
    name: 'warn',
    description: 'Warn a user for breaking rules.',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user to warn',
            required: true,
        },
        {
            name: 'reason',
            type: ApplicationCommandOptionType.String,
            description: 'The reason for this warning',
            required: true,
        },
    ],
});

slash.execute(async (interaction) => {
    // Fetch the user to warn
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    // Permissions check for the command executor
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return interaction.reply({ content: 'You do not have permission to warn users!', ephemeral: true });
    }

    // Check if the user to warn exists and isn't a bot
    if (!user) {
        return interaction.reply({ content: 'Could not find that user.', ephemeral: true });
    }
    if (user.bot) {
        return interaction.reply({ content: 'You cannot warn a bot.', ephemeral: true });
    }

    // Increment the warning count for the user
    const guildWarnings = warnings.get(interaction.guild.id) || {};
    const userWarnings = guildWarnings[user.id] || [];
    userWarnings.push({ reason, date: new Date() }); // Add the new warning
    guildWarnings[user.id] = userWarnings;
    warnings.set(interaction.guild.id, guildWarnings); // Save the warnings back to the map

    // Notify user and interaction user of the warning
    interaction.reply({ content: `${user.tag} has been warned for: ${reason}` });
    try {
        await user.send(`You have been warned in **${interaction.guild.name}** for: ${reason}`);
    } catch (error) {
        console.log('Failed to send DM to user:', error);
    }
});

export { slash };