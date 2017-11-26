var rest = require("../API/RestClient");

exports.displayLastLogin = function getLastLogin(seesion, username){
    var url = "https://contoso-bank-chatbot.azurewebsites.net/tables/accountAccessRecord";
    rest.getLastLogin(url,session, username, handleLastLoginResponse);
}

function handleLastLoginResponse(message, session, username){
    var lastLoginResponse = JSON.parse(message);

    session.send(lastLoginResponse[0].time);
}