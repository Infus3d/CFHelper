const {SlashCommandBuilder} = require('discord.js');
const User = require('../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('handle')
        .setDescription('Returns the codeforces handle for the discord user, or vice versa')
        .addSubcommand(subcommand => subcommand
            .setName('discord-to-cf')
            .setDescription('Get CF handle for the discord user')
            .addUserOption(option => option
                .setName('discorduser')
                .setDescription('The discord user')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('cf-to-discord')
            .setDescription('Get Discord user for the CF handle')
            .addStringOption(option => option
                .setName('cfhandle')
                .setDescription('The CF handle')
                .setRequired(true))),
    async execute(interaction){
        try{
            let user = null;
            switch(interaction.options.getSubcommand()){
                case 'discord-to-cf':
                    let discordUserId = interaction.options.getUser('discorduser').id;
                    if(!discordUserId) discordUserId = interaction.user.id;
                    user = await User.findOne({userId: discordUserId});
                    if(!user){
                        // user = await interaction.client.users.fetch(discordUserId);
                        console.log(discordUserId);
                        await interaction.reply(`There is no CF handle associated with <@${discordUserId}>`);
                    } else {
                        await interaction.reply(`CF handle for <@${user.userId}>: ` + "`" + user.handle + "`");
                    }
                    break;
                case 'cf-to-discord':
                    const CFhandle = interaction.options.getString('cfhandle');
                    user = await User.findOne({handle: CFhandle});
                    if(!user){
                        await interaction.reply(`There is no Discord user associated with handle ` + "`" + CFhandle + "`");
                    } else {
                        await interaction.reply(`Discord user with handle ` + "`" + CFhandle + "`" + `: <@${user.userId}>`);
                    }
                    break;
            }
        } catch (err){
            console.error(err);
        }
    },
}