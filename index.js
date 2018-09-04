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
wss.on("connection", function (ws) {
    var id = setInterval(function () {
        ws.send(JSON.stringify(new Date()), function () {
        })
    }, 1000)

    console.log("websocket connection open")

    ws.on("close", function () {
        console.log("websocket connection close")
        clearInterval(id)
    })
});
var host = server.address().address;
var port = server.address().port;
console.log('running at http://' + host + ':' + port)

const TelegramBot = require('node-telegram-bot-api');
const token = '694156014:AAGSi9FtWPbHODSAowRylOPtHmLUPDSN2i4';
const bot = new TelegramBot(token, {polling: true});
var callapi = require('request');
var moment = require('moment');
var change_alias = require("./char.js");
var timeStamp = 0;
var parsed = [];
var baseUrl = "https://script.google.com/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k";

reloadData();

var lastMsgGroup = {id:null,lastMsg:null,timeStamp:null};
var listLastMsg =[];

bot.on('message', (msg) => {
    var request = change_alias(msg.text.toString());
    var idChat = msg.chat.id;
    if (request == "reload data sheet") {
        reloadData();
    } else {
        switch (msg.chat.type) {
            case "private":
                if (idChat != 398800833 && idChat != 612137896) {
                    bot.forwardMessage(398800833, msg.chat.id, msg.message_id);
                    bot.forwardMessage(612137896, msg.chat.id, msg.message_id);
                }
                break;
            case "group":
                updateGroupSheet(idChat, msg.chat.title);
                break;
            default:
                break;
        }
        handling(msg, request);
    }

});




function updateGroupSheet(idChat, title) {
    title = change_alias(title).replace(" ", "+");
    var url2 = baseUrl + "/exec?action=update-group&id=" + idChat + "&title=" + title;
    var request = require('request');
    request(url2, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body == "exist") {

            }
            if (body == "success") {
                bot.sendMessage(398800833, "Có một group mới đã được thêm vào sheet");
                bot.sendMessage(612137896, "Có một group mới đã được thêm vào sheet");
            }

        } else {
            bot.sendMessage(612137896, "Kiểm tra lỗi " + JSON.stringify(error));
        }
    });
}


function reloadData() {
    const urlGetALL = baseUrl + "/exec?action=read-all-data&alt=json";
    callapi(urlGetALL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            parsed = JSON.parse(body).Data;
            bot.sendMessage(398800833, "server update succesfuly!");
            bot.sendMessage(612137896, "server update succesfuly!");
        } else {
            bot.sendMessage(612137896, "Loading data ....");
            bot.sendMessage(398800833, "Loading data ....");
            reloadData();

        }
    });
}





















function handling(msg, request) {
    if (parsed == []) {
        reloadData();
    } else {
        parsed.forEach(element => {
            var handingChat = true;
            if (request.search(change_alias(element.keyword)) === 0) {
                var items = [];
                items.push(element.answer);
                if (element.answer2 != '') {
                    items.push(element.answer2)
                }
                ;
                if (element.answer3 != '') {
                    items.push(element.answer3)
                }
                ;
                if (element.answer4 != '') {
                    items.push(element.answer4)
                }
                ;
                if (element.answer5 != '') {
                    items.push(element.answer5)
                }
                ;
                if (items.length == 1) {
                    sendMsg(msg.chat.id, items[0]);
                }
                if (items.length > 1) {
                    getRandom(items, msg);
                }
                return;
            }
        });

    }

}

var tam = "";

function getRandom(items, msg) {
    var messs = items[Math.floor(Math.random() * items.length)];
    if (tam != messs) {
        bot.sendMessage(msg.chat.id, messs);
        tam = messs;
    } else {
        getRandom(items, msg);
    }
}

var listTime = [20, 25, 30, 15];


function sendMsg(id, msss) {
    if(listLastMsg.length>0){
        var flag=true;
        listLastMsg.forEach(element=>{
            if(id==element.id){
                if(msss==element.lastMsg){
                    var duration = parseInt((moment().valueOf() - element.timeStamp) / 1000);
                    if (duration > 59) {
                        bot.sendMessage(id, msss, {parse_mode: "HTML"});
                        listLastMsg =listLastMsg.filter(obj => id !== obj.id);
                        listLastMsg.push({id: id,lastMsg: msss,timeStamp: moment().valueOf()});
                    }
                }else {
                    var duration = parseInt((moment().valueOf() - element.timeStamp) / 1000);
                    if (duration > 20) {
                        bot.sendMessage(id, msss, {parse_mode: "HTML"});
                        listLastMsg =listLastMsg.filter(obj => id !== obj.id);
                        listLastMsg.push({id: id,lastMsg: msss,timeStamp: moment().valueOf()});
                    }
                }
                flag=false;
                return;
            }
        });
        if(flag){
            bot.sendMessage(id, msss, {parse_mode: "HTML"});
            listLastMsg.push({id: id,lastMsg: msss,timeStamp: moment().valueOf()});
        }

    }else {
        bot.sendMessage(id, msss, {parse_mode: "HTML"});
        listLastMsg.push({id: id,lastMsg: msss,timeStamp: moment().valueOf()});
    }
    console.log(JSON.stringify(listLastMsg));
}

























































