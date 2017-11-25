
var builder = require('botbuilder');
var luis = require("./luisDialouge");

exports.displayWelcomeCard = function displayWelcomeCard(session){
    var attachment = [];

    var cardButtons = [];
    //cardButtons.add(builder.CardAction.imBack(session,"BreakRequest",Break));

    var card = new builder.HeroCard(session)
        .title("Welcome to the Contoso help bot platform.")
        .text("Please select form the list how I can help you, or type a message in the chat box.")
        .buttons([
            builder.CardAction.imBack(session,"Account Security","Account Security"),
            builder.CardAction.imBack(session,"Account Queries","Account Queries"),
            builder.CardAction.imBack(session,"International Trading","International Trading")
        ]);
    attachment.push(card);

    var message = new builder.Message(session).attachments(attachment);

    session.send(message);
}