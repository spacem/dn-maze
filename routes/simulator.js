var express = require('express');
var router = express.Router();

// two way search
function get_skill_max(skill, cap) {
  var max = 0;
  for (var i = skill.MaxLevel - skill.SPMaxLevel - 1, j = 0; i > -1; i--, j++) {
    if (skill.LevelLimit[i] <= cap) {
      return i + 1;
    }

    if (skill.LevelLimit[j] <= cap) {
      max = j;
    } else {
      break;
    }
  }

  return max + 1;
}

function get_skill_tsp(skill, level) {
  if (level == 0) {
    return 0;
  }

  var total = 0;
  for (var i = 0; i < level; i++) {
    total += skill.SkillPoint[i];
  }

  return total;
}


var buildChars = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_".split('');
module.exports = function(configs) {
  var maze = configs.maze,
      lang = configs.lang,
      jobs = configs.jobs,
      db = configs.db,
      format = configs.format;

  // don't repeatedly do this...
  var json_lang = JSON.stringify(lang['public']);

  router.get('/:job([a-z]+)-:level([0-9]+)/:build([-_a-zA-Z0-9\.!\']{72,})', function(req, res) {
    req.params.level = parseInt(req.params.level);
    if (req.params.level < 1 || req.params.level > db.Levels.length) throw format(lang.error.level_not_found, req.params.level)
    var job = db.FinalJobs[req.params.job];
    if (!job) throw format(lang.error.job_not_found, req.params.job)
    if (req.params.build.length > 78) throw lang.error.build_too_long

    var apply_type = 0, free = true;
    if (req.cookies) {
      if (req.cookies.apply_type == 1) {
        apply_type = 1;
      }

      if (req.cookies.free !== undefined && req.cookies.free == 0) {
        free = false;
      }
    }


    var line = [jobs[jobs[job.ParentJob].ParentJob], jobs[job.ParentJob], job];
    var lvls = {};
    var build = req.params.build.split('');
    var skilltree = [];
    for (var i = 0; i < 3; i++) {
      var st = line[i].SkillTree;
      skilltree = skilltree.concat(st[0], st[1], st[2], st[3], st[4], st[5]);
      
      if(line[i].AwakenSkillTree) {
        st = line[i].AwakenSkillTree;
        skilltree = skilltree.concat(st[0], st[1], st[2], st[3], st[4], st[5]);
      }
    }

    var max_sp = 0;
    for (var i = 0; i < req.params.level; i++) {
      max_sp += db.Levels[i];
    }

    var job_max_sp = [parseInt(max_sp * db.SP[0]), parseInt(max_sp * db.SP[1]), parseInt(max_sp * db.SP[2])];

    var i,j,
        job_num = 0, job_sp = [0,0,0],
        baseskills = {},
        skillgroups = {},
        sprites = {},
        techs = {};

    var acc_techs = {
      'Necklace': 'Necklace',
      'Earring': 'Earring',
      'Ring1': 'Ring',
      'Ring2': 'Ring'
    };

    for (i = 0, j = 0; i < skilltree.length; i++, j++) {
      var c;
      if(j in build) {
        c = build[j]
      }
      else {
        c = '-';
      }
      var id = skilltree[i];
      if (id === null) {
        if (c != '-') {
          // throw lang.error.skill_not_exist;
        }
        continue;
      }

      var $job, skill;
      if (i == 0) {
        $job = line[0];
      } else if (i == 24) {
        $job = line[1];
        job_num = 1;
      } else if (i == 48) {
        $job = line[2];
        job_num = 2;
      }

      skill = $job.Skills[id];
      if(!skill) {
        continue;
      }

      var maybePlus1 = skill.LevelLimit[0] == 1 ? 1 : 0;
      var level = buildChars.indexOf(c) + maybePlus1;

      // tech determination
      for (var k = 1; k <= 2; k++) {
        var end_loop = false;
        switch(build[j + 1]) {
          case '!': // acc
          var found = false;
          for (var acc in acc_techs) {
            if (!techs[acc] && $job.Techs[acc_techs[acc]].indexOf(id) != -1) { // it's for this acc
              found = true;
              techs[acc] = id;
              break;
            }
          }

          if (!found) throw lang.error.invalid_tech;
          j++;
          break;

          case "'": // weapon
          if (techs.Weapon) throw lang.error.invalid_tech;
          if ($job.Techs.Weapon.indexOf(id) == -1) throw lang.error.invalid_tech;
          techs.Weapon = id;
          j++;
          break;

          case '.': // crest
          if (techs.Crest) throw lang.error.invalid_tech;
          if ($job.Techs.Crest.indexOf(id) == -1) throw lang.error.invalid_tech;
          techs.Crest = id;
          j++;
          break;

          default: end_loop = true; break; // not a tech
        }

        if (end_loop) { // did not find anything
          break;
        }
      }

      // next char is a tech, when it shouldn't be
      if (['!','.',"'"].indexOf(build[j+1]) != -1) {
        throw lang.error.invalid_tech;
      }

      if (level + maze.fn.count_techs(techs, id) > skill.MaxLevel) throw lang.error.max_level_exceeded;
      var trueMax = get_skill_max(skill, req.params.level);
      if (level > trueMax) throw lang.error.max_level_exceeded;
      var tsp = get_skill_tsp(skill, level);
      job_sp[job_num] += tsp;
      lvls[id] = [level, trueMax, tsp, skill.MaxLevel - skill.SPMaxLevel];

      if (maybePlus1 && level > 1) {
        free = true;
      } else if (!maybePlus1 && level > 0) {
        free = true;
      }

      if (skill.SkillGroup && level) {
        if (!skillgroups[skill.SkillGroup]) {
          skillgroups[skill.SkillGroup] = [];
        }

        skillgroups[skill.SkillGroup].push(id);
      }

      if (skill.BaseSkillID && level) {
        if (!baseskills[skill.BaseSkillID]) {
          baseskills[skill.BaseSkillID] = [];
        }

        baseskills[skill.BaseSkillID].push(id);
      }

      sprites[id] = [skill.Sprite, skill.IconCol, skill.IconRow, i];
    }

    if (j < build.length) throw lang.error.short_build_path

    // sum of sp checks
    if (job_sp[0] > job_max_sp[0] || job_sp[1] > job_max_sp[1]
                                  || job_sp[2] > job_max_sp[2]
                                  || job_sp[0] + job_sp[1] + job_sp[2] > max_sp) throw lang.error.total_sp_exceeded;

    // tech validity check
    if (techs.Ring1 && techs.Ring1 == techs.Ring2) throw lang.error.invalid_tech; // rings can't be same
    if (techs.Weapon) { // acc and weap are shared
      var accs = ['Necklace', 'Earring', 'Ring1', 'Ring2'];
      for (var i = 0; i < 4; i++) {
        if (techs[accs[i]] == techs.Weapon) throw lang.error.invalid_tech;
      }
    }

    var data = {
      EnglishName: line[2].EnglishName,
      MaxLevel: req.params.level,
      Levels: db.Levels,
      SP: db.SP,
      TSP: job_sp,
      Names: [line[0].JobName, line[1].JobName, line[2].JobName],
      ApplyType: apply_type,
      Free: free,
      BaseSkills: baseskills,
      SkillGroups: skillgroups,
      Cache: lvls,
      Sprites: sprites,
      Techs: techs
    };

    var json_data = JSON.stringify(data);

    var json_urls  = JSON.stringify({
      mainbar: maze.fn.url.mainbar(),
      border: maze.fn.url.uitemplatetexture('uit_gesturebutton'),
      job: maze.fn.url.json(line[2].EnglishName)
    });

    res.render('simulator', {
      title: format(lang.job_title, job.JobName, "dnskillsim"),
      jobs: jobs,
      line: line,
      cap: db.Levels.length,
      fn: maze.fn,
      max_sp: max_sp,
      job_max_sp: job_max_sp,
      tree_pos: 0,
      lang: lang['public'],
      format: format,
      timestamp: maze.timestamp,
      data: data,
      json_data: json_data,
      json_lang: json_lang,
      urls: json_urls
    })
  })

  return router;
};