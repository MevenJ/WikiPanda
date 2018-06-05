const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var express = require('express');
var app     = express();
var http = require('http').Server(app);

var db;



const url = 'mongodb://localhost:27017';
const dbName = 'Wiki';
var collec = [];



MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoServer");
  db = client.db(dbName);
});



function findDocuments(db,name,value,callback) {
  // Get the documents collection
  const collection = db.collection('WikiPanda');
  var search = {};
  search[name] = value;
  // Find some documents
  collection.find(search).toArray(function(err, docs) {
    assert.equal(err, null);
    docs.forEach((it) => {delete it._id});
    docs.forEach((it) => {delete it.id});
    //console.log(docs);
    collec = docs;
    callback();
  });
}
 
app.get('/search',function(req,res){
  console.log(req.query.name + " " + req.query.value);
  findDocuments(db, req.query.name, req.query.value, function() { res.send(collec); });
  
})

app.get('/search/:name/:value',function(req,res){
  console.log(req.params.name + " " + req.params.value);
  findDocuments(db, req.params.name, req.params.value, function() { res.send(collec); });
  
})

 
 
 
app.get('/',function(req,res){
  findDocuments(db, "", "", function() { res.send(collec); });
})


app.listen('8080',function(){
  console.log('App listening to port 8080');
})