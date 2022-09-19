const {SlashCommandBuilder} = require('discord.js');
const getContests = require('../functions/getContests.js');
const Reminder = require('../schemas/Reminder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contestreminder')
        .setDescription('Enables/Disables the last 24 hour reminders for CF contests')
        .addBooleanOption(option => 
            option.setName('enable')
                .setDescription('true/false')
                .setRequired(true)
        ),
    async execute(interaction){
        const toEnable = interaction.options.getBoolean('enable');
        try{
            const reminder = await Reminder.findOne({guildId: interaction.guild.id, channelId: interaction.channel.id});
            if(toEnable == true){
                // const reminder = interaction.client.contestReminders.get(interaction.channelId);
                if(!reminder || reminder.status == false){
                    const intervalId = setInterval(async () => {
                        let contestListEmbed = await getContests(0, 50400, '57F287'); //39600, 43200
                        if(!contestListEmbed){
                            return;
                        } else {
                            contestListEmbed.setTitle(`Contests that start in under 12 hours. Don't forget to register!`);
                            const neededChannel = await interaction.client.channels.fetch(interaction.channelId);
                            await neededChannel.send({embeds: [contestListEmbed]});
                        }
                    }, 10000); //3600000
                    // interaction.client.contestReminders.set(interaction.channelId, {username: interaction.user.username, status: true, intervalId: intervalId});
                    await updateReminder(interaction, true, intervalId);
                    await interaction.reply('Successfully ' + (!reminder ? 'enabled' : 'updated') + ' the contest reminders!');
                } else {
                    await interaction.reply(`The reminder was already enabled by ${reminder.username}!`);
                }
            } else {
                // const reminder = interaction.client.contestReminders.get(interaction.channelId);
                if(!reminder){
                    await interaction.reply(`You can not disable because the reminders have never been enabled for this channel ${interaction.channel.name}`);
                } else if(reminder.status == false){
                    await interaction.reply(`The reminders are already disabled for this channel ${interaction.channel.name} by ${reminder.userTag}`);
                } else {
                    clearInterval(reminder.intervalId);
                    // interaction.client.contestReminders.set(interaction.channelId, {username: interaction.user.username, status: false, intervalId: null});
                    await updateReminder(interaction, false, -1);
                    await interaction.reply(`Successfully disabled the contest reminders!`);
                }
            }
        } catch(err) {
            console.error(err);
        }
    },
}

async function updateReminder(interaction, isEnabled, intervalId){
    await Reminder.deleteOne({guildId: interaction.guild.id, channelId: interaction.channel.id});
    const newReminder = new Reminder({
        userTag: interaction.user.tag, 
        status: isEnabled, 
        intervalId: intervalId,
        guildId: interaction.guild.id,
        channelId: interaction.channel.id,
        userId: interaction.user.id,
    });
    await newReminder.save();
}