"use strict";

const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
function requestHandler(request, response) {
  if (request.url == "/") {
    response.end("Welcome!");
  } else if (request.url == "/urls") {
    response.end("www.lighthouselabs.ca\nwww.google.com");
  } else {
    response.statusCode = 404;
    response.end("Unknown Path");
  }
}

function generateRandomShortUrl() {
  var results = " ";
  var possibilities = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i <= 5; i++) {
    results += possibilities.charAt(Math.floor(Math.random() *  possibilities.length));
  }
  return results;
}

// generateRandomShortUrl(6);

var server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});