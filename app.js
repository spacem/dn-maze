// export express
var express = require('express');
var app = express();
module.exports = app;

// installed libs
var path = require('path');
var cookieParser = require('cookie-parser');
var router = express.Router();
var fs = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(cookieParser());

// custom libs/vars
var maze = require('./lib/maze');
var db = require('./lib/db')(maze.settings.db);
var lang = require('./lib/lang');
var format = require('./lib/format');
lang = lang(process.env.MAZE_REGION ? process.env.MAZE_REGION : 'na');
var jobs = [];
db.FinalJobs = {};
for (var i in db.Jobs) {
  jobs[i] = db.Jobs[i]
  if (jobs[i].JobNumber == 2) {
    db.FinalJobs[jobs[i].EnglishName] = jobs[i];
  }
}

var configs = {
  maze: maze,
  lang: lang,
  jobs: jobs,
  db: db,
  format: format
}

// routes
var home = require('./routes/home')(configs);
var simulator = require('./routes/simulator')(configs);
var api_tech = require('./routes/tech')(configs);

app.use('/', simulator);
app.use('/', home);
app.use('/api', api_tech);

var filePath = __dirname + '/public';
app.use(express.static(filePath));