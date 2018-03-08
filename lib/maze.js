// gets settings + a fn for templating
var fs = require('fs');
var path = require('path');
var settingsFile = process.env.MAZE_CONFIG ? process.env.MAZE_CONFIG : path.join(__dirname, '../config.json');
var settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));

/*
var timestamp;
try {
  timestamp = fs.readFileSync('./timestamp', 'utf8');
} catch (x) {
  timestamp = parseInt((new Date()).getTime() / 1000);
}
*/

module.exports.settings = settings;
var timestamp = '';
module.exports.timestamp = timestamp;
// timestamp += '-'
module.exports.fn = new (
  function() {
    var thiz = this, uri = settings.uri;
    for (key in uri) {
      uri[key] = uri[key].replace('$server', settings.server).replace('$static', settings['static']);
    }

    this.url = {
      css: function(file) {
        return uri.css + (file ? '/' + timestamp + file + '.css' : '');
      },
      js: function(file) {
        return uri.js + (file ? '/' + timestamp + file + '.js' : '');
      },
      mainbar: function(file) {
        return uri.mainbar + (file ? '/' + timestamp + file + '.png' : '');
      },
      skill: function(file) {
        return uri.skill + (file ? '/' + timestamp + file + '.png' : '');
      },
      uitemplatetexture: function(file) {
        return uri.uitemplatetexture + (file ? '/' + timestamp + file + '.png' : '');
      },
      image: function(file) {
        return uri.image + (file ? '/' + timestamp + file + '.png' : '');
      }
    }

    this.image = {
      job: function(job) {
        var col = job.IconCol * -28.5,
            row = job.IconRow * -28.5
        return 'background-position:' + col + 'px ' + row + 'px';
      },
      skilltree: function(job, version, region) {
        return '';
      }
    }

    this.count_techs = function(techs, skillID) {
      var count = 0;
      for (var tech in techs) {
        if (techs[tech] == skillID) {
          ++count;
        }
      }

      return count;
    }
  }
)