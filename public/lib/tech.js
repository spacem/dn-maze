var techHTML;
function techniques() {
  var modal = $('#modal');
  var title = $('#modal-title');
  var body = $('#modal-body');

  title.text("Techniques");
  body.empty();
  if (!techHTML) {
    body.text('Loading data...');
    body.load('/api/' + dnskillsim_region + '/tech/' + Job.EnglishName, function(res) {
      techHTML = res;
      init_techs();
    });
  } else {
    body.html(techHTML);
    init_techs();
  }

  modal.modal('show');
}

function init_techs() {
  var ids = ['necklace', 'earring', 'ring-1', 'ring-2', 'weapon', 'crest'];
  var keys = ['Necklace', 'Earring', 'Ring1', 'Ring2', 'Weapon', 'Crest'];
  ids.forEach(function(id, i) {
    var tech = $('#tech-' + id);
    var btn = tech.next();
    var skillID = Job.Techs[keys[i]];
    if (skillID) { // already has something at start
      tech.val(skillID).prop('disabled', true);
      btn.removeClass('btn-default').addClass('btn-danger').text('-1');
    }

    btn.prop('disabled', !tech.val() || !skillID);
    tech.change(function() {
      var val = tech.val();
      btn.removeClass('btn-default btn-primary')
         .addClass(val ? 'btn-primary' : 'btn-default')
         .prop('disabled', !val);
    });

    btn.click(function() {
      var skillID = Job.Techs[keys[i]];
      btn.removeClass('btn-default btn-primary btn-danger');
      if (skillID) { // remove tech
        delete Job.Techs[keys[i]];
        btn.text('+1').addClass('btn-primary');
      } else { // add tech
        Job.Techs[keys[i]] = skillID = num(tech.val());
        btn.text('-1').addClass('btn-danger');
      }

      var dom = $('.skill').filter('[data-skill=' + skillID + ']');
      update_skill_icon(skillID, dom);
      if ($dpop.persist && $dpop.persist.data('skill') == skillID) {
        $dpop.update(dom[0], dom);
      }
      tech.prop('disabled', !skillID);
      tech_disable(Job.Techs);
      history_push();
    });
  });

  tech_disable(Job.Techs);
}

function get_tech_count(techs, skillID) {
  if (skillID === undefined) {
    skillID = techs;
    techs = Job.Techs;
  }

  var c = 0;
  for (var key in techs) {
    if (techs[key] == skillID) {
      c++;
    }
  }

  return c;
}

function tech_disable(techs) {
  // general disabling
  var ids = ['necklace', 'earring', 'ring-1', 'ring-2', 'weapon'];
  var keys = ['Necklace', 'Earring', 'Ring1', 'Ring2', 'Weapon'];

  $('.modal').find('option:disabled').prop('disabled', false); // re-enable for now

  for (var i = 0; i < keys.length; i++) {
    var skillID = techs[keys[i]];
    if (!skillID) {
      continue;
    }

    var remainder = [].concat(ids);
    remainder.splice(i,1); // take out self
    remainder.forEach(function(id) {
      if (techs[keys[ids.indexOf(id)]] != skillID) {
        disable_skill_tech($('#tech-' + id), skillID);
      }
    });

    var lvl = Job.Cache[skillID];
    var skill = db.Skills[skillID];
    var counts = get_tech_count(techs, skillID);
    if (lvl[0] + counts >= skill.MaxLevel && techs.Crest != skillID) {
      disable_skill_tech($('#tech-crest'), skillID);
    }
  }

  // disable from crest
  var skillID = techs.Crest;
  if (skillID) {
    var lvl = Job.Cache[skillID];
    var skill = db.Skills[skillID];
    var counts = get_tech_count(techs, skillID);
    if (lvl[0] + counts >= skill.MaxLevel) {
      ids.forEach(function(id, idx) {
        if (techs[keys[idx]] != skillID) {
          disable_skill_tech($('#tech-' + id), skillID);
        }
      });
    }
  }

  // disable lvl 0 skills
  ids.push('crest');
  ids.forEach(function(id) {
    var tech = $('#tech-' + id);
    for (var skillID in db.Skills) {
      var lvl = Job.Cache[skillID];
      if (!lvl[0]) {
        disable_skill_tech(tech, skillID);
      }
    }
  });
}

function disable_skill_tech(tech, skillID) {
  var btn = tech.next();
  if (tech.val() == skillID) { // don't keep it selected
    tech.val('');
    btn.removeClass('btn-primary btn-danger')
       .addClass('btn-default')
       .prop('disabled', true)
       .text('+1');
  }

  // disable the option
  var opt = tech.find('option[value=' + skillID + ']');
  if (opt.length) {
    opt.prop('disabled', true);
  }
}
