var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
app.use(bodyParser.json());

app.use("/", function(req, res){
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/shorturl/new", function(req, res){
  console.log("OK");
});

app.listen(3000, function(){
  console.log("Working");
});
