"use strict";

const crypto = require("crypto");
const MongoClient = require("mongodb").MongoClient;
var client = null;

//openssl list -digest-algorithms

module.dispose = function(){
    if (client){
        client.close();
        client = null;
    }
}

module.exports = function(message, context){
    return new Promise(async function (resolve, reject){
        try {
            let config = context.getConfig();

            if (client === null){
                client = await MongoClient.connect(config.db_url, {useNewUrlParser:true});
            }
            
            let db = client.db(config.db_name);

            db.collection(config.db_collection_name).findOne({name:message.username}).then(function(record){
                try {
                    if (record){
                        let generator = crypto.createHash(config.security_hash_algorithm);
                        generator.update(config.security_hash_salt + message.password);
                        if (generator.digest("hex") === record[config.db_fieldPassword]){
                            let userObj = {};
                    
                            userObj.id = record._id;
                            config.db_fieldsReturn.forEach(function(item){
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