var moment = require('moment');
var Scheduler = require('./scheduler.js');

var interviewers = {};
var scheduler = new Scheduler();

module.exports = function handleMessage(message) {
    var messageContents = message.content.split(' ');

    function showHelpMenu() {
        message.reply(
            'Hi! Here is a list of available commands:\n' +
            '"!interview schedule [interviewee] [time] - schedule an interview\n' +
            '"!interview unschedule [interviewee] - unschedule an interview\n' + 
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
        showUpcomingInterviews(interviewer);
    }

    function unscheduleInterview(interviewer, interviewee) {
        if(interviewers.hasOwnProperty(interviewer)) {
            let obj = interviewers[interviewer];

            if(obj.hasOwnProperty(interviewee)){
                delete obj[interviewee];
            }
        }

        showUpcomingInterviews(interviewer);
    }

    function showUpcomingInterviewees(interviewer) {
        if(interviewers.hasOwnProperty(interviewer)){
            let obj = interviewers[interviewer];
            let reply = 'Here are you upcoming interviewees: \n';

            for(var i in obj) {
                reply += i + ' at ' + obj[i] + '\n';
            }

            message.reply(reply);
        }
        else {
            message.reply('You currently have no scheduled interviews.');
        }
    }

    function showUpcomingInterviews(interviewee) {
        var reply = "";

        for(var i in interviewers) {
            let obj = interviewers[i];

            if(obj.hasOwnProperty(interviewee)) {
                let time = obj[interviewee];

                reply += time + ' with ' + i;
            }
        }

        if(reply !== "") {
            message.reply(
                'You have the following interviews scheduled:\n' +
                reply
            );            
        }
    }

    function setAvailability(interviewer, date, time) {
        let parsedDate = moment(date);
        let parsedTime = moment(time);


        scheduler.setSchedule(interviewer, parsedDate);
    }

    function showAvailabilities() {
        let str = scheduler.getAvailabilities();

        if(str === '') {
            message.reply('There are currently no openings.');
        }
        else {
            message.reply(str);
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
                    showUpcomingInterviewees(message.author.username);
                    showUpcomingInterviews(message.author.username);
                    break;

                case 'unschedule':
                    if(messageContents.length < 3) {
                        showError();
                    }
                    else {
                        let interviewee = messageContents[2];

                        unscheduleInterview(message.author.username, interviewee);
                    }
                    break;

                case 'set-availability':
                    if(messageContents.length < 4) {
                        showError();
                    }
                    else {
                        let date = messageContents[2];
                        let time = messageContents[3];

                        setAvailability(message.author.username, date, time);
                    }

                case 'get-availabilities':
                    showAvailabilities();

                default:
                    showHelpMenu();
                    break;

            }
        }
    }
};