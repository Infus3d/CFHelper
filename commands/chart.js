const {SlashCommandBuilder} = require('discord.js');
const getRatingChart = require('../functions/getRatingChart');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chart')
        .setDescription('Replies with pong')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('The type of the chart')
            .setRequired(true)
            .addChoices(
                {name: 'CF rating', value: 'rating'},
                {name: 'Problems solved', value: 'solved'}
            ),
        )
        .addStringOption(option =>
            option.setName('userhandle')
            .setDescription('Handle of the user')
            .setRequired(true)
        ),
    async execute(interaction){
        try{
            // await interaction.reply(`${interaction.options.getString('type')} was the option you provided sire!`);
            const type = interaction.options.getString('type');
            const userHandle = interaction.options.getString('userhandle');
            switch(type){
                case 'rating':
                    let ratingEmbed = await getRatingChart(userHandle, '#d24dff');
                    if(!ratingEmbed){
                        await interaction.reply(`Something went wrong. Could not retreive the data`);
                    } else {
                        await interaction.reply(ratingEmbed);
                    }
                    break;
                case 'solved':
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    },
}