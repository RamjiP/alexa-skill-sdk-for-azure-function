var event = function (req) {
    var EventEmitter = require('events');
    var ee = new EventEmitter();
    for (var prop in req.body) {
        if(prop){
            ee[prop] = req.body[prop];
        }
    }
    return ee;
};

module.exports = event;
