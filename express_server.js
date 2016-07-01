var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var generateRandomShortURL = require('./app.js');
var connect        = require('connect');
var methodOverride = require('method-override');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);

});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase};
  res.render("urls_show", templateVars);
});


app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.put("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomShortURL(6)] = req.body.longURL;   // we learned that body == {}
  console.log(urlDatabase);
  res.send("Refresh to see your new tinyUrl.");         // Respond with 'Ok' (we will replace this)
  //res.redirect("/messages");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});