const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const generateRandomShortURL = require('./generate_random_shorturl.js');
const connect = require('connect');
const methodOverride = require('method-override');
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();
const PORT = process.env.PORT || 8080; // default port 8080
const MONGODB_URI = process.env.MONGODB_URI;


let dbInstance;
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    throw err;
  }
  console.log(`Successfully connected to DB: ${MONGODB_URI}`);
  dbInstance = db;
});

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", req.cookies["username"]);
});

app.get("/urls", (req, res) => {
  let username = req.cookies["username"];
  dbInstance.collection("urls").find().toArray((err, urls) => {
    res.render("urls_index", {urls: urls,
                              username: username});
  });
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let username = req.cookies["username"];
  dbInstance.collection("urls").findOne({shortURL: shortURL}, (err, url) => {
    res.render("urls_show", url, username);
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

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  console.log('Cookies: ', req.cookies["username"]);
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});