var moment = require('moment');



var startTime=moment().valueOf();
var endTime=0;
setTimeout(function () {
    var endTime=moment().valueOf();
    var duration =parseInt((endTime-startTime)/1000);
}, 10000);





