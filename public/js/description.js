function tag(t, class, text) {
  return $(document.createElement(t)).addClass(class).text(text);
}

function desc_map(class, field) {
  return tag('div', class).append(tag('span', 'o', field + ':'), tag('span'));
}

var desc_fields = [
  desc_map('dlvl', 'Skill Lv.'),
  desc_map('dmp', 'Fee MP'),
  desc_map('dweap', 'Required Weapon'),
  desc_map('dtype', 'Skill Type'),
  desc_map('dele', 'Attribute'),
  desc_map('dcd', 'Cooldown'),
  desc_map('dlimit', 'Level Limit'),
  desc_map('dtsp', 'Total SP'),
  tag('div', 'divider'),
  tag('div', 'dreq o', 'Level Up Requirements:'),
  tag('div', 'dreqlvl').append(tag('span', null, 'Character Level '), tag('span')),
  tag('div', 'dreqskills'),
  tag('div', 'dreqtsp'),
  tag('div', 'dreqsp').append(tag('span', null, 'SP '), tag('span')),
  tag('div', 'divider'),
  tag('div', 'dnow o', 'Skill Descrption'),
  tag('div', 'dnow'),
  tag('div', 'dnext t', 'Next Description'), // t for tangerine
  tag('div', 'dnext')
].reduce(function(p,c) { p.append(c); return p }, tag('div')).children();

function init_description(dom) {

  dom.popover({
    animation: false,
    html: true,
    trigger: 'manual',
    placement: 'auto right',
    content: desc_fields.clone(),
    container: $('body')
  })
  .on('mouseenter', _popover.mouseenter)
  .on('mouseleave', _popover.mouseleave)
  .on('mousedown', _popover.mousedown);

//  dom.data('bs.popover').options.content.html('Goodbye');
//  update_description(dom);
}

function update_description(dom) {
  var skill = db.Skills[dom.data('skill')];
  var description = [
    '<div><span class="o">Skill Lv.:</span></div>',
    '<div class=""><span class="o">Required Weapons:</span></div>',
  ].join('');

  var p = dom.data('bs.popover').options;
  p.title = db.Lookup[skill.NameID];
  p.content = description;
}

var _popover = {
  persist: null,
  mouseenter: function () {
    var dom = $(this), trigger = dom.data('desc');
    if (trigger == 'hover' && !_popover.persist) {
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
      var dom = $(this), trigger = dom.data('desc');
      if (trigger == 'hover') {
        dom.data('desc', 'mclick');
        _popover.persist = dom;
      } else {
        dom.data('desc', 'hover');
        _popover.persist = null;
      }
    }
  }
};
