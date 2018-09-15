"use strict";

const moduleTest = require("../");

var message1 = {};
message1.username = "admin";
message1.password = "123";
moduleTest(message1).then(function(result){
    console.log("sucess! ", result);
}, function(err){
    console.log("err! ", err);
})

/*
setInterval(function(){
    var message2 = {};
    message2.username = "admin";
    message2.password = "123";
    moduleTest(message2).then(function(result){
        console.log("sucesso! ", result);
    }, function(err){
        console.log("erro! ", err);
    })
}, 10);
*/