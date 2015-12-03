var express = require('express');
var router = express.Router();

var default_build_path = Array(73).join('-');
module.exports = function(configs) {
  var maze = configs.maze,
      lang = configs.lang,
      jobs = configs.jobs,
      db = configs.db,
      format = configs.format;

  router.get('/', function(req, res) {
    res.render('home', {
      title: "MAZE",
      fn: maze.fn,
      lang: lang['public'],
      home_body: lang.home_body,
      jobs: jobs,
      cap: db.Levels.length,
      format: format,
      timestamp: maze.timestamp
    });
  });

  router.get('/:job([a-z]+)', function(req, res) {
    res.redirect(302, '/' + req.params.job + '-' + db.Levels.length)
  })

  router.get('/:job([a-z]+)-:level([0-9]+)', function(req, res) {
    res.redirect(301, '/' + req.params.job + '-' + req.params.level + '/' + default_build_path);
  });

  return router;
};