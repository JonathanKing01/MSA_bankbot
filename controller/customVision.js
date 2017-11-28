var request = require('request'); //node module for http post requests
var userLogin = require("./UserLogin");

exports.retreiveMessage = function (session, message){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/b110d2a4-4718-46f0-90ee-12186e4f1065/url?iterationId=d17c5740-af7b-403b-a322-ccdb0010742d',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'b751bcbfca2447c6b5f320fe5c287524'
        },
        body: { 'Url': message }
    }, function(error, response, body){
        userLogin.lookupPicture(session,session.conversationData["username"] ,session.conversationData["password"], body.Predictions[0].Tag);
    });
}

function validResponse(body, session){
    if (body && body.Predictions && body.Predictions[0].Tag){
        session.send("Tag: %s", body.Predictions[0].Tag);
        userLogin.lookupPicture(session,session.conversationData["username"] ,session.conversationData["password"], body.Predictions[0].Tag);
    } else{
        console.log('Oops. That picture did not work. Please try another.');
    }
}