var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var generateRandomShortURL = require('./generateRandomShortURL.js');
var connect        = require('connect');
var methodOverride = require('method-override');
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/tinyurl-project";

let dbInstance;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    throw err;
  }
  console.log(`Successfully connected to DB: ${MONGODB_URI}`);
  dbInstance = db;

});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.set("view engine", "ejs");

// var urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// function getLongURL(db, shortURL, cb) {
//   let query = { "shortURL": shortURL };
//   db.collection("urls").findOne(query, (err, result) => {
//     if (err) {
//       return cb(err);
//     }
//     return cb(null, result.longURL);
//   });
// }

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// //need to update function
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//need to update function
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
  dbInstance.collection("urls").findOneAndUpdate({shortURL: req.params.id}, {$set: {longURL: req.body.longURL}}, (err,result) => {
    res.redirect("/urls");
  });
});

//need to update function
app.post("/urls", (req, res) => {
  dbInstance.collection("urls").insertOne({shortURL: generateRandomShortURL(6), longURL: req.body.longURL },
  (err, result) => {
    res.send("Refresh to see your new tinyUrl.");
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});