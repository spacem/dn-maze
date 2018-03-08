module.exports = function (region) {
  if (!region) {
    region = 'na';
  }

  var locale = require('./' + region);
  return JSON.stringify(locale);
}
