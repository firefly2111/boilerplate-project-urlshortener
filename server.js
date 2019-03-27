'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var Schema = mongoose.Schema;
var urlSchema = new Schema({
  "url": String,
  shortUrl: Number
});
var urlDatabase = mongoose.model("urlDatabase", urlSchema);

app.use('/public', express.static(process.cwd() + '/public'));



app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  var shortUrlNumber  = Math.floor(Math.random() * 1000);
  
  var myURL = new urlDatabase(req.body, shortUrlNumber);
  
  
  myURL.save().then((data) => {
    res.json({url: myURL, shortURL: shortUrlNumber});
  }).catch((err) => {
    res.status(400).json({message: "Cant write data"});
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
