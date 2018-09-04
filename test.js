const TelegramBot = require('node-telegram-bot-api');
const token = '694156014:AAGSi9FtWPbHODSAowRylOPtHmLUPDSN2i4';
const bot = new TelegramBot(token, {polling: true});





bot.on('supergroup_chat_created', (msg) => {

    console.log(JSON.stringify(msg))

});