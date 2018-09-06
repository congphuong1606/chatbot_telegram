
var requestify = require('requestify');
requestify.setEncoding('utf8');
requestify.get('https://script.google.com/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k/exec?action=insert-data',{ keyword: 'keyword',answer: 'answer' } )
    .then(function(response) {
        console.log("body:   " +response.getBody());
        console.log("getError:   " +response.getError());
    });
