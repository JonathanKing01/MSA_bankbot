var builder = require('botbuilder');
var welcomeCardBuilder = require('./welcomeCard');

exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5e8ad9f9-1389-4371-a546-7ef5862e1627?subscription-key=0a7a2d006b77485a81f3c00a2e4aae23&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    

    bot.dialog('WelcomeIntent', function (session, args) {
        
        welcomeCardBuilder.displayWelcomeCard(session);
    
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

    bot.dialog('AccountQueriesIntent', function (session, args) {
        
        session.send("What would you like to know about your account?");
    
    }).triggerAction({
        matches: 'AccountQueriesIntent'
    });

    bot.dialog('InternationalTradingIntent', function (session, args) {
        
        session.send("What would you like to know about the international market?");
    
    }).triggerAction({
        matches: 'InternationalTradingIntent'
    });
}