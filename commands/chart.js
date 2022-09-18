const {SlashCommandBuilder} = require('discord.js');
const getRatingChart = require('../functions/getRatingChart');
const getSolvedHistogram = require('../functions/getSolvedHistogram');
const User = require('../schemas/User');

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
            .setRequired(false)
        ),
    async execute(interaction){
        try{
            // await interaction.reply(`${interaction.options.getString('type')} was the option you provided sire!`);
            const type = interaction.options.getString('type');
            let handle = interaction.options.getString('userhandle');
            const user = await User.findOne({userId: interaction.user.id});
            if(!handle && !user){
                await interaction.reply(`There is no associated CF handle for ${interaction.user.tag}. Please enter the handle manually.`);
                return;
            }
            if(!handle) handle = user.handle;
            switch(type){
                case 'rating':
                    let ratingEmbed = await getRatingChart(handle, '#d24dff');
                    if(!ratingEmbed){
                        await interaction.reply(`Something went wrong. Could not retreive the data`);
                    } else {
                        await interaction.reply(ratingEmbed);
                    }
                    break;
                case 'solved':
                    interaction.deferReply();
                    let solvedEmbed = await getSolvedHistogram(handle, '#d24dff');
                    if(!solvedEmbed){
                        await interaction.editReply('Somthing went wrong. Could not retrieve the problems solved');
                    } else {
                        await interaction.editReply(solvedEmbed);
                    }
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    },
}