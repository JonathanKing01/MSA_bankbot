var rest = require("../API/RestClient");

exports.displayLastLogin = function getLastLogin(session, username){
    var url = "https://foodboot.azurewebsites.net/tables/loginAccessRecords";
    rest.getLastLogin(url,session, username, handleLastLoginResponse);
}

exports.reccordNewLogin = function postNewLogin(session, username){
    var url = "https://foodboot.azurewebsites.net/tables/loginAccessRecords";
    rest.postNewLogin(url,session, username);
}

exports.attemptLogin = function lookForUser(session, username, password){
    var url = "https://foodboot.azurewebsites.net/tables/userAccounts";
    rest.lookForUser(url,session, username, password, handleUserLookupResponse);
}

function handleLastLoginResponse(message, session, username){
    var lastLoginResponse = JSON.parse(message);

    var timeRaw = "";

    for (var i in lastLoginResponse){
        if (username == lastLoginResponse[i].username){
            timeRaw = lastLoginResponse[i].createdAt;
        }
    }

    //Extract the time and date from the raw time string, and format for the message.
    // For not time is in UTC, later an API call can be added to give the local time.
    time = timeRaw.substring(0,timeRaw.indexOf("T",0)) + " and time " + timeRaw.substring(timeRaw.indexOf("T",0)+1,timeRaw.indexOf("T",0)+8) + "UTC";

    session.send("%s last logged at date %s",username, time);
}

function handleUserLookupResponse(message,session,username,password){
    var loginLookupResponse = JSON.parse(message);

    var foundUser = false;

    for (var i in loginLookupResponse){
        if (username == loginLookupResponse[i].username){
            if(password == loginLookupResponse[i].password){
                foundUser = true;
            }
        }
    }

    if (foundUser){
        // Post the new login to the records table
        var url = "https://foodboot.azurewebsites.net/tables/loginAccessRecords";
        rest.postNewLogin(url,session, username);

        session.send("%s, you have successfully logged in. How can I help?",username);

    } else {
        session.send("Username or password incorrect, please try again");
        session.send("Account Query");
    }

}