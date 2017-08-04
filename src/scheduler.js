// define(function() {
function Scheduler(name) {
    this.schedule = {}
    this.availabilities = {};
}

Scheduler.prototype._init = function() {

}

Scheduler.prototype.getAvailabilities = function() {
    let str = '';

    for(var i in this.availabilities) {
        let obj = this.availabilities[i];

        str += i + '\n';

        for(var j in obj) {
            str += j + ' ';
        }
        
        str += '\n';
    }

    return str;
}

//Retrieves the schedule for a specific user (interviewer)
Scheduler.prototype.getSchedule = function(interviewer) {
    if(interviewer === undefined) {

    }
}

Scheduler.prototype.setSchedule = function(interviewer, date) {
    if(!this.availabilities.hasOwnProperty(interviewer)) {
        this.availabilities[interviewer] = [];
    }
    
    this.availabilities[interviewer].push(date);
}

module.exports = Scheduler;

// });
