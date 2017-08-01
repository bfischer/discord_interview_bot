//var Discord = require('discord.io');
// var logger = require('winston');
// //var auth = require('./auth.json');
// // Configure logger settings
// logger.remove(logger.transports.Console);
// logger.add(logger.transports.Console, {
//     colorize: true
// });
// logger.level = 'debug';
// Initialize Discord Bot
// var bot = new Discord.Client({
//    token: auth.token,
//    autorun: true
// });
// bot.on('ready', function (evt) {
//     logger.info('Connected');
//     logger.info('Logged in as: ');
//     logger.info(bot.username + ' - (' + bot.id + ')');
// });
// bot.on('message', function (user, userID, channelID, message, evt) {
//     // Our bot needs to know if it will execute a command
//     // It will listen for messages that will start with `!`
//     if (message.substring(0, 1) == '!') {
//         var args = message.substring(1).split(' ');
//         var cmd = args[0];
       
//         args = args.splice(1);
//         switch(cmd) {
//             // !ping
//             case 'ping':
//                 bot.sendMessage({
//                     to: channelID,
//                     message: 'Pong!'
//                 });
//             break;
//             // Just add any case commands if you want to..
//          }
//      }
// });

var interviewers = {};

module.exports = function handleMessage(message) {
    var messageContents = message.content.split(' ');

    function showHelpMenu() {
        message.reply(
            'Hi! Here is a list of available commands:\n' +
            '"!interview schedule [interviewer] [interviewee] [time] - schedule an interview\n' +
            '"!interview unschedule [interviewer] [interviewee] - unschedule an interview\n' + 
            '"!interview show" - show your upcoming interviews\n'
        );
    };

    function showError() {
        message.reply(
            'Oops! I\'m not able to understand that message :( \n' +
            'Here are some commands I recognize: \n'
        );
    }

    function scheduleInterview(interviewer, interviewee, time) {
        var obj = {};

        if(interviewers.hasOwnProperty(interviewer)) {
            obj = interviewers[interviewer];
            obj[interviewee] = time;
        }
        else {
            obj[interviewee] = time;
            interviewers[interviewer] = obj;
        }

        message.reply('Scheduled!');
    }

    function unscheduleInterivew(interviewer, interviewee) {
        if(interviewers.hasOwnProperty(interviewer)) {
            let obj = interviewers[interviewer];

            if(obj.hasOwnProperty(interviewee)){
                delete obj[interviewee];
            }
        }

        showUpcomingInterviews(interviewer);
    }

    function showUpcomingInterviews(interviewer) {
        if(interviewers.hasOwnProperty(interviewer)){
            let obj = interviewers[interviewer];
            let reply = 'Here are your upcoming interviews: \n';

            for(var i in obj) {
                reply += i + ' at ' + obj[i] + '\n';
            }

            message.reply(reply);
        }
        else {
            message.reply('You currently have no scheduled interviews.');
        }
    }

    if (message.content.toLowerCase().startsWith('!interview')){
        if(messageContents.length > 1) {
            var command = messageContents[1];

            switch(command) {
                case 'help':
                    showHelpMenu();
                    break;
                
                case 'schedule' :
                    if(messageContents.length < 4) {
                        showError();
                    }
                    else {
                        let interviewee = messageContents[2];
                        let time = messageContents[3];

                        scheduleInterview(message.author.username, interviewee, time);
                    }
                    break;
                
                case 'show':
                    showUpcomingInterviews(message.author.username);
                    break;

                default:
                    showHelpMenu();
                    break;

            }
        }
    }
};