// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public')); // http://expressjs.com/en/starter/static-files.html
var connected=false;
//app.listen(3000);
//console.log('Listening on port 3000');


var connected=false;

//Database:

var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
console.log("Url: ", MONGODB_URI);

// setup nunjucks for templating in views/index.html
var nunjucks = require('nunjucks');
nunjucks.configure('views', { autoescape: true, express: app });


// setup our datastore
//var datastore = require("./datastore").sync;
//datastore.initializeApp(app);

var db;
var tablePandas = [];

var firebase = require('firebase');

MongoClient.connect(MONGODB_URI, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
 
  db = client.db(process.env.DB);
  //console.log("db: ", db);
  
  findDocuments(db, function(){;client.close();});
});

const findDocuments = function(db, callback) {
  // Get the documents collection
  //console.log("db: ", db);
  const collection = db.collection('pandas');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log("Found the following records");
    //console.log(docs);
    tablePandas = docs;
    callback(docs);
  });
}
/*
var  = firebase.initializeApp({
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-sender-id>'
  });*/

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  
  /*findDocuments(db, function(callbacks){
    
    response.render('index.html', {
      title: "Welcome!",
    //posts: callbacks,
    });*/
    
    response.render(__dirname + '/views/index.html', {
      title: "Welcome!",
      posts: tablePandas
    });
  
    console.log("tablePandas", tablePandas);
    
    response.sendFile(__dirname + '/views/index.html');
    
  //});
  

  
  //response.send('Hello world');
});
/*
app.get("/search", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.render('index.html', {
      title: "Welcome!",
      posts: "Test"
    });
  response.send(tablePandas);
});*/

app.get("/search/:pandaId", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.send('Panda: '  + tablePandas[request.params.pandaId]);
});

app.get("/delete/:pandaId", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  tablePandas.pop(request.params.pandaId)
  response.send('Panda deleted');
});

app.get("/add/:pandaName", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  tablePandas.push(request.params.pandaName)
  response.send('Panda added');
});

/*
app.delete("/delete", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.send('Delete this');
});*/

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


