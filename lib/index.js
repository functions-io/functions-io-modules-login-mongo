"use strict";

const crypto = require("crypto");
const MongoClient = require("mongodb").MongoClient;
var client = null;

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

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function cleanup(){
    if (client){
        client.close();
        client = null;
    }
}

module.exports = function(message){
    return new Promise(async function (resolve, reject){
        try {
            if (client === null){
                let  url = "mongodb://localhost:27017";
                client = await MongoClient.connect(url, {useNewUrlParser:true});
            }
            
            let db = client.db("security");
            db.collection("user").findOne({name:message.username}).then(function(record){
                if (record){
                    let generator = crypto.createHash("sha1");
                    generator.update(message.password);
                    if (generator.digest("hex") === record.password){
                        let userObj = {};
                
                        userObj.id = record._id;
                        userObj.name = record.name;
                        userObj.email = record.email;
                        userObj.roles = [];
                        
                        resolve(userObj);
                    }
                    else{
                        resolve(null);
                    }
                }
                else{
                    resolve(null);
                }
            });
        }
        catch (errTry) {
            cleanup();
            reject(errTry);
        }
    });
};