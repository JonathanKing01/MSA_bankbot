var builder = require("botbuilder");
var restify = require("restify");
var request = require("request");
var parseString = require("xml2js").parseString;
var urlencode = require('urlencode');
var luis = require("./controller/luisDialog");

var tokenHandler = require("./tokenHandler");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log("%s listening to %s", server.name, server.url);
})

var connector = new builder.ChatConnector({
    appId:"5f967fdf-688f-42ba-8e1c-84d50f179b04",
    appPassword:"qdmcoQKY617$_fpWFZC68#_"
});

server.post("/api/messages", connector.listen());

var bot = new builder.UniversalBot(connector, function(session){
    session.send("Sorry, I did not understand that.");
})

server.post('/api/messages', connector.listen());

//=========================================================
// Bot Translation Middleware (taken from https://github.com/alyssaong1/BotTranslator)
//=========================================================

// Start generating tokens needed to use the translator API
tokenHandler.init();

// Can hardcode if you know that the language coming in will be chinese/english for sure
// Otherwise can use the code for locale detection provided here: https://docs.botframework.com/en-us/node/builder/chat/localization/#navtitle
var FROMLOCALE = 'fr'; // French locale
var TOLOCALE = 'en';

// Documentation for text translation API here: http://docs.microsofttranslator.com/text-translate.html
bot.use({
    receive: function (event, next) {
        var token = tokenHandler.token();
        if (token && token !== ""){ //not null or empty string
            var urlencodedtext = urlencode(event.text); // convert foreign characters to utf8
            var options = {
                method: 'GET',
                url: 'http://api.microsofttranslator.com/v2/Http.svc/Translate'+'?text=' + urlencodedtext + '&from=' + FROMLOCALE +'&to=' + TOLOCALE,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            request(options, function (error, response, body){
                //Check for error
                if(error){
                    return console.log('Error:', error);
                } else if(response.statusCode !== 200){
                    return console.log('Invalid Status Code Returned:', response.statusCode);
                } else {
                    // Returns in xml format, no json option :(
                    parseString(body, function (err, result) {
                        console.log(result.string._);
                        event.text = result.string._;
                        next();
                    });
                    
                }
            });
        } else {
            console.log("No token");
            next();
        }
    }
});


luis.startDialog(bot);