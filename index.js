//mathan
// Set express as Node.js web application 
// server framework. 
// To install express before using it as 
// an application server by using  
// "npm install express" command. 
var express = require('express'); 
var app = express(); 
const bodyParser = require('body-parser');
var mongodb = require("mongodb");


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

// Database Name
const dbName = 'blogdb';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});

  
// Set EJS as templating engine 
app.set('view engine', 'ejs'); 

var server = app.listen(4000, function(){ 
    console.log('listining to port 4000') 
}); 


app.use(express.static(__dirname + '/images'));
app.get('/', (req, res)=>{ 
 
res.render('home'); 
  
}); 

app.get('/posts', (req, res)=>{

	//const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
	//const client = new MongoClient(uri);

 MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);

  const db = client.db(dbName);
    
     const collection = db.collection('posts');
  // Find some documents
  collection.find({}).sort({dateadded: -1}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log(docs)
    client.close();
   res.render('posts', {result: docs});
  });

});

  
}); 

app.get('/posts/new', (req, res)=>{  
res.render('newposts', {result: []}); 
  
}); 


app.post('/posts/save', (req, res)=>{  
	var todayDate = new Date();
	 MongoClient.connect(url, function(err, client) {

  const db = client.db(dbName);
     const collection = db.collection('posts');

     console.log(req.body)

     if(req.body.id== undefined)
     {
     	  collection.insertOne(
			    {title : req.body.title, author : req.body.author, post : req.body.content, status: 0, dateadded : todayDate}
			  , function(err, result) {
			   
			   res.redirect('/posts')
			  });

     }else
     {
     	 collection.updateMany({_id:new mongodb.ObjectID(req.body.id)}
		    , { $set: {title : req.body.title, author : req.body.author, post : req.body.content, status: 0} }, function(err, result) {
		    assert.equal(err, null);
		    assert.equal(1, result.result.n);
		    console.log("Updated the document with the field a equal to 2");
		    res.redirect('/posts')
		   
		  });
     }

});

//res.redirect('/posts')
  
}); 

app.get('/posts/delete/:id', (req, res)=>{  
	
	MongoClient.connect(url, function(err, client) {

	  const db = client.db(dbName);
	     const collection = db.collection('posts');
	  // Find some documents
	    collection.deleteOne({ _id : new mongodb.ObjectID(req.params.id) }, function(err, result) {
	    res.redirect('/posts')
	  });
	  
	}); 
}); 
app.get('/posts/edit/:id', (req, res)=>{  
	
	MongoClient.connect(url, function(err, client) {

	  const db = client.db(dbName);
	     const collection = db.collection('posts');
	  // Find some documents
	      collection.find({_id:new mongodb.ObjectID(req.params.id)}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log(docs)
    client.close();
   res.render('newposts', {result: docs});
  });
	  
	}); 
}); 

