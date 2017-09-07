const algolia = require('algoliasearch');
const { algolia: config } = require('../config');
const client = algolia(config.app_id, config.api_key);

module.exports = function getIndex(indexName) {
  return client.initIndex(indexName);
};
