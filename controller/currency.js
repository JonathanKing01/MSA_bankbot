var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getYelpData' in RestClient.js with 'displayRestaurantCards' as callback to get list of restaurant information
exports.displayExchangeInfo = function getExchangeData(session,amount,from, to){

    from = from.toUpperCase();
    to = to.toUpperCase();

    var url ='https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency='+from+'&to_currency='+to+'&apikey=ES4R4Q939LRUZDSE';
    rest.getExchangeRate(url,session,displayExchangeRate, amount, from, to);
}

function displayExchangeRate(message, session, amount, from, to){
    var response = JSON.parse(message);

    var rate = response["Realtime Currency Exchange Rate"];

    var result = rate["5. Exchange Rate"] * amount;

    session.send("Excange rate: %s %s : %s %s", amount, from, result.toPrecision(4), to);
}

