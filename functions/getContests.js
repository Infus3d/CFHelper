const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = async function (lowerBound, upperBound, color){
    const res = await axios.get('https://codeforces.com/api/contest.list');
    let cnt = 0;
    // while((!res || res.data.status !== 'OK') && cnt < 100){
    //     res = await axios.get('https://codeforces.com/api/contest.list');
    //     cnt++;
    // }
    if(cnt > 1){
        console.log(`See? It worked. The cnt is ${cnt}`);
    }
    // console.log(res.data);
    
    // let replyString = "";
    let fields = [];
    for(const contest of res.data.result){
        if(contest.phase !== 'BEFORE') break;
        let seconds = -contest.relativeTimeSeconds;
        if(!((!lowerBound || lowerBound <= seconds) && (!upperBound || seconds < upperBound))) continue;

        let curField = new Object();
        const startDays = Math.floor((-contest.relativeTimeSeconds) / 86400);
        const startHours = Math.floor((-contest.relativeTimeSeconds) / 3600) % 24;
        const startMinutes = Math.floor(-contest.relativeTimeSeconds / 60) % 60;
        const durationDays = Math.floor((contest.durationSeconds) / 86400);
        const durationHours = Math.floor(contest.durationSeconds / 3600) % 24;
        const durationMinutes = Math.floor(contest.durationSeconds / 60) % 60;
        // replyString += `${contest.id} | ${contest.name} | duration: ${contest.durationSeconds} | time until start: ${startHours} hrs ${startMinutes} mins\n`;
        curField.name = contest.name;
        curField.value = "```" + `${contest.id} | until start: ${startDays}d ${startHours}h ${startMinutes}m | `
                        + `duration: ${durationDays}d ${durationHours}h ${durationMinutes}m` + "```";
        curField.inline = false;
        fields.push(curField);
    }
    if(fields.length == 0){
        return null;
    }
    fields.reverse();
    const embed = new EmbedBuilder()
                .setTitle('Default title')
                .setColor(color)
                .setURL('https://codeforces.com/contests')
                .addFields(fields)
                .setTimestamp();
    
    return embed;
};