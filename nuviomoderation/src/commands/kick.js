import { Slash } from 'sunar'; // Adjust import based on your specific library structure
import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';

const slash = new Slash({
    name: 'kick',
    description: 'Kick a user from the server',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user to kick',
            required: true,
        },
    ],
});

slash.execute(async (interaction) => {
    // Fetch the member to be kicked from the interaction options
    const member = interaction.options.getMember('user');

    if (!member) {
        return interaction.reply({ content: 'Could not find this user in the server.', ephemeral: true });
    }

    // Check if the command user has "Kick Members" permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: 'You do not have permission to kick members!', ephemeral: true });
    }

    // Check if the bot itself can kick the target user
    if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: 'I do not have permission to kick members.', ephemeral: true });
    }

    // Role hierarchy check
    if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) {
        return interaction.reply({ content: 'I cannot kick this user due to role hierarchy.', ephemeral: true });
    }

    // Role hierarchy for the command user (if needed)
    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ content: 'You cannot kick a user with a higher or equal role.', ephemeral: true });
    }

    try {
        // Attempt to kick the user
        await member.kick();
        return interaction.reply({ content: `${member.user.tag} has been successfully kicked.` });
    } catch (error) {
        console.error('Error occurred while kicking a user:', error);
        return interaction.reply({
            content: 'An error occurred while trying to kick this user.',
            ephemeral: true
        });
    }
});

export { slash };