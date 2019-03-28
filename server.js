'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");

var cors = require('cors');
var dns = require("dns");
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
  var regex = /https:\/\/www.|http:\/\/www./g;
dns.lookup(req.body.url.replace(regex, ""), (err, adress, family) => {
  if(err){
    res.json({err: err});
  }else{
    urlDatabase.find().then(data => {
      var databaseData = new urlDatabase({url: req.body.url, shortUrl: data.length});
      data = data.filter((i) => i["url"] === req.body.url);
      if(data.length === 0){
        databaseData.save().then(result => {
          res.json({"originalURL":result.url, "shortURL": result.shortUrl});
        }).catch(err => {
          res.json({error: err});
        });
      }else{
        var search = req.body.url;
        urlDatabase.find({url: search}).then(result => {
          res.json({url: result[0].url, shortUrl: result[0].shortUrl});
        }).catch(err => {
          res.json({error: err});
        });
      }
    }).catch(err => {
      res.json({error: err});
    });
  }
});
  
});

app.get("/api/shorturl", function(req, res){
  urlDatabase.find().then(result => {
    res.json(result);
  }).catch(err => {
    res.json({error: err});
  });
});


app.get("/api/shorturl/:shortUrl", function(req, res){
  var shortUrl = req.params.shortUrl;
  urlDatabase.find({shortUrl: shortUrl}).then(result => {
    res.redirect(result[0]["url"]);
  }).catch(err => {
    res.json({error: err});
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
})
