"use strict";

const assert = require("assert");
const moduleTest = require("../");

var context = {};
context.getConfig = function(){
    return {
        db_url : "mongodb://localhost:27017",
        db_username : "",
        db_password : "",
        db_name: "security",
        db_collection_name: "user",
        db_fieldPassword: "password",
        db_fieldsReturn : ["name","email","roles"],
        security_hash_algorithm : "SHA1", //SHA1, SHA256, SHA512
        security_hash_salt : ""
    };
}

var message1 = {};
message1.username = "admin";
message1.password = "123";
moduleTest(message1, context).then(function(result){
    assert.strictEqual(result.name, "admin");
}, function(err){
    assert.strictEqual(err, null);
})