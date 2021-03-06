function skillsim() {
  // initialize all the images
  $('.jobsprite').each(function() {
    this.style.backgroundImage = "url('" + urls.mainbar + "/" + $TIMESTAMP + "jobicon_main.png')";
  });

  // is async, don't care when we get it
  $.getJSON(urls.job, function(data) {
    db = data;

    // have it stay a little
    dskills.each(function() {
      this.setAttribute('data-desc', 'hover');
      init_description(this);
    });
  });

  dskills.each(function() {
    var dom = $(this);
    var skillID = this.getAttribute('data-skill');
    var lvl = Job.Cache[skillID];
    var grayed = lvl[0] == 0 ? '_b' : '';
    var sprite = Job.Sprites[skillID];
    var techs = get_tech_count(skillID);
    sprite[1] *= -50;
    sprite[2] *= -50;

    this.style.background = "url('"+ urls.mainbar  +"/" + $TIMESTAMP + "skillicon" + sprite[0] + grayed + ".png') " + sprite[1] + "px " + sprite[2] + "px"; // initial setup
    this.getElementsByClassName('skill-bdr')[0].style.background = "url('" + urls.border + "') 100px 0";


    dom.find('.skill-lvl').text([lvl[0] + techs, lvl[3]].join('/'));
    
    var t = this;
    dom.on('mousedown', function(event) {
      if ($dpop.persist) {
        $dpop.update($dpop.persist[0], $dpop.persist);
      }
      skill_adj(event, t);
    });
    
    dom.on("swiperight",function(event) {
      if ($dpop.persist) {
        $dpop.update($dpop.persist[0], $dpop.persist);
      }
      skill_adj({ button: 0}, t);
    });
    dom.on("swipeleft",function(event) {
      if ($dpop.persist) {
        $dpop.update($dpop.persist[0], $dpop.persist);
      }
      skill_adj({ button: 2}, t);
    });
  });

  $('.panel-body').on('contextmenu', prevent_default);


  // the apply type
  $('#pvp').click(reverse('#pve', function() {
                    set_cookie("apply_type", 1);
                    Job.ApplyType = 1;
                    if ($dpop.persist) {
                      $dpop.update($dpop.persist[0], $dpop.persist);
                    }
                    return !0;
                  }));
  $('#pve').click(reverse('#pvp', function() {
                    set_cookie("apply_type", 0);
                    Job.ApplyType = 0;
                    if ($dpop.persist) {
                      $dpop.update($dpop.persist[0], $dpop.persist);
                    }
                    return !0;
                  }));

  // the level
  $('#lv93').click(reverse('#lv95', function() {
                    Job.MaxLevel = 93;
                    history_push();
                    refresh_sp(get_max_sp(), false);
                    if ($dpop.persist) {
                      $dpop.update($dpop.persist[0], $dpop.persist);
                    }
                  }));
  $('#lv95').click(reverse('#lv93', function() {
                    Job.MaxLevel = 95;
                    history_push();
                    refresh_sp(get_max_sp(), false);
                    if ($dpop.persist) {
                      $dpop.update($dpop.persist[0], $dpop.persist);
                    }
                  }));

  // the strictness
  $('#free').click(reverse('#strict', function() {
                     set_cookie('free', 1);
                     return Job.Free = true;
                   }));
  $('#strict').click(reverse('#free', strict_switch));

  var search = 0;
  $('#s').val('').on('input', function() {
    ++search;
    var search_set = search;

    var str = $('#s').val();

    setTimeout(function() {
      if (search != search_set) {
        return;
      }

      search = 0; // reset it

      var re;
      try {
        re = new RegExp(str, 'im');
      } catch (x) {
        return;
      }

      dskills.each(function() {
        var dom = $(this);
        if (str.length > 2) {
          update_description(this, dom);
          var opts = dom.data('bs.popover').options;

          // check title
          var text = opts.title.text();
          if (re.test(text)) {
            this.style.opacity = 1;
            return;
          }

          text = opts.content.clone();
          text.find('.hidden').remove();
          this.style.opacity = re.test(text.text()) ? 1 : .33;
        } else {
          this.style.opacity = 1;
        }
      });
    }, 100); // .1s delay
  });

  $('#level-btn').mousedown(resetBuild);
    
  function resetBuild() {
    var level = Job.MaxLevel;
    dskills.each(function() {
      var dom = $(this);
      var skillID = this.getAttribute('data-skill');
      var skill = db.Skills[skillID];
      var lvl = Job.Cache[skillID];

      // update skill lvl
      if (level <= Job.MaxLevel) {
        Job.Techs = {};
        lvl[0] = db.Skills[skillID].LevelLimit[0] == 1 && db.Skills[skillID].SkillPoint[0] == 0 ? 1 : 0;
        lvl[2] = 0;
        techs = 0;
      }

      if (level != Job.MaxLevel) {
        // calculate new max SP
        var newMax = 0;
        var absMax = skill.MaxLevel - skill.SPMaxLevel;
        for (var i = absMax, j = 1; i > 0; i--, j++) {
          if (skill.LevelLimit[i-1] <= level) {
            newMax = i;
            break;
          }

          if (skill.LevelLimit[j-1] <= level) {
            newMax = j;
          } else {
            break;
          }
        }

        lvl[1] = Math.min(newMax, absMax);
      }

      update_skill_icon(skillID, dom);
    });

    // update panels
    refresh_sp(get_max_sp(level), level <= Job.MaxLevel);

    // other caches to reset
    if (level <= Job.MaxLevel) {
      Job.TSP = [0,0,0];
      Job.SkillGroups = {};
      Job.BaseSkills = {};
    }
    Job.MaxLevel = level;

    update_progress();
    history_push();
  }

  $('#techs').click(techniques)
}

function update_progress() {
  var total_sp = get_total_sp();
  var max_sp = get_max_sp();
  var percent = (total_sp/max_sp) * 100;
  $('#max-progress').text(format(lang.progress.max, max_sp));
  $('#progress').css('width', percent + '%');
  $('#rem-progress').text(format(lang.progress.remaining, max_sp - total_sp));
  $('#curr-progress').text(format(lang.progress.curr, total_sp));
}

function set_opacity(dom, o) {
  if (o < 0 || o > 1) {
    return -1;
  }

  dom.css("opacity", o);
  return o;
};

function prevent_default(e) {
  e.preventDefault();
}

function num(v) {
  return parseInt(v);
}

function sum(p, c) {
  return p+c;
}

function get_total_sp() {
  return Job.TSP.reduce(sum);
}

function get_max_sp(level) {
  return Job.Levels.slice(0, level || Job.MaxLevel).reduce(sum);
}

function tag(t, cls, text) {
  return $(document.createElement(t))
                   .addClass(cls)
                   .text(text);
}

var ON = 'btn-primary', OFF = 'btn-default';
function reverse(rev, handler) {
  return function() {
    if (handler() === false) {
      return;
    }
    $(rev).removeClass(ON).addClass(OFF);
    $(this).addClass(ON);
    history_push();
  };
}

function strict_checker(setFree) {
  var modal = $('#modal');
  var title = $('#modal-title');
  var body = $('#modal-body');
  var changeable = true;
  var warnings = [];

  dskills.each(function() {
    var skillID = num(this.getAttribute('data-skill'));
    var lvl = Job.Cache[skillID];
    var skill = db.Skills[skillID];

    // make sure needsp is fine
    if (lvl[0] > 0) {
      if (!check_skill_reqs_state(skillID, skill, warnings)) {
        changeable = false;
        return;
      }

      if (!check_skill_groups(skillID, skill, warnings)) {
        changeable = false;
        return;
      }
    }
  });

  if (changeable && setFree) {
    Job.Free = false;
    set_cookie('free', 0);
  } else {
    title.text(lang.strict_title);
    body.empty().append(warnings.map(function(v) {
                          return tag('p', null, v);
                        }));
  }

  return changeable;
}

function strict_switch() {
  if (!strict_checker(true)) {
    $('#modal').modal('show');
    return false;
  }
  return true;
}

var build_chars = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'.split('');
function history_push() {
  
  if(typeof dskills === 'undefined') {
    return;
  }

  var build_path = [];
  dskills.each(function() {
    var skillID = this.getAttribute('data-skill');
    var pos = Job.Sprites[skillID][3];
    var lvl = Job.Cache[skillID];
    var maybeMinus1 = db.Skills[skillID].LevelLimit[1-1] == 1 && db.Skills[skillID].SkillPoint[1-1] == 0 ? 1 : 0;
    var b = [build_chars[lvl[0] - maybeMinus1]];
    var techs = get_tech_count(skillID);
    if (techs > 0) {
      if (Job.Techs.Crest == skillID) {
        b.push('.');
      }

      if (Job.Techs.Weapon == skillID) {
        b.push("'");
      }

      ['Necklace', 'Earring', 'Ring1', 'Ring2'].forEach(function(key) {
        if (Job.Techs[key] == skillID) {
          b.push('!');
        }
      });

    }
    b.push();
    build_path[pos] = b;
  });

  var full_build_path = [];
  for (var i = 0; i < build_path.length; i++) {
    if (build_path[i] === undefined) {
      full_build_path.push('-');
    } else {
      full_build_path = full_build_path.concat(build_path[i]);
    }
  }

  history.pushState(Job, null, '/' + dnskillsim_region + '/' + Job.EnglishName + '-' + Job.MaxLevel + '/' + full_build_path.join(''));
}

function refresh_sp(max_sp, reset) {
  // job sp
  $('.panel').each(function(jobNum) {
    var spdom = $(this).find('.panel-heading').find('span');
    var sp = spdom.text().split('/').map(num);
    var sp_ratio = Job.SP[jobNum];
    sp[1] = num(max_sp * sp_ratio);

    if (reset) {
      sp[0] = 0;
    } else {
      sp[0] = Job.TSP[jobNum];
    }

    spdom.text(sp.join('/'));
  });

  update_progress();
}

window.addEventListener('popstate', function(e) {
  oldJob = e.state || jQuery.extend(!0, {}, $Job);
  oldJob.ApplyType = Job.ApplyType;
  oldJob.Free = Job.Free;
  Job = oldJob;

  dskills.each(function() {
    var dom = $(this);
    var skillID = this.getAttribute('data-skill');

    // update indivdual skills
    update_skill_icon(skillID, dom);
  });

  refresh_sp(get_max_sp(), false);

  var a = '#pvp', b = '#pve';
  if (Job.ApplyType) {
    a = '#pve', b = '#pvp';
  }
  $(a).removeClass(ON).addClass(OFF);
  $(b).addClass(ON);

  a = '#free', b = '#strict';
  if (Job.Free) {
    a = '#strict', b = '#free';
  }
  $(a).removeClass(ON).addClass(OFF);
  $(b).addClass(ON);

  if ($dpop.persist) {
    $dpop.update($dpop.persist[0], $dpop.persist);
  }
});

function set_cookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + (356*24*60*60*1000));
    document.cookie = name + "=" + value + "; path=/; expires=" + d.toUTCString();
}

function format(str) {
  var args = Array.prototype.slice.call(arguments, 1);
  var s = '';
  var len = str.length;
  var idx = 0;
  for (var i = 0; i < len; i++) {
    var c1 = str[i], c2 = str[i + 1];
    if (c1 == '?') {
      if (c2 == '?') {
        ++i;
        s += '?';
      } else {
        if (args[idx] === undefined) {
          s += "";
        } else {
          s += args[idx];
        }
        idx++;
      }
    } else {
      s += c1;
    }
  }
  return s;
}
