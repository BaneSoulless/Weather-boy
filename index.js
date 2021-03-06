const Discord = require("discord.js")
require("dorenv").config()

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
});

let bot = {
    client,
    prefix: "w.",
    owners: ["240924428588941312"]
}

client.commands = new Discord.Collection()
client.events = new Discord.Collection()

const { prefix, token, apitoken } = require('./config.json');
const axios = require('axios')

client.once('ready', () => {
    console.log('Ready!');
});

const exampleEmbed = (
	temp,
	maxTemp,
	minTemp,
	pressure,
	humidity,
	wind,
	cloudness,
	icon,
	author,
	profile,
	cityName,
	country
) =>
	new Discord.RichEmbed()
		.setColor('#0099ff')
		.setAuthor(`**BUONGIORNO ENDER CREEK!**`)
		.setTitle(`Ci sono attualmente`, `${temp}\u00B0 C`,`in Ender Creek`)
		.addField(`Le Temperature Massime sono di:`, `${maxTemp}\u00B0 C`, true)
		.addField(`Le Temperature Minime sono di:`, `${minTemp}\u00B0 C`, true)
		.addField(`Umidità:`, `${humidity} %`, true)
		.addField(`Velocità dei venti:`, `${wind} m/s`, true)
		.addField(`Pressione Atmosferica:`, `${pressure} hpa`, true)
		.addField(`Nuvolosità:`, `${cloudness}`, true)
		.setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
		.setFooter('Si ringraziano i Satrapi per la gentile concessione di questo spazio Metereologico!');


const helpEmbed = () =>
    new Discord.RichEmbed()
        .setColor('#0099ff')
        .addField("Use '#w (City Name)' to get weather information", "For Example '#w london'", true)
        .addBlankField()
        .addField("Use '#ping' or '#beep'", 'Try it.', true)
        .addBlankField()
        .addField("Use '#server-info' to get informatin about server", "For Example '#server-info'", true)
        .addBlankField()
        .addField("Use '#user-info' to get informatin about your profile", "For Example '#user-info'", true)
        .addBlankField()
        .setFooter('Si ringraziano i Satrapi per la gentile concessione di questo spazio Metereologico!');


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (message.content === prefix + 'ping') {
        message.reply('Ping-Pong!');
    } else if (message.content === prefix + 'help') {
        message.channel.send(helpEmbed());
    }
    else if (message.content === prefix + 'beep') {
        message.reply('Beep-Boop!');
    } else if (message.content === prefix + 'server-info') {
        message.channel.send('Guild name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
    } else if (message.content === prefix + 'user-info') {
        message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
    }
    else if (command === 'w' || 'weather') {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=${apitoken}`
            )
            .then(response => {
                let apiData = response;
                let currentTemp = Math.ceil(apiData.data.main.temp)
                let maxTemp = apiData.data.main.temp_max;
                let minTemp = apiData.data.main.temp_min;
                let humidity = apiData.data.main.humidity;
                let wind = apiData.data.wind.speed;
                let author = message.author.username
                let profile = message.author.displayAvatarURL
                let icon = apiData.data.weather[0].icon
                let cityName = `Ender Creek`
                let pressure = apiData.data.main.pressure;
                let cloudness = apiData.data.weather[0].description;
                message.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
            }).catch(err => {
                message.reply(`Enter a vailid city name`)
            })
    }
}
)

client.login(process.env.TOKEN)