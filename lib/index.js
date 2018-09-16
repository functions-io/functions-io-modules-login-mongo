"use strict";

const crypto = require("crypto");
const MongoClient = require("mongodb").MongoClient;
var client = null;

//openssl list -digest-algorithms

module.config = {
    db_url : "mongodb://localhost:27017",
    db_username : "",
    db_password : "",
    db_fieldPassword: "password",
    db_fieldsReturn : ["name","email","roles"],
    security_hash_algorithm : "SHA1", //SHA1, SHA256, SHA512
    security_hash_salt : ""
};

module.input = {
    type: "object",
    properties: {
        username: {type: "string", maximum: 30},
        password: {type: "string", maximum: 30}
    }
};

module.output = {
    type: "object",
    properties: {
        id: {type: "string"},
        name: {type: "string"},
        email: {type: "string"},
        roles: {
            type: "array",
            items: {type: "string"}
        }
    }
};

module.dispose = function(){
    if (client){
        client.close();
        client = null;
    }
}

module.exports = function(message){
    return new Promise(async function (resolve, reject){
        try {
            if (client === null){
                client = await MongoClient.connect(module.config.db_url, {useNewUrlParser:true});
            }
            
            let db = client.db("security");

            db.collection("user").findOne({name:message.username}).then(function(record){
                try {
                    if (record){
                        let generator = crypto.createHash(module.config.security_hash_algorithm);
                        generator.update(module.config.security_hash_salt + message.password);
                        if (generator.digest("hex") === record[module.config.db_fieldPassword]){
                            let userObj = {};
                    
                            userObj.id = record._id;
                            module.config.db_fieldsReturn.forEach(function(item){
                                if (record[item]){
                                    userObj[item] = record[item];
                                }
                            });
                            
                            resolve(userObj);
                        }
                        else{
                            resolve(null);
                        }
                    }
                    else{
                        resolve(null);
                    }                    
                }
                catch (errTry2) {
                    reject(errTry2);
                }
            });
        }
        catch (errTry) {
            if (errTry.name === "MongoNetworkError"){
                module.dispose();
            }
            reject(errTry);
        }
    });
};