"use strict";

const moduleTest = require("../lib");
const driver = require("@functions-io-modules/datasource.driver.mongo");

var context = {};
context.getConfig = function(){
    return {
        db_collection_name: "user",
        db_fieldPassword: "password",
        db_fieldsReturn : ["name","email","roles"],
        security_hash_algorithm : "SHA1", //SHA1, SHA256, SHA512
        security_hash_salt : ""
    };
}

context.getDataSource = function(){
    let config = {};
    config.url = "mongodb://localhost:27017";
    config.database = "security";
    return driver.getDataSource(config);
}

var message1 = {};
message1.username = "admin";
message1.password = "123";
moduleTest(message1, context).then(function(result){
    console.log("sucess! ", result);
    driver.close();
}, function(err){
    console.log("err! ", err);
    driver.close();
})