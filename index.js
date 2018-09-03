var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 3000
app.use(express.static(__dirname + "/"))
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)
var wss = new WebSocketServer({server: server})
console.log("websocket server created")
wss.on("connection", function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(new Date()), function() {  })
    }, 1000)

    console.log("websocket connection open")

    ws.on("close", function() {
        console.log("websocket connection close")
        clearInterval(id)
    })
});

const TelegramBot = require('node-telegram-bot-api');
const token = '694156014:AAGSi9FtWPbHODSAowRylOPtHmLUPDSN2i4';
const bot = new TelegramBot(token, {polling: true});
var url="https://script.google.com:443/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k/exec?action=read-all-data&amp;alt=json";
var callapi = require('request');

var moment = require('moment');



var timeStamp=0;
var  parsed=[];

bot.on('message', (msg) => {
	if(msg.text.toString()=="reload data sheet"){
		reloadData();
	}else{
		var request = change_alias(msg.text.toString());
        handling(msg,request);
	}
    
});

function reloadData(){
	callapi(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            parsed = JSON.parse(body);
        }else {
			reloadData();
            bot.sendMessage(612137896, "Du lieu google sheet dang bi loi" );
			bot.sendMessage(612137896, "error:"+ error );
        }
    });
}



function handling(msg,request) {
    
    parsed.Data.forEach(element=>{
            var handingChat= true;
            if(request.search(change_alias(element.keyword)) === 0){
                var items = [];
                items.push(element.answer);
                if(element.answer2 != '' ){
                    items.push(element.answer2)
                };
                if(element.answer3 != '' ){
                    items.push(element.answer3)
                };
                if(element.answer4 != '' ){
                    items.push(element.answer4)
                };
                if(element.answer5 != '' ){
                    items.push(element.answer5)
                };
                if(items.length==1){
                    sendMsg(msg.chat.id,items[0]);
                }
                if(items.length>1){
                    getRandom(items,msg);
                }
                return;

            }});

}

var tam="";
function  getRandom(items,msg){
    var messs = items[Math.floor(Math.random()*items.length)];
    if(tam != messs){
        bot.sendMessage(msg.chat.id , messs);
        tam = messs;
    }else {
        getRandom(items,msg);
    }
}

 var listTime =[20,25,30,15];


function  sendMsg(id,msss){
    var endTime = moment().valueOf();
    var duration =parseInt((endTime-timeStamp)/1000);
    var random = listTime[Math.floor(Math.random()*listTime.length)];
    if(duration>random){
        bot.sendMessage(id , msss,{parse_mode : "HTML"});
        timeStamp=moment().valueOf();
    }

}





















































function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}



bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Xin chào");

});

