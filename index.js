const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, GatewayIntentBits} = require('discord.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Reminder = require('./schemas/Reminder.js');
const getContests = require('./functions/getContests.js');

dotenv.config();

const client = new Client({intents : [GatewayIntentBits.Guilds]});

client.commands = new Collection();
client.contestReminders = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles){
    const filePath  = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

async function startUp(){
    try{
        const allReminders = await Reminder.find();
        if(!allReminders) return;
        for(const reminder of allReminders){
            if(reminder.status == false) continue;
            let newReminder = reminder;
            newReminder.intervalId = setInterval(async () => {
                let contestListEmbed = await getContests(0, 82800, '57F287'); //39600, 43200
                if(!contestListEmbed){
                    return;
                } else {
                    contestListEmbed.setTitle(`Contest(s) that start(s) in under 12 hours. Don't forget to register!`);
                    // console.log('This should be the output ' + await client.channels.fetch(reminder.channelId) + ` ${reminder.channelId} is of type ${typeof(reminder.channelId)}`);
                    const neededChannel = await client.channels.fetch(reminder.channelId);
                    console.log(neededChannel);
                    await neededChannel.send({embeds: [contestListEmbed]});
                }
            }, 5000);
            await Reminder.findByIdAndUpdate(reminder.id, newReminder);
            console.log(`Successfully initiated the reminder for ${reminder.channelId} channel`);
        }
    } catch (err){
        console.error(err);
    }
}

// client.on('interactionCreate', async interaction => {
//     if(!interaction.isChatInputCommand()) return;

//     const command = interaction.client.commands.get(interaction.commandName);
//     if(!command) return;

//     try{
//         await command.execute(interaction);
//     } catch(error){
//         console.log(error);
//         await interaction.reply({content: 'There was an error while executing this command!', ephemeral : true});
//     }
// });

// client.once('ready', () => {
//     console.log('Simple Interaction Bot is up and running!');
// });

// runrunrun();
// async function runrunrun(){
//     const reminderone = new Reminder({userId: 109092019291902, userTag: 'Infused#2420', status: true});
//     await reminderone.save();
//     console.log(reminderone);
//     const a = await Reminder.findOne({userTag: 'blablabla'});
//     console.log(!a);
// }



mongoose.connect(process.env.mongodbToken,
    () => console.log('Successfully Connected to MongoDB Atlas'),
    (err) => console.error(err) );
client.login(process.env.token).then(async () => {
    await startUp();
});

