const Discord = require("discord.js");
const dotenv = require("dotenv");
const interviewBot = require("./interview-bot.js");

dotenv.config({path: '../.env'});

console.log(process.env.TOKEN);


const client = new Discord.Client();

//const productionEnv = !(process.env.ENVIRONMENT === "DEV");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    console.log(msg);
    interviewBot(msg);
});

client.login(process.env.TOKEN);