/* global */
function dnss(urls) {
  // initialize all the images
  $('.jobsprite').each(function() {
    this.style.backgroundImage = "url('" + urls.mainbar + "/jobicon_pvp.png')";
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
    var lvl = this.getAttribute('data-lvl').split(',').map(num);
    var grayed = lvl[0] == 0 ? '_b' : '';
    var sprite = this.getAttribute('data-sprite').split(',');
    sprite[1] *= -50;
    sprite[2] *= -50;
    Job.Cache[skillID] = lvl;

    this.style.background = "url('"+ urls.mainbar  +"/skillicon" + sprite[0] + grayed + ".png') " + sprite[1] + "px " + sprite[2] + "px"; // initial setup
    this.getElementsByClassName('skill-bdr')[0].style.background = "url('" + urls.border + "') 100px 0";

    dom.find('.skill-lvl').text([lvl[0] + lvl[3], lvl[4]].join('/'));
    dom.on('mousedown', skill_adj);
  });

  $('.panel-body').on('contextmenu', prevent_default);

  // level selection
  for (var level = Job.Levels.length; level > 0; level--) {
    $('#level').append(tag('option', null, 'Lv. ' + level).val(level));
  }
  $('#level').val(Job.MaxLevel);

  // the apply type
  $('#pvp').click(reverse('#pve', function() { return Job.ApplyType = 1, !0 }));
  $('#pve').click(reverse('#pvp', function() { return Job.ApplyType = 0, !1 }));

  // the strictness
  $('#free').click(reverse('#strict', function() { return Job.Free = true }));
  $('#strict').click(reverse('#free', strict_switch));

  $('#s').val('').on('input', function() {
    var str = $('#s').val();
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
  });

  var RST = 'Reset', INC = 'Raise';
  $('#level').change(function() {
    var val = num($(this).val());
    $('#level-btn').text(val <= Job.MaxLevel ? RST : INC);
  });

  $('#level-btn').mousedown(function() {
    var level = num($('#level').val());
    dskills.each(function() {
      var dom = $(this);
      var skillID = this.getAttribute('data-skill');
      var skill = db.Skills[skillID];
      var lvl = Job.Cache[skillID];

      // update skill lvl
      if (level <= Job.MaxLevel) {
        lvl[0] = db.Skills[skillID].Levels[1].LevelLimit == 1 ? 1 : 0;
        lvl[2] = 0;
        lvl[3] = 0;

        var image = this.style.backgroundImage.replace('_b.png', '.png');
        this.style.backgroundImage = lvl[0] ? image : image.replace('.png', '_b.png');
        dom.find('.skill-bdr')
           .removeClass('g')
           .addClass(lvl[0] ? null : 'g');
      }

      if (level != Job.MaxLevel) {
        // calculate new max SP
        var newMax = 0;
        var absMax = skill.MaxLevel - skill.SPMaxLevel;
        for (var i = absMax, j = 1; i > 0; i--, j++) {
          if (skill.Levels[i].LevelLimit <= level) {
            newMax = i;
            break;
          }

          if (skill.Levels[j].LevelLimit <= level) {
            newMax = j;
          } else {
            break;
          }
        }

        lvl[1] = Math.min(newMax, absMax);
      }

      dom.find('.skill-lvl')
         .removeClass(level <= Job.MaxLevel ? 'g b' : null)
         .text([lvl[0] + lvl[3], lvl[4]].join('/'))

      dom.data('lvl', lvl.join(','));
    });

    // update panels
    var max_sp = get_max_sp(level);

    $('.panel').each(function(jobNum) {
      var spdom = $(this).find('.panel-heading').find('span');
      var sp = spdom.text().split('/').map(num);
      var sp_ratio = Job.SP[jobNum];
      sp[1] = num(max_sp * sp_ratio);
      if (level <= Job.MaxLevel) {
        sp[0] = 0;
      }

      spdom.text(sp.join('/'));
    });

    // other caches to reset

    if (level <= Job.MaxLevel) {
      Job.TSP = [0,0,0];
      Job.SkillGroups = {};
      Job.BaseSkills = {};
    }
    Job.MaxLevel = level;

    update_progress();
    $(this).text(RST);

    history_push();
  });
}

function update_progress() {
  var total_sp = get_total_sp();
  var max_sp = get_max_sp();
  var percent = (total_sp/max_sp) * 100;
  $('#max-progress').text(max_sp + ' SP');
  $('#progress').css('width', percent + '%');
  $('#rem-progress').text((max_sp - total_sp) + ' SP');
  $('#curr-progress').text(total_sp + ' SP');
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
  var changeable = true;
  dskills.each(function() {
    var skillID = num(this.getAttribute('data-skill'));
    var lvl = Job.Cache[skillID];
    var skill = db.Skills[skillID];

    // make sure needsp is fine
    if (lvl[0] > 0) {
      if (!check_skill_reqs(skillID, skill)) {
        changeable = false;
        return;
      }

      if (!check_skill_groups(skillID, skill)) {
        changeable = false;
        return;
      }
    }
  });

  if (changeable && setFree) {
    Job.Free = false;
  }

  return changeable;
}

var warning = $('#warning').detach();
function strict_switch() {
  if (!strict_checker(true)) {
    if (!$('#warning').length) {
      warning.clone()
             .addClass('alert alert-danger')
             .text('Cannot set to strict mode because one or more skill requirements have not been fulfilled.')
             .prepend(tag('a', 'close', '×').attr({"data-dismiss": 'alert', "aria-label": 'close', title: 'close'}))
             .appendTo($('#warning-wrap'));
    }
    return false;
  }
  return true;
}

var build_chars = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'.split('');
function history_push() {
  var build_path = [];
  dskills.each(function() {
    var skillID = this.getAttribute('data-skill');
    var pos = this.getAttribute('data-sprite').split(',')[3];
    var lvl = Job.Cache[skillID];
    var maybeMinus1 = db.Skills[skillID].Levels[1].LevelLimit == 1 ? 1 : 0;
    var b = [];
    b.push(build_chars[lvl[0] - maybeMinus1]);
    lvl[3] > 0 && b.push('!');
    lvl[3] > 1 && b.push('!');
    build_path[pos] = b;
  });

  var full_build_path = [];
  for (var i = 0; i < 72; i++) {
    if (build_path[i] === undefined) {
      full_build_path.push('-');
    } else {
      full_build_path = full_build_path.concat(build_path[i]);
    }
  }

  history.pushState(Job, null, '/' + Job.EnglishName + '-' + Job.MaxLevel + '/' + full_build_path.join(''));
}

window.addEventListener('popstate', function(e) {
  Job = e.state || $Job;
  dskills.each(function() {
    var dom = $(this);
    var skillID = this.getAttribute('data-skill');
    var lvl = Job.Cache[skillID];

    // update indivdual skills
    var image = this.style.backgroundImage.replace('_b.png', '.png');
    this.style.backgroundImage = lvl[0] ? image : image.replace('.png', '_b.png');
    dom.find('.skill-bdr')
       .removeClass('g')
       .addClass(lvl[0] ? null : 'g');
    dom.find('.skill-lvl')
       .removeClass('g b')
       .text([lvl[0] + lvl[3], lvl[4]].join('/'))
       .addClass(lvl[3] == 1 ? 'g' : (lvl[3] == 2 ? 'b' : null));
  });

  var max_sp = get_max_sp();

  // job sp
  $('.panel').each(function(jobNum) {
    var spdom = $(this).find('.panel-heading').find('span');
    var sp = spdom.text().split('/').map(num);
    var sp_ratio = Job.SP[jobNum];
    sp[0] = Job.TSP[jobNum];
    sp[1] = num(max_sp * sp_ratio);
    spdom.text(sp.join('/'));
  });

  update_progress();

  $('#level').val(Job.MaxLevel);

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
});
