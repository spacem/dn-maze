var express = require('express');
var router = express.Router();

module.exports = function(configs) {
   var maze = configs.maze,
      lang = configs.lang,
      jobs = configs.jobs,
      db = configs.db,
      format = configs.format;

  router.get('/' + configs.region + '/tech/:job([a-z]+)', function(req, res) {
    var job = db.FinalJobs[req.params.job];
    if (!job) throw format(lang.error.job_not_found, req.params.job)

    var line = [jobs[jobs[job.ParentJob].ParentJob], jobs[job.ParentJob], job];
    res.render('tech', {
      lookup: db.Lookup,
      lang: lang['public'],
      line: line,
      format: format
    });
  });
  return router;
};
