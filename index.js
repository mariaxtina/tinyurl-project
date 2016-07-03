require('dotenv').config();
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
var generateRandomShortURL = require('./generateRandomShortURL.js');
var connect        = require('connect');
var methodOverride = require('method-override');
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "process.env.MONGODB_URI";


let dbInstance;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    throw err;
  }
  console.log(`Successfully connected to DB: ${MONGODB_URI}`);
  dbInstance = db;

});


app.use(bodyParser.urlencoded());

app.use(methodOverride('_method'));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  dbInstance.collection("urls").find().toArray((err, results) => {
    let urlCollection = {urls: results};
    res.render("urls_index", urlCollection);
  });
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  dbInstance.collection("urls").findOne({shortURL: shortURL}, (err, result) => {
    console.log(result);
    let templateVars = result;
    res.render("urls_show", templateVars);
  });
});

app.delete("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  dbInstance.collection("urls").deleteOne({shortURL: shortURL}, (err, result) => {
    res.redirect("/urls");
  });
});

app.put("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.longURL;
  dbInstance.collection("urls").findOneAndUpdate(
    {shortURL: shortURL}, {$set: {longURL: rlongURL}}, (err,result) => {
    res.redirect("/urls");
  });
});

//need to update function
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  dbInstance.collection("urls").insertOne({shortURL: generateRandomShortURL(6), longURL: longURL },
  (err, result) => {
    res.send("Refresh to see your new tinyUrl.");
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});