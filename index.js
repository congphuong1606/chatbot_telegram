var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 3000
app.use(express.static(__dirname + "/"))
var server = http.createServer(app)
server.listen(port)
var wss = new WebSocketServer({server: server})
console.log("websocket server created")
wss.on("connection", function (ws) {
    var id = setInterval(function () {
        ws.send(JSON.stringify(new Date()), function () {
        })
    }, 1000)

    ws.on("close", function () {
        clearInterval(id)
    })
});

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

var lastMsgGroup = {id: null, lastMsg: null, timeStamp: null};
var listLastMsg = [];
var stopOtherGroup= false;

bot.on('message', (msg) => {
    var request = change_alias(msg.text.toString());
    var idChat = msg.chat.id;
    if (request === "reload data sheet") {
        reloadData();
    } else if(request==="/stopothergroup" ){
        if(msg.from.id=== 398800833 || msg.from.id=== 612137896 ){
            stopOtherGroup =true;
            bot.sendMessage(398800833, "stoped other group");
            bot.sendMessage(612137896, "stoped other group");
        }

    } else if(request==="/openothergroup" ){
        if(msg.from.id=== 398800833 || msg.from.id=== 612137896 ){
            stopOtherGroup =false;
            bot.sendMessage(398800833, "opened other group");
            bot.sendMessage(612137896, "opened other group");
        }

    }
    else {
        console.log("msg: " +JSON.stringify(msg));
        switch (msg.chat.type) {
            case "private":
                if (idChat !== 398800833 && idChat !== 612137896) {
                    bot.forwardMessage(398800833, msg.chat.id, msg.message_id);
                    bot.forwardMessage(612137896, msg.chat.id, msg.message_id);
                }
                handling(msg, request);
                break;
            case "group":

                updateGroupSheet(idChat, msg.chat.title);
                if(stopOtherGroup){
                    if(idChat===-274967567){
                        handling(msg, request);
                    }
                }else {
                    handling(msg, request);
                }
                break;
            case "supergroup":
                updateGroupSheet(idChat, msg.chat.title);
                if(stopOtherGroup){
                    if(idChat===-274967567){
                        handling(msg, request);
                    }
                }else {
                    handling(msg, request);
                }
                break;
            default:
                break;
        }

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
        var reply = {number: 0, value: []};
        parsed.forEach(item => {
            var keyword = change_alias(item.keyword);
            var newNumber = checkStringAsAnswer(request, change_alias(keyword));
            if (newNumber >= reply.number && newNumber !== 0) {
                var items = [];
                items.push(item.answer);
                if (item.answer2 != '') {
                    items.push(item.answer2)
                }
                ;
                if (item.answer3 != '') {
                    items.push(item.answer3)
                }
                ;
                if (item.answer4 != '') {
                    items.push(item.answer4)
                }
                ;
                if (item.answer5 != '') {
                    items.push(item.answer5)
                }
                ;
                reply = {number: newNumber, value: items};
            }
        });
        if (reply.number > 0) {
            if (reply.value.length === 1) {
                sendMsg(msg.chat.id, reply.value[0]);
            }
            if (reply.value.length > 1) {
                getRandom(reply.value, msg);
            }
            console.log(JSON.stringify(reply));
        }

    }
}


function checkStringAsAnswer(request, keyword) {
    var arrayRequest = request.split(" ");
    var arrayKeyword = keyword.split(" ");
    var number = 0;
    arrayRequest.forEach(itemRequest => {
        arrayKeyword.forEach(itemKeyword => {
            if (itemRequest === itemKeyword) {
                number++;
            }
        });
    });
    if (number === 1) {
        console.log("number = 1 ");
        if(request.charAt(0)!=='/'){
            console.log("setNumber =0 ");
            if (arrayRequest.length > 1 || arrayKeyword.length > 1) {
                number = 0;
            }
        }
    }

    return number;


}

var tam = "";

function getRandom(items, msg) {
    var messs = items[Math.floor(Math.random() * items.length)];
    if (tam != messs) {
        sendMsg(msg.chat.id, messs);
        tam = messs;
    } else {
        getRandom(items, msg);
    }
}

var listTime = [20, 25, 30, 15];


function sendMsg(id, msss) {
    if (listLastMsg.length > 0) {
        var flag = true;
        listLastMsg.forEach(element => {
            if (id == element.id) {
                if (msss == element.lastMsg) {
                    var duration = parseInt((moment().valueOf() - element.timeStamp) / 1000);
                    if (duration > 50) {
                        bot.sendMessage(id, msss, {parse_mode: "HTML"});
                        listLastMsg = listLastMsg.filter(obj => id !== obj.id);
                        listLastMsg.push({id: id, lastMsg: msss, timeStamp: moment().valueOf()});
                    }
                } else {
                    var duration = parseInt((moment().valueOf() - element.timeStamp) / 1000);
                    if (duration > 20) {
                        bot.sendMessage(id, msss, {parse_mode: "HTML"});
                        listLastMsg = listLastMsg.filter(obj => id !== obj.id);
                        listLastMsg.push({id: id, lastMsg: msss, timeStamp: moment().valueOf()});
                    }
                }
                flag = false;
                return;
            }
        });
        if (flag) {
            bot.sendMessage(id, msss, {parse_mode: "HTML"});
            listLastMsg.push({id: id, lastMsg: msss, timeStamp: moment().valueOf()});
        }

    } else {
        bot.sendMessage(id, msss, {parse_mode: "HTML"});
        listLastMsg.push({id: id, lastMsg: msss, timeStamp: moment().valueOf()});
    }
}

























































