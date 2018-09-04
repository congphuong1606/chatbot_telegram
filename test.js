var http=require('request');
http.get('https://script.google.com/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k/exec?action=read-all-data&alt=json', function(res){

        console.log("data: "+ res);


});