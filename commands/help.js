const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        let str = "```";
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, file));
            str += `/${command.data.name}: ${command.data.description} \n\n`;
        }

        str += "```";
        return interaction.reply(str);
    },
};