
var builder = require('botbuilder');
var luis = require("./luisDialog");

exports.displayWelcomeCard = function displayWelcomeCard(session, logo){
    var attachment = [];

    var cardButtons = [];

    var card = new builder.HeroCard(session)
        .title("Welcome to the Contoso help bot")
        .text("Please select from the list how I can help you, or type a message in the chat box.")
        .images([logo])
        .buttons([
            builder.CardAction.imBack(session,"Account Queries","Account Queries"),
            builder.CardAction.imBack(session,"International Trading","International Trading")
        ]);
    attachment.push(card);

    var message = new builder.Message(session).attachments(attachment);

    session.send(message);
}