
const TelegramBot = require('node-telegram-bot-api');
const token = '644740117:AAF7IUtFjwyLPRLUFyxSHmcciPOelc27zOk';
const bot = new TelegramBot(token, {polling: true});
var callapi = require('request');
var moment = require('moment');
var change_alias = require("./char.js");
var timeStamp = 0;
var parsed = [];
var baseUrl = "https://script.google.com/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k";



bot.on('message', (msg) => {
    var idChat = msg.chat.id;
    let title = change_alias(msg.chat.title);
    title = title.replace(/[^a-zA-Z0-9]/g, ' ').trim().replace(/ /g, "+");
    const request = require('request');
    const userName= msg.from.username!==undefined? "@"+ change_alias(msg.from.username): "__";
    const lastName = msg.from.last_name!==undefined? msg.from.last_name :"__";
    let fullName= msg.from.first_name + " " + lastName;
    fullName= change_alias(fullName);
    fullName= fullName.replace(/[^a-zA-Z0-9]/g, ' ').replace(/ /g, "+");
    const userId =msg.from.id;
    const isbot =msg.from.is_bot ===true? "bot" :"member";
    const url23 = baseUrl + "/exec?action=insert-sheet_bot2&sheet_name="+idChat+"&user_id="+userId+"&user_full_name="+fullName+"&user_name=" +userName +"&is_bot=" +isbot+ "&title=" + title;
    console.log(url23);
    request(url23, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body === "fail") {
                console.log("fail");
            }
            if (body === "success") {
                console.log("success");
            }

        } else {
            console.log(url23);
            bot.sendMessage(userBoss1, "Kiểm tra lỗi : "+url2);
        }
    });
});