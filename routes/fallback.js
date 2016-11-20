var express = require('express');
var router = express.Router();

var default_build_path = Array(73).join('-');
module.exports = function(configs) {
  
  router.get('/:job([a-z]+)-:level([0-9]+)/:build', function(req, res) {
    res.redirect(302, '/sea/' + req.params.job + '-' + req.params.level + '/' + req.params.build)
  });
  
  router.get('/:job([a-z]+)', function(req, res) {
    res.redirect(302, '/sea/' + req.params.job);
  })

  router.get('/:job([a-z]+)-:level([0-9]+)', function(req, res) {
    res.redirect(301, '/sea/' + req.params.job + '-' + req.params.level + '/' + default_build_path);
  });

  return router;
};
