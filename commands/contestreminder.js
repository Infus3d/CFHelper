const {SlashCommandBuilder} = require('discord.js');
const getContests = require('../functions/getContests.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contestreminder')
        .setDescription('Enables/Disables 24 and 2 hour reminders for CF contests')
        .addBooleanOption(option => 
            option.setName('enable')
                .setDescription('true/false')
                .setRequired(true)
        ),
    async execute(interaction){
        const toEnable = interaction.options.getBoolean('enable');
        try{
            if(toEnable == true){
                const reminder = interaction.client.contestReminders.get(interaction.channelId);
                if(!reminder || reminder.status == false){
                    const intervalId = setInterval(async () => {
                        let contestListEmbed = await getContests(190800, 194400);
                        contestListEmbed.setTitle(`Contest(s) that start(s) in under 12 hours. Don't forget to register!`);
                        if(!contestListEmbed){
                            return;
                        } else {
                            interaction.client.channels.cache.get(interaction.channelId).send({embeds: [contestListEmbed]});
                        }
                    }, 30000);
                    interaction.client.contestReminders.set(interaction.channelId, {username: interaction.user.username, status: true, intervalId: intervalId});
                    await interaction.reply('Successfully ' + (!reminder ? 'enabled' : 'updated') + ' the contest reminders!');
                } else {
                    await interaction.reply(`The reminder was already enabled by ${reminder.username}!`);
                }
            } else {
                const reminder = interaction.client.contestReminders.get(interaction.channelId);
                if(!reminder){
                    await interaction.reply(`You can not disable because the reminders have never been enabled for this channel ${interaction.channel.name}`);
                } else if(reminder.status == false){
                    await interaction.reply(`The reminders are already disabled for this channel ${interaction.channel.name} by ${reminder.username}`);
                } else {
                    clearInterval(reminder.intervalId);
                    interaction.client.contestReminders.set(interaction.channelId, {username: interaction.user.username, status: false, intervalId: null});
                    await interaction.reply(`Successfully disabled the contest reminders!`);
                }
            }
        } catch(err) {
            console.error(err);
        }
    },
}