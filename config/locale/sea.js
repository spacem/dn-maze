var merge = require('webpack-merge')
var na = require('./na')

module.exports = merge(na, {
  skillCrest: 'Skill Heraldry',
  crestsEquipped: 'Skill Heraldries Equipped',
});
