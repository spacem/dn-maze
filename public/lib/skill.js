function skill_adj(e) {
  if (e.altKey) {
    return; // don't do anything
  }

  var dom = $(this);
  var skillID = num(this.getAttribute('data-skill')); // indexOf is strict
  var max = e.shiftKey || e.ctrlKey;
  var lvl = [].concat(Job.Cache[skillID]); // clone it
  var skill = db.Skills[skillID];
  var techs = get_tech_count(skillID);

  var prev = lvl[0];
  if (e.button == 0) { // left click
    lvl[0] = Math.min(lvl[1], max ? lvl[1] : lvl[0] + 1);
  } else if (e.button == 2) { // right click
    lvl[0] = Math.max(0, max ? 0 : lvl[0] - 1);
    if (skill.LevelLimit[1-1] == 1 && lvl[0] == 0) { // default case
      lvl[0] = 1;
    }
  }

  var panel = dom.closest('.panel');
  var spdom = panel.find('.panel-heading').find('span'); // do something later
  var sp = spdom.text().split('/').map(num);
  var jobNum = num(panel.data('job'));

  // find SP difference
  var diff = 0, end = Math.max(prev, lvl[0]), inc = prev < lvl[0], totalSP = get_total_sp(), maxSP = get_max_sp();
  if (inc) {
    for (var i = prev + 1; i <= lvl[0]; i++) {
      var s = skill.SkillPoint[i-1];
      if (sp[0] + diff + s > sp[1] || totalSP + diff + s > maxSP) {
        lvl[0] = i - 1;
        break;
      }

      diff += s;
    }
  } else {
    for (var i = prev; i > lvl[0]; i--) {
      var s = skill.SkillPoint[i-1];
      diff -= s;
      if (!Job.Free && !can_reduce_skill(skillID, skill, i - 1, jobNum, Job.TSP[jobNum] + diff)) {
        lvl[0] = i;
        diff += s;
        break;
      }
    }
  }

  if (prev == lvl[0] || lvl[0] + techs > skill.MaxLevel) {
    return; // do nothing
  }

  if (!Job.Free) {
    if (lvl[0] > prev) { // skill reduction
      if (!check_skill_reqs(skillID, skill)) {
        return;
      }

      if (!check_skill_groups(skillID, skill)) {
        return;
      }
    }
  }

  if (lvl[0] == 0 && techs > 0) {
    for (var tech in Job.Techs) {
      if (Job.Techs[tech] == skillID) {
        delete Job.Techs[tech];
      }
    }
    techs = 0;
  }

  // add skillgroup
  if (skill.SkillGroup) {
    var g = skill.SkillGroup;
    if (!Job.SkillGroups[g]) { // nothing exists
      Job.SkillGroups[g] = [];
    }

    var group = Job.SkillGroups[g];
    if (lvl[0] && group.indexOf(skillID) == -1) {
      group.push(skillID);
    } else if (!lvl[0] && group.indexOf(skillID) != -1) {
      Job.SkillGroups[g] = group.filter(function($skillID) { return $skillID != skillID });
    }
  }

  if (skill.BaseSkillID) {
    var b = skill.BaseSkillID;
    if (! Job.BaseSkills[b]) {
      Job.BaseSkills[b] = [];
    }
    var base = Job.BaseSkills[b];
    if (lvl[0] && base.indexOf(skillID) == -1) {
      base.push(skillID);
    } else if (!lvl[0] && base.indexOf(skillID) != -1) {
      Job.BaseSkills[b] = base.filter(function($skillID) { return $skillID != skillID });
    }
  }

  // SP adjustment
  sp[0] += diff;
  lvl[2] += diff;
  totalSP += diff;
  Job.TSP[jobNum] += diff;

  // panel update
  spdom.text(sp.join('/'));


  // icon update
  Job.Cache[skillID] = lvl;
  update_skill_icon(skillID, dom, techs);

  // hooks
  update_progress();
  $dpop.update(this, dom);
  history_push();
}

function update_skill_icon(skillID, dom, techs) {
  if (techs === undefined) {
    techs = get_tech_count(skillID);
  }

  var lvl = Job.Cache[skillID];
  var thiz = dom[0];
  var image = thiz.style.backgroundImage.replace('_b.png', '.png');

  thiz.style.backgroundImage = lvl[0] ? image : image.replace('.png', '_b.png');

  dom.find('.skill-bdr')
     .removeClass('g')
     .addClass(lvl[0] ? null : 'g');

  dom.find('.skill-lvl')
     .removeClass('g b')
     .text([lvl[0] + techs, lvl[3]].join('/'))
     .addClass(techs == 1 ? 'g' : (techs == 2 ? 'b' : null));

}


function level_satisfied(skillID, level) {
  var lvl = Job.Cache[skillID];
  return lvl[0] >= level;
}

function check_skill_reqs(skillID, skill) {
  // check if sp total is satisfied
  if (skill.NeedSP) {
    for (var i = 0; i < 3; i++) {
      if (Job.TSP[i] < skill.NeedSP[i]) {
        return false;
      }
    }
  }

  // make sure parent skill is fine
  if (skill.ParentSkills) {
    if (skill.SkillGroup == 1 && Job.SkillGroups[1] && Job.SkillGroups[1].length) {
      if (!check_ult_reqs()) {
        return false;
      }
    } else {
      for (var $skillID in skill.ParentSkills) {
        if (! level_satisfied($skillID, skill.ParentSkills[$skillID])) {
          return false;
        }
      }
    }
  }

  var base = Job.BaseSkills[skill.BaseSkillID];
  if (base && base.indexOf(skillID) == -1 && base.length) {
    return false;
  }

  return true;
}

function check_ult_reqs() {
  var atleastone = false;
  if (Job.SkillGroups[1]) {
    Job.SkillGroups[1].forEach(function(skillID) {
      var skill = db.Skills[skillID];
      var one = true;
      for (var $skillID in skill.ParentSkills) {
        one &= level_satisfied($skillID, skill.ParentSkills[$skillID]);
      }

      atleastone |= one;
    });
  }

  return atleastone;
}

function check_skill_reqs_state(skillID, skill, warnings) {
  // check if sp total is satisfied
  if (skill.NeedSP) {
    for (var i = 0; i < 3; i++) {
      if (Job.TSP[i] < skill.NeedSP[i]) {
        if (warnings) {
          warnings.push(format(lang.warnings.tsp, db.Lookup[skill.NameID], Job.Names[i], skill.NeedSP[i]));
        }
        return false;
      }
    }
  }

  // make sure parent skill is fine
  if (skill.SkillGroup != 1 && skill.ParentSkills) { // doesn't matter for ults
    for (var $skillID in skill.ParentSkills) {
      if (! level_satisfied($skillID, skill.ParentSkills[$skillID])) {
        if(warnings) {
          warnings.push(format(lang.warnings.parent, db.Lookup[skill.NameID], db.Lookup[db.Skills[$skillID].NameID], skill.ParentSkills[$skillID]));
        }

        return false;
      }
    }
  }

  var base = Job.BaseSkills[skill.BaseSkillID];
  if (base && base.indexOf(skillID) != -1 && base.length > 1) {
    if (warnings) {
      base.forEach(function($skillID) {
        if ($skillID != skillID) {
          warnings.push(format(lang.warnings.base, db.Lookup[skill.NameID], db.Lookup[db.Skills[$skillID].NameID]));
        }
      });
    }

    return false;
  }

  return true;
}

// check skill group
function check_skill_groups(skillID, skill, warnings) {
  if (skill.SkillGroup) {
    var group = Job.SkillGroups[skill.SkillGroup];
    if (skill.SkillGroup == 1 && group && group.length) { // ultimate
      if (warnings) { // hate doing this kinda stuff, but :/
        if (!check_ult_reqs()) {
          group.forEach(function($skillID) {
            var $skill = db.Skills[$skillID];
            for (var $$skillID in $skill.ParentSkills) {
              if (! level_satisfied($$skillID, $skill.ParentSkills[$$skillID])) {
                var fmt = format(lang.warnings.parent, db.Lookup[$skill.NameID], db.Lookup[db.Skills[$$skillID].NameID], $skill.ParentSkills[$$skillID]);
                if (warnings.indexOf(fmt) == -1) {
                  warnings.push(fmt);
                }

                return;
              }
            }
          });
          return false;
        }
      }
    } else if (group && group.length) {
      var found = group.indexOf(skillID) != -1;
      if (warnings && group.length > 1 && found) {
        group.forEach(function($skillID) {
          if ($skillID != skillID) {
            warnings.push(format(lang.warnings.group, db.Lookup[skill.NameID], db.Lookup[db.Skills[$skillID].NameID]));
          }
        });
      }
      return group.length == 1 && found;
    }
  }

  return true;
}

function can_reduce_skill(skillID, skill, newLevel, jobNum, newJobSP) {
  for (var $skillID in db.Skills) {
    if ($skillID == skillID) {
      continue;
    }

    var $skill = db.Skills[$skillID];
    var lvl = Job.Cache[$skillID];

    // will this create an SP violation to any other skill?
    if ($skill.NeedSP) {
      if (lvl[0] && newJobSP < $skill.NeedSP[jobNum]) {
        return false;
      }
    }

    if (skill.SkillGroup == 1 && $skill.SkillGroup == 1 && lvl[0] > 0 && !newLevel) {
      var group = Job.SkillGroups[1];
      for (var $$skillID in $skill.ParentSkills) {
        if (!level_satisfied($$skillID, $skill.ParentSkills[$$skillID])) {
          return false;
        }
      }
    } else {
      // is this skill a parent of any other valid skill?
      if ($skill.ParentSkills && $skill.ParentSkills[skillID]) {
        if (lvl[0] && newLevel < $skill.ParentSkills[skillID]) {
          return false;
        }
      }
    }
  }

  return true;
}