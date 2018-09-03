var http=require('request');


http("https://script.google.com:443/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k/exec?action=read-all-data&amp;alt=json", function (error, response, body) {
        console.log('Response is '+response);
		console.log('err is '+error);
		console.log('data is '+body);

    });
       
