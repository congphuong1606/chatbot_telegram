
const TelegramBot = require('node-telegram-bot-api');
const token = '631495709:AAEhSSgInu8uzeeMHnSHTyuCmrECEieSNS0';
const bot = new TelegramBot(token, {polling: true});
const change_alias = require("./char.js");
const baseUrl = "https://script.google.com/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k";
let  timeStamp= moment().valueOf();
var listTime = [300,30, 60,120,150,180, 500,520, 800,700,750,650,550,440,330,220,110, 600,850,900,950,1000,1200,1300,1500,2000,1300,3000];
bot.on('message', (msg) => {
     if(msg.chat.id>0){
         updateSheet(msg.chat.id, msg);
     }else {
         const duration = parseInt((moment().valueOf() - timeStamp) / 1000);
         const timnumber = listTime[Math.floor(Math.random() * listTime.length)];
         if (duration > timnumber) {
             fowardMsg(msg);
              timeStamp= moment().valueOf();
         }

     }


});







function  fowardMsg(msg) {
    let request = change_alias(msg.text.toString());
    request = request.replace(/[0-9]/g, '');
    const listRequest =request.split(" ");
    let mua =false;
    let ban =false;
    let usdt =false;
    let eth =false;
    let bit =false;
    listRequest.forEach(item=>{
        if(item==="mua"){
            mua=true;
        }
        if(item==="ban"){
            ban=true;
        }
        if(item==="usdt"||item==="u"){
            usdt=true;
        }
        if(item==="eth" ||item==="e"){
            eth=true;
        }
        if(item==="bit"||item==="b" ||item==="btc"){
            bit=true;
        }
    });

    if(mua&&!ban){

       /* bot.forwardMessage(msg.chat.id, msg.from.id, msg.message_id);*/
        setTimeout(function(){
        bot.forwardMessage(msg.chat.id, msg.chat.id, msg.message_id);
        setTimeout(function(){
            bot.sendMessage(msg.chat.id, "inbox cho mình");
        }, 2000);
    }, 15000);

    }
    if(!mua&&ban){
 /* bot.forwardMessage(msg.chat.id, msg.from.id, msg.message_id);*/
        setTimeout(function(){
        bot.forwardMessage(msg.chat.id, msg.chat.id, msg.message_id);
        setTimeout(function(){
            bot.sendMessage(msg.chat.id, "Đg cần mua, ib xin giá nhé");
        }, 2000);
        }, 15000);
    }

}


function updateSheet(idChat, msg) {
    const request = require('request');
    console.log(msg);
    const userName = msg.from.username !== undefined ? "@" + change_alias(msg.from.username) : "__";
    const lastName = msg.from.last_name !== undefined ? msg.from.last_name : "__";
    let fullName = msg.from.first_name + " " + lastName;
    fullName = change_alias(fullName);
    fullName = fullName.replace(/[^a-zA-Z0-9]/g, ' ').trim().replace(/ /g, "+");
    const userId = msg.from.id;
    const isbot = msg.from.is_bot === true ? "bot" : "member";
    const txt = msg.text.toString().replace(/[^0-9]/g,'');
    console.log("AAAAAAAAAAAAAAAAAA");
    if(txt.length>=10){
        console.log("BBBBBBBBBBBB-" +txt);
        const url = baseUrl + "/exec?action=insert-sheet-number&user_id=" + userId + "&user_full_name=" + fullName
            + "&user_name=" + userName + "&number=@" + txt;
        console.log(url);
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (body === "fail") {
                    console.log("fail");
                }
                if (body === "success") {
                    console.log("success");
                }

            } else {
                console.log(url);
            }
        });

    }else {
        const url = baseUrl + "/exec?action=insert-number&user_id=" + userId ;
        console.log(url);
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (parseInt(body) < 3) {
                    setTimeout(function(){
                        bot.sendMessage(msg.chat.id, "cho minh sdt");
                    }, 10000);
                }


            } else {
                console.log(url);
            }
        });


    }






}


