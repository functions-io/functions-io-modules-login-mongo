const MongoClient = require("mongodb").MongoClient;
var client = null;

var db_url = "mongodb://localhost:27017";

async function test(){
    client = await MongoClient.connect(db_url, {useNewUrlParser:true});
    let db = client.db("security");
    let db2 = db.admin();
    db2.removeUser("user1");
};

test();