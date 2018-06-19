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



function addDocument(db, key, value){
  const collection = db.collection('WikiPanda');
  var push = {};
  for(i=0; i<key.length;i++){
    push[key[i]] = value[i];
  }
  collection.insertOne(push);
}
















function updateDocuments(db, key, value, callback) {
  const collection = db.collection('WikiPanda');
  var search = {};
  for(i=0; i<key.length;i++){
    search[key[i]] = value[i];
  }
  var newvalues = { $set: { img: "newImg.png" } };
  collection.updateOne(search, newvalues,function(err, docs) {
    callback();
  });
}
 
 
 
 


//afficher ceux respectant search?name=...&height=...&...
app.get('/update',function(req,res){
  i = 0;
  key = [];
  value = []
  if(req.query.name){
    key[i] = "name";
    value[i] = req.query.name;
    i++;
  }
  if(req.query.weight){
    key[i] = "weight";
    value[i] = req.query.weight;
    i++;
  }
  if(req.query.height){
    key[i] = "height";
    value[i] = req.query.height;
    i++;
  }
  if(req.query.img){
    key[i] = "img";
    value[i] = req.query.img;
    i++;
  }
  if(req.query.species){
    key[i] = "species";
    value[i] = req.query.species;
    i++;
  }
  updateDocuments(db, key, value, function() { res.send(collec); })
})



















function findDocuments(db, key, value, callback) {
  const collection = db.collection('WikiPanda');
  var search = {};
  for(i=0; i<key.length;i++){
    search[key[i]] = value[i];
  }
  collection.find(search).toArray(function(err, docs) {
    assert.equal(err, null);
    docs.forEach((it) => {delete it._id});
    docs.forEach((it) => {delete it.id});
    collec = docs;
    callback();
  });
}
 
 
 
 


//afficher ceux respectant search?name=...&height=...&...
app.get('/search',function(req,res){
  i = 0;
  key = [];
  value = []
  if(req.query.name){
    key[i] = "name";
    value[i] = req.query.name;
    i++;
  }
  if(req.query.weight){
    key[i] = "weight";
    value[i] = req.query.weight;
    i++;
  }
  if(req.query.height){
    key[i] = "height";
    value[i] = req.query.height;
    i++;
  }
  if(req.query.img){
    key[i] = "img";
    value[i] = req.query.img;
    i++;
  }
  if(req.query.species){
    key[i] = "species";
    value[i] = req.query.species;
    i++;
  }
  findDocuments(db, key, value, function() { res.send(collec); })
})

 


app.get('/add',function(req,res){
  i = 0;
  key = [];
  value = []
  if(req.query.name){
    key[i] = "name";
    value[i] = req.query.name;
    i++;
  }
  if(req.query.weight){
    key[i] = "weight";
    value[i] = req.query.weight;
    i++;
  }
  if(req.query.height){
    key[i] = "height";
    value[i] = req.query.height;
    i++;
  }
  if(req.query.img){
    key[i] = "img";
    value[i] = req.query.img;
    i++;
  }
  if(req.query.species){
    key[i] = "species";
    value[i] = req.query.species;
    i++;
  }
  addDocument(db, key, value)
  
  findDocuments(db, [], [], function() { res.send(collec); })
  
})



app.get('/:numero',function(req,res){
  findDocuments(db, [], [], function() { res.send(collec[req.params.numero]); })
})
 
 
 
 
 
//Quand connexion basique, afficher tous les pandas
app.get('/',function(req,res){
  key = [];
  value = [];
  findDocuments(db, key, value, function() { res.send(collec); });
})






app.listen('8080',function(){
  console.log('App listening to port 8080');
})