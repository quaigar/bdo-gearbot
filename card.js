const _ = require('lodash');
const {formatLevel} = require('./util');


module.exports.getItemCard = function getItemCard(item, lvl) {
  console.log(item);
  return {
    title: getName(item, lvl),
    url: `https://bddatabase.net/us/item/${item.id}/`,
    color: getColor(item),
    description: getDescription(item, lvl),
    fields: getFields(item, lvl)
  };
}
function getName(item, lvl) {
  if (lvl == 0) return item.name;
  if (lvl <= 15) return formatLevel(lvl) + ' ' + item.name;
  return formatLevel(lvl) + ': ' + item.name;
}
function getDescription(item, lvl) {
  let d = `${_.startCase(item.rarity)} ${_.startCase(item.type)}`;
  if (item.crystals > 0) {
    d += ` (${item.crystals} crystal${item.crystals == 1 ? '' : 's'})`;
  }
  return d;
}
function getColor(item) {
  return ({
    common: 0xFFFFFF,
    uncommon: 0x5ff369,
    rare: 0x0391c4,
    legendary: 0xd36300,
    epic: 0xf6c232,
  })[item.rarity] || 0xCCCCCC;
}


function getFields(item, lvl) {
  const fxObj = getEnhancedEffectsObj(item, lvl);
  const fx = parseEffects(fxObj);
  const fxByGroup = _.groupBy(fx, 'group');

  if (fxByGroup.attack && fxByGroup.defense) {
    return [
      { name: 'Attack', value: formatItemEffectList(fxByGroup.attack), inline: true },
      { name: 'Defense', value: formatItemEffectList(fxByGroup.defense), inline: true },
    ];
  } else if (fxByGroup.attack || fxByGroup.defense) {
    return [
      { name: 'Item Effects', value: formatItemEffectList(fxByGroup.attack || fxByGroup.defense) },
    ];
  }

  return [];
}

// returns the active effects for a given item at the given level
function getEnhancedEffectsObj(item, lvl) {
  if (['belt','earring','necklace','ring'].includes(item.type) && lvl > 0) {
    lvl -= 15;
  }
  if (item.enhancement && item.enhancement[lvl]) {
    return Object.assign({}, ..._.times(lvl+1, l => item.enhancement[l]));
  }
  return {};
}

function parseEffects(fx) {
  const effects = [];

  const parse = (group, key, label, type) => {
    if (fx[key] || fx[key + '_min']) {
      const isRange = !!fx[key + '_min'];
      const value = isRange ? fx[key + '_avg'] : fx[key];

      let valueText = isRange ? ['' + fx[key + '_min'], '' + fx[key + '_max']] : ['' + value];
      if (type && type.includes('+')) valueText = valueText.map(t => '+' + t);
      if (type && type.includes('%')) valueText = valueText.map(t => t + '%');
      valueText = valueText.join(' ~ ');

      const effect = { key, label, value, valueText, group };
      if (isRange) {
        effect.min = fx[key + '_min'];
        effect.max = fx[key + '_max'];
      }
      effects.push(effect);
    }
  };

  // Attack effects
  parse('attack', 'ap', 'AP');
  parse('attack', 'acc', 'Down Attack Damage', '+%');
  parse('attack', 'dmgth', 'Damage to Humans', '+');

  // Defense effects
  parse('defense', 'dp', 'DP')
  parse('defense', 'ev', 'Evasion', '+');
  parse('defense', 'hev', 'Hidden Evasion', '+');
  parse('defense', 'dr', 'Damage Reduction', '+');
  parse('defense', 'hdr', 'Hidden Damage Reduction', '+');

  return effects;
}

function formatItemEffectList(effects) {
  return effects.map(e => `**${e.label}:** ${e.valueText}`).join('\n')
}
