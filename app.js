var builder = require("botbuilder");
var restify = require("restify");

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
    session.send("I'm working. You just said: " + session.message.text);
})