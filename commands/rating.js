const {SlashCommandBuilder} = require('discord.js');
const User = require('../schemas/User');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rating')
        .setDescription('Gets current and max ratings for a user. Leave the argument empty for your own handle')
        .addStringOption(option => option
            .setName('handle')
            .setDescription('CF handle of the user')),
    async execute(interaction){
        let handle = interaction.options.getString('handle');
        const user = await User.findOne({userId: interaction.user.id});
        if(!handle && !user){
            await interaction.reply(`There is no associated CF handle for ${interaction.user.tag}. Please enter the handle manually`);
            return;
        }
        if(!handle) handle = user.handle;
        const res = await axios.get('https://codeforces.com/api/user.info', {params: {handles: handle}});
        // console.log(res);
        if(!res || res.data.status !== 'OK'){
            await interaction.reply('There was an error while contacting codeforces. Please try again.');
            return;
        }
        await interaction.reply("```" + `Rating: ${res.data.result[0].rating} (${res.data.result[0].rank})\nMax Rating: ${res.data.result[0].maxRating} (${res.data.result[0].maxRank})` + "```");
    },
}