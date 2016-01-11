'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/booze-ledger-dev'
  },

  // Seed database on startup
  seedDB: true

};
