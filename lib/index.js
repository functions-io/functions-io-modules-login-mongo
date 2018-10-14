"use strict";

const crypto = require("crypto");

module.exports = function(message, context){
    return new Promise(async function (resolve, reject){
        context.getDataSource("security").then(function(db){
            let config = context.getConfig();
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
            }, function(errFind){
                reject(errFind);
            });
        },
        function(errDataSource){
            reject(errDataSource);
        });
    });
};