const express = require("express");
const bodyParser = require("body-parser");
const generateRandomShortURL = require('./generateRandomShortURL.js');
const connect = require('connect');
const methodOverride = require('method-override');
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

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
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  dbInstance.collection("urls").find().toArray((err, urls) => {
    res.render("urls_index", {urls: urls});
  });
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  dbInstance.collection("urls").findOne({shortURL: shortURL}, (err, url) => {
    res.render("urls_show", url);
  });
});

app.delete("/urls/:id", (req, res) => {
  dbInstance.collection("urls").deleteOne({shortURL: req.params.id}, (err, result) => {
    res.redirect("/urls");
  });
});

app.put("/urls/:id", (req, res) => {
  dbInstance.collection("urls").findOneAndUpdate(
    {shortURL: req.params.id},
    {$set: {longURL: req.body.longURL}},
    (err,result) => {
      res.redirect("/urls");
   });
});

app.post("/urls", (req, res) => {
  dbInstance
    .collection("urls")
    .insertOne({shortURL: generateRandomShortURL(6), longURL: req.body.longURL },
      (err, result) => {
        res.redirect("/urls");
      });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});