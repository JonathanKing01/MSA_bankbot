

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

exports.lookForUser = function getData(url, session, username, password, callback,tag){
   

        request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetReponse(err,res,body){
    
            if(err){
                console.log(err);
            }else {
                if (tag == undefined){
                    callback(body, session, username, password);
                } else {
                    callback(body,session,username,password,tag);
                }
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

exports.postNewUser = function postData(url, session, username, password, tag){
    
    var options = {
        url: url, method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "password" : password,
            "securityPicture" : tag,
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

exports.deleteUser = function deleteData(url, session, username, id){
    
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
        }else {
            console.log(err);
            console.log(res);
        }
})

};


