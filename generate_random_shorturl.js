function generateRandomShortURL() {
  let results = "";
  let possibilities = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i <= 5; i++) {
    results += possibilities.charAt(Math.floor(Math.random() *  possibilities.length));
  }
  return results;
}

module.exports = generateRandomShortURL;