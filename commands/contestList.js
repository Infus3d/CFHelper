const {SlashCommandBuilder, EmbedBuilder, Embed} = require('discord.js');
const getContests = require('../functions/getContests.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contestlist')
        .setDescription('Get future contest list from codeforces'),
    async execute(interaction){
        try{
            let contestListEmbed = await getContests(null, null, '0x0099FF');
            if(!contestListEmbed){
                interaction.reply(`Couldn't retreive any upcoming contests`);
            } else {
                contestListEmbed.setTitle('Future contests listed on Codeforces');
                await interaction.reply({embeds: [contestListEmbed]});
            }
        } catch(error){
            console.error(error);
        }
    },
}