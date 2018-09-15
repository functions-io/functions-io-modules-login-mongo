"use strict";

const assert = require("assert");
const moduleTest = require("../");

var message1 = {};
message1.username = "admin";
message1.password = "123";
moduleTest(message1).then(function(result){
    assert.strictEqual(result.name, "admin");
}, function(err){
    assert.strictEqual(err, null);
})