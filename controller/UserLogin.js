
var rest = require("../API/RestClient");
var builder = require('botbuilder');

exports.displayLastLogin = function getLastLogin(session, username){
    var url = "https://foodboot.azurewebsites.net/tables/loginAccessRecords";
    rest.getLastLogin(url,session, username, handleLastLoginResponse);
}

exports.deleteCard = function postNewLogin(session, username,password, number){
    var url = "https://foodboot.azurewebsites.net/tables/userAccounts";
    rest.lookForUser(url,session, username,password,handleDeleteCard,number);
}

exports.attemptLogin = function lookForUser(session, username, password){
    var url = "https://foodboot.azurewebsites.net/tables/userAccounts";
    rest.lookForUser(url,session, username, password, handleUserLookupResponse);
}

exports.lookupPicture = function getUsers(session, username, password, tag){
    var url = "https://foodboot.azurewebsites.net/tables/userAccounts";
    rest.lookForUser(url,session, username, password, changeUsersPassword, tag);
}

exports.makeNewUser = function postNewUser(session, username, password, tag){
    var url = "https://foodboot.azurewebsites.net/tables/userAccounts";
    rest.postNewUser(url,session, username, password, tag);
}

function handleLastLoginResponse(message, session, username){
    var lastLoginResponse = JSON.parse(message);

    var latestLogin = -1;
    for (var i in lastLoginResponse){
        if(username == lastLoginResponse[i].username)
            latestLogin = i;
    }



    if(latestLogin == -1){
        session.send("I'm sorry, we have no records of that user ever having logged in");
    } else {
        var time = lastLoginResponse[latestLogin].createdAt;





        var date = new Date();
        date.setUTCFullYear(time.substring(0,4));
        // Account for the month for some reason being off by 1, dont know why
        date.setUTCMonth((time.substring(5,7)-1)%12 );
        date.setUTCDate(time.substring(8,10));
        date.setUTCHours(time.substring(11,13));
        date.setUTCMinutes(time.substring(14,16));

        var localDate = date.toLocaleDateString();
        var localTime = date.toLocaleTimeString();


        session.send("User %s last logged on at date %s and time %s",username, date.toLocaleDateString(), date.toLocaleTimeString().substring(0,5));
    }
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

        session.send("%s, you have successfully logged in",username);
        session.conversationData["loggedIn"] = true;

    } else {
        session.conversationData["loggedIn"] = undefined;
        session.send("Username or password incorrect, please try again");
        session.send("Account Query");
    }

}

function changeUsersPassword(message, session, username, password, tag){
    var lookupResponse = JSON.parse(message);
    
    var userIndex = -1
    
        for (var i in lookupResponse){
            if (username == lookupResponse[i].username){
                if(password == lookupResponse[i].password){
                    if(tag == lookupResponse[i].securityPicture){
                        userIndex = i;
                    }
                }
            }
        }

    if(userIndex == -1){
        session.send("Sorry, that picture did not match any of our accounts. Would you like to send another?");
    } else {
        var url = "https://foodboot.azurewebsites.net/tables/userAccounts";
        rest.deleteUser(url,session,username,lookupResponse[userIndex].id);
        session.conversationData["tag"] = tag;
        builder.Prompts.text(session, "Please enter in your new password");           
        
    }
}

