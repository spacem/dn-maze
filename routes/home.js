var express = require('express');
var router = express.Router();

var default_build_path = Array(73).join('-');
module.exports = function(configs) {
   var maze = configs.maze,
      lang = configs.lang,
      jobs = configs.jobs,
      db = configs.db,
      format = configs.format;

  var json_lang = JSON.stringify(lang['public']);
  
  router.get('/', function(req, res) {
    res.render('home', {
      title: "dnskillsim - dragon nest skill simulator",
      fn: maze.fn,
      lang: lang['public'],
      home_body: lang.home_body,
      jobs: jobs,
      cap: db.Levels.length,
      format: format,
      timestamp: maze.timestamp,
      json_lang: json_lang,
      region: configs.region
    });
  });

  router.get('/' + configs.region + '/', function(req, res) {
    res.render('home', {
      title: "dnskillsim - dragon nest skill simulator",
      fn: maze.fn,
      lang: lang['public'],
      home_body: lang.home_body,
      jobs: jobs,
      cap: db.Levels.length,
      format: format,
      timestamp: maze.timestamp,
      json_lang: json_lang,
      region: configs.region
    });
  });
  
  router.get('/' + configs.region + '/:job([a-z]+)', function(req, res) {
    var job = db.FinalJobs[req.params.job];
    if (!job) throw format(lang.error.job_not_found, req.params.job)
    res.redirect(302, req.params.job + '-' + db.Levels.length)
  })

  router.get('/' + configs.region + '/:job([a-z]+)-:level([0-9]+)', function(req, res) {
    var job = db.FinalJobs[req.params.job];
    if (!job) throw format(lang.error.job_not_found, req.params.job)
    res.redirect(301, req.params.job + '-' + req.params.level + '/' + default_build_path);
  });

  return router;
};
