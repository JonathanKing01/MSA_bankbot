
var builder = require('botbuilder');
var welcomeCardBuilder = require('./welcomeCard');
var loginData = require("./UserLogin");
var customVision = require("./customVision");

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
     }]
    
    ).triggerAction({
        matches: 'AccountQueriesIntent'
    });

    bot.dialog('InternationalTradingIntent', function (session, args) {
        
        session.send("What would you like to know about the international market?");
    
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
            if (!session.conversationData["password"]) {
                builder.Prompts.text(session, "Please enter the password for your account:");           
            } 
            next();
        },
        function (session, results, next) {
            if (results.response){
                session.conversationData["password"] = results.response;
            }
            loginData.attemptLogin(session,session.conversationData["username"],session.conversationData["password"]);
        
            next();
        },
        function (session, results, next) {
            
            if (!session.conversationData["loggedIn"]) {
                // Not finished, need to add a login loop
                session.send(session, "Sorry, you cannot reset your password until you log in correctly");           
                
            } else {
                builder.Prompts.text(session,"When you created your account you posted pictures of a certain item. Please post the url a picture of that item.");
                
            }
        },
        function (session, results, next) {
            customVision.retreiveMessage(session, results.response);
        },
        function(session,results, next){
            if (session.conversationData["loggedIn"]){
                if (results.response){
                    session.conversationData["password"] = results.response;
                }
            
                loginData.makeNewUser(session,session.conversationData["username"],session.conversationData["password"],session.conversationData["tag"]);
                session.send("Password successfully reset");
            }
        }
    ]).triggerAction({
      matches: 'ResetPasswordIntent'  
    });

    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            if(!session.conversationData["loggedIn"]){
                //call custom vision
                customVision.retreiveMessage(session);
            } else {
                session.send("Please login first before attempting to reset password");
            }
            return true;
            
        }
        else {
            return false;
        }
    }
}