const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const Problem = require('../schemas/Problem');
const Contest = require('../schemas/Contest');

module.exports = async function (L, R){
    if(!L || L < 0) L = 0;
    if(!R || R > 3500) R = 3500;
    // console.log(L + " and " + R + " :)");
    const problems = await Problem.find().where('rating').gte(L).lte(R);
    // console.log(problems);
    if(!problems || problems.length == 0) return null;

    const idx = Math.floor(Math.random() * (problems.length));
    const problem = problems[idx];
    const contest = await Contest.findOne({id: problem.contestId});
    // console.log(contest + " and the problem.contestId " + problem.contestId + " name " + contest.type);
    const embed = new EmbedBuilder()
        .setTitle(`${problem.index}. ${problem.name}`)
        .setURL(`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`)
        .setDescription(`${contest.name}\nDifficulty: ${problem.rating}`)
        .setTimestamp();

    // console.log(embed);

    return embed;
};