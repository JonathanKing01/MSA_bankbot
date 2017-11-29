

var builder = require('botbuilder');
var welcomeCardBuilder = require('./welcomeCard');
var loginData = require("./UserLogin");
var customVision = require("./customVision");
var currency = require("./currency");

exports.startDialog = function (bot) {
    
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5e8ad9f9-1389-4371-a546-7ef5862e1627?subscription-key=0a7a2d006b77485a81f3c00a2e4aae23&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('WelcomeIntent', function (session, args) {
        var logoURL = "http://cdn.marketplaceimages.windowsphone.com/v8/images/6e04c950-e28a-46fc-bc83-fe244d8a9de9?imageType=ws_icon_large";
        var logo = builder.CardImage.create(session,logoURL);
        welcomeCardBuilder.displayWelcomeCard(session, logo);
    
    }).triggerAction({
        matches: 'WelcomeIntent'
    });

    bot.dialog('BreakRequest', function (session, args) {
        
        session.send("Sorry, I'll stop now.");
    
    }).triggerAction({
        matches: 'BreakRequest'
    });

    bot.dialog('AccountSecurityIntent', function (session, args) {
        
        session.send("What seems to be the problem with your account?");
    
    }).triggerAction({
        matches: 'AccountSecurityIntent'
    });

    bot.dialog('AccountQueriesIntent', [
    function (session, args, next) {
            builder.Prompts.text(session, "Please enter the username to your account:");  
    },
    function (session, results, args, next) {

        if (results.response){
            session.conversationData["username"] = results.response;
        }
            builder.Prompts.text(session, "Enter the password for your account:");     
    },
    function (session, results,next) {
        if (results.response){
            session.conversationData["password"] = results.response;
        }

        loginData.attemptLogin(session,session.conversationData["username"],session.conversationData["password"]);
     }
    
    ]).triggerAction({
        matches: 'AccountQueriesIntent'
    });

    bot.dialog('InternationalTradingIntent', function (session, args) {
        
        session.send("What would you like to know about the international market? (Exchange example: 50 USD to NZD)");
    
    }).triggerAction({
        matches: 'InternationalTradingIntent'
    });

    bot.dialog('requestLoginTimeIntent', [
        function (session, args, next) {
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter the username to the account:");           
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            
            if (results.response){
                session.conversationData["username"] = results.response;
            }
            
            loginData.displayLastLogin(session,session.conversationData["username"]);
        }]
    
    ).triggerAction({
        matches: 'requestLoginTimeIntent'
    });
        
    bot.dialog('currencyExchangeIntent', 
        function (session, args, next) {
            
        var amount = builder.EntityRecognizer.findEntity(args.intent.entities, 'amount').entity;
        var from = builder.EntityRecognizer.findEntity(args.intent.entities, 'from').entity;
        var to = builder.EntityRecognizer.findEntity(args.intent.entities, 'to').entity;

        if(amount == undefined){
            amount = 1;
        }

        currency.displayExchangeInfo(session,amount,from,to);
    }
    ).triggerAction({
        matches: "currencyExchangeIntent"
    });

    bot.dialog("ResetPasswordIntent",[
        function (session, args, next) {
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter the username to your account:");           
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            
            if (results.response){
                session.conversationData["username"] = results.response;
            }
            builder.Prompts.text(session,"When you created your account you posted pictures of a certain item. Please post the url of a picture of that item.");
        },
        function (session, results, next) {
            if(results.response == "Admin coffee overide"){
                loginData.lookupPicture(session, session.conversationData["username"], "coffee");;
            } else{
                customVision.retreiveMessage(session, results.response);
            }
        },
        function(session,results, next){
            if (results.response){
                session.conversationData["password"] = results.response;
            }
            
            loginData.makeNewUser(session,session.conversationData["username"],session.conversationData["password"],session.conversationData["tag"]);
            session.send("Password successfully reset");
            
        }
    ]).triggerAction({
      matches: 'ResetPasswordIntent'  
    });

}

