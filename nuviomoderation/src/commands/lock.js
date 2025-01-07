import { Slash } from 'sunar';
import { ApplicationCommandOptionType, ChannelType, PermissionsBitField } from 'discord.js';

const slash = new Slash({
    name: 'lock',
    description: 'Lock or unlock a channel to prevent or allow users from sending messages.',
    options: [
        {
            name: 'action',
            type: ApplicationCommandOptionType.String,
            description: 'Choose to lock or unlock the channel',
            required: true,
            choices: [
                { name: 'Lock', value: 'lock' },
                { name: 'Unlock', value: 'unlock' },
            ],
        },
        {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel to lock or unlock (defaults to the current channel if not specified)',
            required: false,
        },
    ],
});

slash.execute(async (interaction) => {
    const action = interaction.options.getString('action'); // "lock" or "unlock"
    const channel = interaction.options.getChannel('channel') || interaction.channel; // Defaults to current channel

    // Ensure the bot has permissions to manage roles and channels
    if (!interaction.guild?.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({
            content: 'I do not have permission to manage this channel!',
            ephemeral: true,
        });
    }

    // Check if the user executing the command has sufficient permissions
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({
            content: 'You do not have permission to lock or unlock channels!',
            ephemeral: true,
        });
    }

    // Check if the specified channel is a text-based channel
    if (channel.type !== ChannelType.GuildText) {
        return interaction.reply({
            content: 'You can only lock or unlock text channels!',
            ephemeral: true,
        });
    }

    try {
        // Lock or unlock the channel based on the action
        if (action === 'lock') {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false, // Prevent all members from sending messages in the channel
            });
            return interaction.reply({ content: `🔒 The channel ${channel.name} has been locked!` });
        } else if (action === 'unlock') {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: null, // Revert to default permission
            });
            return interaction.reply({ content: `🔓 The channel ${channel.name} has been unlocked!` });
        }
    } catch (error) {
        console.error('Error modifying permissions:', error);
        return interaction.reply({
            content: 'An error occurred while trying to lock or unlock the channel.',
            ephemeral: true,
        });
    }
});

export { slash };