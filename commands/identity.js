const {SlashCommandBuilder, EmbedBuilder, Embed} = require('discord.js');
const Identification = require('../schemas/Identification');
const User = require('../schemas/User');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('identity')
        .setDescription('Helps to associate CF profile with discord account')
        .addSubcommand(subcommand => subcommand
            .setName('identify')
            .setDescription('Identify yourself with your CF profile')
            .addStringOption(option => option.setName('handle').setDescription('Codeforces handle name').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('verify')
            .setDescription('Verify your submission on CF'))
        .addSubcommand(subcommand => subcommand
            .setName('cancel')
            .setDescription('Cancel ongoing identification, if any')),
    async execute(interaction){
        try{
            const identification = await Identification.findOne({userId: interaction.user.id});
            // console.log(`Identification is ${identification}`);
            switch(interaction.options.getSubcommand()){
                case 'identify':
                    if(!identification){
                        const problem = await getRandomProblem();
                        if(!problem){
                            interaction.reply('There was an error while contacting codeforces. Please try again.');
                            return;
                        }
                        const timeOutId = setTimeout(async () => {
                            await Identification.deleteOne({userId: interaction.user.id});
                            await interaction.reply('Your 5 min timer has expired for your last identification. Please start a new one.');
                        }, 300000);
                        const embed = getProblemEmbed(problem);
                        const newIdentification = new Identification({
                            guildId: interaction.guild.id,
                            channelId: interaction.channel.id,
                            userId: interaction.user.id,
                            userTag: interaction.user.tag,
                            handle: interaction.options.getString('handle'),
                            timeOutId: timeOutId,
                            problem: {
                                contestId: problem.contestId,
                                index: problem.index,
                                name: problem.name,
                                rating: problem.rating,
                            }
                        });
                        await newIdentification.save();
                        await interaction.reply({embeds: [embed]});
                    } else {
                        const embed = getProblemEmbed(identification.problem);
                        await interaction.reply(`There is an ongoing identificatoin for ` + "`" + identification.userTag + "`" +  `with CF handle ` + "`" + identification.handle + "`",
                                {embeds: [embed]});
                    }
                    break;
                case 'verify':
                    if(!identification){
                        await interaction.reply('You do not have an ongoing identification for ' + "`" + interaction.user.tag + "`");
                    } else {
                        const verdict = await isPresent(identification);
                        if(verdict === null){
                            await interaction.reply('There was an error while contacting codeforces. Please try again.');
                        } else if(verdict == false){
                            await interaction.reply('Verification unsuccessful. Please make sure you have' + blockify(`${identification.problem.contestId}-${identification.problem.index}`) 
                            + 'as your last submission for' + blockify(identification.handle) + ' handle');
                        } else {
                            clearTimeout(identification.timeOutId);
                            await Identification.deleteOne({userId: interaction.user.id});
                            const newUser = new User({
                                userId: interaction.user.id,
                                userTag: interaction.user.tag,
                                handle: identification.handle,
                            });
                            await newUser.save();
                            await interaction.reply('Successfully verified handle' + blockify(identification.handle) + 'for' + blockify(interaction.user.tag));
                        }
                    }
                    break;
                case 'cancel':
                    if(!identification){
                        await interaction.reply(`You do not have an ongoing identification for` + "`" + interaction.user.tag + "`");
                    } else {
                        clearTimeout(identification.timeOutId);
                        await Identification.deleteOne({userId: interaction.user.id});
                        await interaction.reply(`Successfully cancelled the identification process for ` + "`" + interaction.user.tag + "`");
                    }
                    break;
            }
        } catch(err) {
            console.error(err);
        }
    },
}

function blockify(inString){
    return " `" + inString + "` ";
}

async function getRandomProblem(){
    const res = await axios.get('https://codeforces.com/api/problemset.problems', { params: {tags: 'implementation;math;'} });
    if(!res || res.data.status !== 'OK') return null;
    const idx = Math.floor(Math.random() * (res.data.result.problems.length));
    return res.data.result.problems[idx];
}

function getProblemEmbed(problem){
    if(!problem) return null;
    const embed = new EmbedBuilder()
                .setTitle(`${problem.contestId}-${problem.index}: ${problem.name}`)
                .setURL(`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`)
                .setDescription("Please make a submission to this problem to verify your identity. The submission doesn't have to be accepted. Type `/identity verify` after your submission. You have 5 mins from the time you first identified to verify your handle.")
                .setTimestamp();

    return embed;
}

async function isPresent(identification){
    const res = await axios.get('https://codeforces.com/api/user.status', {params: {handle: identification.handle, count: 10}});
    if(!res || res.data.status !== 'OK') return null;
    for(const submission of res.data.result){
        if(submission.problem.contestId === identification.problem.contestId && 
            submission.problem.index === identification.problem.index){
                return true;
            }
    }
    return false;
}