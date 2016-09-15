var $body = $('body');
var $lang = lang.description;
function popover_placement(popover, td) {
  var parent = $(td).parent();
  var childen = parent.parent().children();
  if(childen.length <= 2) {
    return 'left';
  }
  var index = childen.index(parent);
  if(index >= 2) {
    return 'left';
  }
  else {
    return 'right';
  }
}
function init_description(thiz) {
  $(thiz).popover({animation: false,
                   html: true,
                   trigger: 'manual',
                   placement: popover_placement,
                   container: $body})
         .on('mouseenter', $dpop.mouseenter)
         .on('mouseleave', $dpop.mouseleave)
         .on('mousedown', $dpop.mousedown);
}

function update_description(thiz, dom) {
  var skillID = thiz.getAttribute('data-skill');
  var lvl = Job.Cache[skillID];
  var skill = db.Skills[skillID];
  var opts = dom.data('bs.popover').options;
  opts.title = tag('span', Job.ApplyType ? 's' :null, format($lang.name[Job.ApplyType], db.Lookup[skill.NameID]));
  var d = opts.content ? opts.content : desc_fields.clone(true);
  var techs = get_tech_count(skillID), tech_append = "";
  if (techs > 0) {
    tech_append = " +" + techs;
  }

  // non-level related fields - no conditions
  d.find('.dlvl').find('span:last').text(Math.max(1, lvl[0]) + tech_append);
  d.find('.dlimit').find('span:last').text(lvl[3]);
  if (lvl[2]) {
    d.find('.dtsp').show().removeClass('hidden').find('span:last').text(lvl[2]);
  } else {
    d.find('.dtsp').hide().addClass('hidden');
  }

  // non-level related fields - with conditions
  if (skill.NeedWeaponType) {
    d.find('.dweaps')
     .find('span:last')
     .text(skill.NeedWeaponType.map($d.weapon).join(', '));
  } else {
    d.find('.dweaps').remove();
  }

  var skillType = $lang.type.passive;
  switch(skill.SkillType) {
    case 0: switch(skill.DurationType) {
      case 0: skillType = $lang.type.instant; break;
      case 1: skillType = $lang.type.buff; break;
      case 2: skillType = $lang.type.debuff; break;
    }
    break;
    case 3: skillType = $lang.type.ex; break;
  }
  d.find('.dtype').find('span:last').text(skillType);


  var ele = $lang.element.none;
  switch(skill.Element) {
    case 0: ele = $lang.element.fire; break;
    case 1: ele = $lang.element.water; break;
    case 2: ele = $lang.element.light; break;
    case 3: ele = $lang.element.dark; break;
  }
  d.find('.dele').find('span:last').text(ele);


  // level related fields
  var curr = lvl[0] + techs;
  var nextLevelLimit = skill.LevelLimit[curr-1];
  var nextSkillPoint = skill.SkillPoint[curr];

  var curDecreaseSP = skill.DecreaseSP[Job.ApplyType][curr-1];
  var nextDecreaseSP = skill.DecreaseSP[Job.ApplyType][curr];

  var curDelayTime = skill.DelayTime[Job.ApplyType][curr-1];
  var nextDelayTime = skill.DelayTime[Job.ApplyType][curr];

  var curSkillExplanationID = skill.SkillExplanationID[Job.ApplyType][curr-1];
  var nextSkillExplanationID = skill.SkillExplanationID[Job.ApplyType][curr];

  var curSkillExplanationIDParam = skill.SkillExplanationIDParam[Job.ApplyType][curr-1];
  var nextSkillExplanationIDParam = skill.SkillExplanationIDParam[Job.ApplyType][curr];

  // level up req stuff
  if (nextLevelLimit) {
    d.find('.dreq').show().removeClass('hidden');
    d.find('.dreqlvl')
     .find('span:last')
     .removeClass('r')
     .addClass(Job.MaxLevel < nextLevelLimit ? 'r' : null)
     .text(nextLevelLimit);

    // sp by job req
    if (skill.NeedSP) {
      d.find('.dreqtsp')
       .empty()
       .append(skill.NeedSP.map($d.sp));
    } else {
      d.find('.dreqtsp').remove();
    }

    // skill level req
    if (skill.ParentSkills) {
      var arr = [];
      for (var $skillID in skill.ParentSkills) {
        var reqlvl = skill.ParentSkills[$skillID]
        var $lvl = Job.Cache[$skillID];
        arr.push(tag('div',
                     $lvl[0] < reqlvl ? 'r' : null,
                     format($lang.req.parent, db.Lookup[db.Skills[$skillID].NameID], reqlvl)));
      }
      d.find('.dreqskills')
       .empty()
       .append(arr);
    } else {
      d.find('.dreqskills').remove();
    }


    // stuff that shouldn't show when unnecessary
    var jobNum = dom.closest('.panel').data('job');
    var maxSP = get_max_sp();
    var jobSP = Job.TSP[jobNum];
    var totalSP = get_total_sp();

    d.find('.dreqsp')
     .find('span:last')
     .text(nextSkillPoint)
     .removeClass('r')
     .addClass((jobSP + nextSkillPoint > maxSP*Job.SP[jobNum] ||
                totalSP + nextSkillPoint > maxSP) ? 'r' : null);
  } else {
    d.find('.dreq').hide().addClass('hidden');
  }

  // apply type specific
  var decreaseSP = curDecreaseSP ? curDecreaseSP : nextDecreaseSP;
  if (decreaseSP) {
    d.find('.dmp')
     .removeClass('hidden')
     .show()
     .find('span:last')
     .text(decreaseSP);
  } else {
    d.find('.dmp').hide().addClass('hidden');
  }

  var delayTime = (curDelayTime ? curDelayTime : nextDelayTime) / 1000;
  if (delayTime) {
    d.find('.dcd')
     .removeClass('hidden')
     .show()
     .find('span:last')
     .text(format($lang.cd,  delayTime));
  } else {
    d.find('.dcd').hide().addClass('hidden');
  }


  // descriptions
  var explID = curSkillExplanationID ? curSkillExplanationID : nextSkillExplanationID;
  var explParams = curSkillExplanationIDParam ? curSkillExplanationIDParam : nextSkillExplanationIDParam;
  d.find('.dnowv').html(desc_format(db.Lookup[explID], explParams));
  if (curr == 0 || curr == skill.MaxLevel) { // level 0/maxed; no next, but show next/now
    d.find('.dnext').hide().addClass('hidden');
    d.find('.dnextdiv').hide();
  } else {
    d.find('.dnextdiv').show();
    d.find('.dnext').show().removeClass('hidden');
    d.find('.dnextv').html(desc_format(db.Lookup[nextSkillExplanationID],
                                       nextSkillExplanationIDParam));
  }

  opts.content = d;
}

function desc_tag(cls, field) {
  return tag('div', cls).append(tag('span', 'o', field + ': '), tag('span'));
}

var $d = {
  params: function(p) {
    if (p[0] == '{') {
      return db.Lookup[p.substring(1, p.length - 1)];
    } else {
      return p;
    }
  },
  weapon: function(w) {
    return db.Weapons[w];
  },
  sp: function(sp,i) {
    if (sp > 0) {
      return tag('span',
                 Job.TSP[i] < sp ? 'r' : null,
                 format($lang.req.tsp, Job.Names[i], sp));
    } else {
      return null;
    }
  }
};

var $dpop = {
  persist: null,
  mouseenter: function () {
    var dom = $(this), trigger = dom.data('desc');
    if (trigger == 'hover' && !$dpop.persist) {
      update_description(this, dom);
      dom.popover('show');
    }
  },
  mouseleave: function() {
    var dom = $(this), trigger = dom.data('desc');
    if (trigger == 'hover') {
      dom.popover('hide');
    }
  },
  mousedown: function(e) {
    if (e.button == 1) {
      prevent_default(e);
      var dom = $(this), trigger = dom.data('desc');
      $dpop.update(this, dom);
      if (trigger == 'hover') {
        dom.data('desc', 'mclick');
        $dpop.persist = dom;
      } else {
        dom.data('desc', 'hover');
        $dpop.persist = null;
      }
    }
  },
  update: function(thiz, dom) {
    if ($dpop.persist && $dpop.persist.data('skill') != dom.data('skill')) {
      $dpop.persist.data('desc', 'hover').popover('hide');
      $dpop.persist = null;
    }

    dom.popover('hide');
    update_description(thiz, dom);
    dom.popover('show');
  }
};


function desc_format(str, params) {
  if (!str) return str;

  if(params) {
    params = params.split(',').map($d.params);
  
    for (var i = 0; i < params.length; i++) {
      str = str.replace('{' + i + '}', params[i]);
    }
  }

  var c = 0, w = 0, p = 0, newStr = "", startPos = 0;
  for (var i = 0; i < str.length - 1; i++) {
    switch (str.substr(i, 2)) {
      case "#y": case "#p": case "#r": case "#s": case "#v":
      if (c - w == 1) { // needed a closing </span>
        newStr += str.substring(startPos, i) + "</span><span class=\"" + str.substr(i+1,1) + "\">";
      } else {
        newStr += str.substring(startPos, i) + "<span class=\"" + str.substr(i+1,1) + "\">";
        c++;
      }

      startPos = i + 2;
      ++i;
      break;
      case "#w":
      if (w == c) { // early #w
        newStr +=  str.substring(startPos, i);
      } else {
        newStr += str.substring(startPos, i) + "</span>";
        w++;
      }

      startPos = i + 2;
      ++i;
      default:
      break;
    }
  }

  newStr = newStr + str.substr(startPos);

  if (c != w) {
    newStr = newStr + "</span>";
  }

  return newStr.replace(/\\n/g, "<br />");
}


var desc_fields = tag('div').append(
  desc_tag('dlvl', $lang.fields.lvl),
  desc_tag('dmp', $lang.fields.mp),
  desc_tag('dweaps', $lang.fields.weap),
  desc_tag('dtype', $lang.fields.type),
  desc_tag('dele', $lang.fields.element),
  desc_tag('dcd', $lang.fields.cd),
  desc_tag('dlimit', $lang.fields.limit),
  desc_tag('dtsp', $lang.fields.tsp),
  tag('div', 'divider dreq'),
  tag('div', 'dreq o', $lang.req.lvl_up),
  tag('div', 'dreq dreqlvl').append(
    tag('span', null, $lang.req.char_lvl),
    tag('span')
  ),
  tag('div', 'dreq dreqskills'),
  tag('div', 'dreq dreqtsp'),
  tag('div', 'dreq dreqsp').append(
    tag('span', null, $lang.req.sp),
    tag('span')
  ),
  tag('div', 'dnow').append(
    tag('div', 'dnowf o', $lang.curr),
    tag('div', 'dnowv')
  ),
  tag('div', 'divider dnextdiv'),
  tag('div', 'dnext').append(
    tag('div', 'dnextf o', $lang.next),
    tag('div', 'dnextv')
  )
);
