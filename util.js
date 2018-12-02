const _ = require('lodash');

function parseLevel(lvl) {
  return lvl ? Object.assign(
    _.range(0, 16),
    {
      PRI: 16,
      DUO: 17,
      TRI: 18,
      TET: 19,
      PEN: 20,
      I: 16,
      II: 17,
      III: 18,
      IV: 19,
      V: 20,
    }
  )[lvl] : 0;
}


function formatLevel(lvl) {
  if (lvl == 0) return '';
  if (lvl <= 15) return '+' + lvl;
  return ['PRI', 'DUO', 'TRI', 'TET', 'PEN'][lvl - 16];
}


module.exports = {
  parseLevel,
  formatLevel,
};