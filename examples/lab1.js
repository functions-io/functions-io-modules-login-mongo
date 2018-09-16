"use strict";

const moduleTest = require("../lib");

var message1 = {};
message1.username = "admin";
message1.password = "123";
moduleTest(message1).then(function(result){
    console.log("sucess! ", result);
}, function(err){
    console.log("err! ", err);
})