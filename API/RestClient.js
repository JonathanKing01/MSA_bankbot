 var request = require('request');

exports.getLastLogin = function getData(url, session, username, callback){

    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetReponse(err,res,body){

        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
        
    });
};

exports.lookForUser = function getData(url, session, username, password, callback){
    
        request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetReponse(err,res,body){
    
            if(err){
                console.log(err);
            }else {
                callback(body, session, username, password);
            }
            
        });
    };

exports.postNewLogin = function postData(url, session, username){
    
    var options = {
        url: url, method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
        }
    }  

    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
    });

};