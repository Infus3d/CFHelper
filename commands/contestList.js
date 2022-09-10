const {SlashCommandBuilder, EmbedBuilder, Embed} = require('discord.js');
const getContests = require('../functions/getContests.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contestlist')
        .setDescription('Get future contest list from codeforces'),
    async execute(interaction){
        try{
            // const res = await axios.get('https://codeforces.com/api/contest.list');
            // console.log(res.data);
            
            // let replyString = "";
            // let fields = [];
            // for(const contest of res.data.result){
            //     if(contest.phase === 'FINISHED') break;
            //     let curField = new Object();
            //     const startDays = Math.floor((-contest.relativeTimeSeconds) / 86400);
            //     const startHours = Math.floor((-contest.relativeTimeSeconds) / 3600) % 24;
            //     const startMinutes = Math.floor(-contest.relativeTimeSeconds / 60) % 60;
            //     const durationDays = Math.floor((-contest.relativeTimeSeconds) / 86400);
            //     const durationHours = Math.floor(contest.durationSeconds / 3600) % 24;
            //     const durationMinutes = Math.floor(contest.durationSeconds / 60) % 60;
            //     replyString += `${contest.id} | ${contest.name} | duration: ${contest.durationSeconds} | time until start: ${startHours} hrs ${startMinutes} mins\n`;
            //     curField.name = contest.name;
            //     curField.value = "```" + `${contest.id} | until start: ${startDays}d ${startHours}h ${startMinutes}m | `
            //                     + `duration: ${durationDays} ${durationHours}h ${durationMinutes}m` + "```";
            //     curField.inline = false;
            //     fields.push(curField);
            // }
            
            // fields.reverse();
            // const embed = new EmbedBuilder()
            //             .setTitle('Future contests listed on Codeforces')
            //             .setColor('0x0099FF')
            //             .setURL('https://codeforces.com/contests')
            //             .addFields(fields)
            //             .setTimestamp();
            let contestListEmbed = await getContests(null, null);
            contestListEmbed.setTitle('Future contests listed on Codeforces');
            await interaction.reply({embeds: [contestListEmbed]});
        } catch(error){
            console.error(error);
        }
    },
}