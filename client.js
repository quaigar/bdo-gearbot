const fetch = require('node-fetch');

function fetchItems() {
  return fetch('https://api.bdoplanner.com/database/items')
    .then(r => r.json())
    .then(r => r.items);
}

module.exports = {
  fetchItems,
};