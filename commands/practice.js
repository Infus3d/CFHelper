const {SlashCommandBuilder} = require('discord.js');
const getRandomProblem = require('../functions/getRandomProblem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('practice')
        .setDescription('Gives a random problem for practice for given difficulty range')
        .addIntegerOption(option => option
            .setName('min')
            .setDescription('Minimum difficulty'))
        .addIntegerOption(option => option
            .setName('max')
            .setDescription('Maximum difficulty')),
    async execute(interaction){
        try{
            const L = interaction.options.getInteger('min');
            const R = interaction.options.getInteger('max');
            if(L != null && R != null && L > R){
                await interaction.reply(`Please enter a valid range for` + " `min` and `max`");
                return;
            }
            const embed = await getRandomProblem(L, R);
            if(!embed){
                interaction.reply(`There was an error while retreiving the problem. Please make sure your difficulty range is within` + " `[800, 3500]`");
            } else {
                // console.log('hello?');
                await interaction.reply({embeds: [embed]});
            }
        } catch (err){
            console.error(err);
        }
    },
}